/*
 * Copyright 2025 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Router } from 'express'
import { nanoid } from 'nanoid'
import { Octokit } from 'octokit'

import { checkAndRefreshToken, getTokensFromAuthentication, githubClient, redirectUrlRoot } from '../github.js'
import config from '../config.js'

const router = Router()

/**
 * Checks if the redirect URL is valid. For non-production environments, it returns the URL as is. But for production,
 * it checks if the URL's origin matches the redirect URL root.
 *
 * @param url
 * @returns {string | null}
 */
function checkValidRedirectUrl(url) {
  if (process.env.NODE_ENV !== 'production') {
    return url
  }
  const parsedUrl = new URL(url)
  return parsedUrl.origin === redirectUrlRoot ? url : null
}

/**
 * Destroys the express session and clears the cookie.
 *
 * @param req
 * @param res
 * @param status
 * @param body
 */
function destroySession(req, res, status = 204, body = {}) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' })
    }
    res.clearCookie('connect.sid').status(status).json(body)
  })
}

/**
 * Checks if the token is refreshed. If the `refreshedTokens.token` is different from the one in the session, then it
 * means that the token was refreshed. In which case, the session tokens are updated with the new token. The most recent
 * token is returned.
 *
 * @param req
 * @param refreshedTokens
 * @returns {string}
 */
function checkRefreshed(req, refreshedTokens) {
  if (req.session.tokens.token === refreshedTokens.token) {
    return req.session.tokens.token
  }
  req.session.tokens = getTokensFromAuthentication(refreshedTokens)
  return refreshedTokens.token
}

router.get('/oauth/login', (req, res) => {
  const state = nanoid()

  req.session.state = state

  const originUrl = checkValidRedirectUrl(req.query.originUrl)

  const authOptions = {
    state: req.query.state || JSON.stringify({ state, originUrl }),
    allowSignup: req.query.allowSignup === 'true',
  }
  const { url } = githubClient.oauth.getWebFlowAuthorizationUrl(authOptions)

  res.redirect(url)
})

router.get('/oauth/callback', async (req, res) => {
  try {
    if (req.query.error) {
      return res.status(400).json({ error: req.query.error_description })
    }

    const state = JSON.parse(req.query.state)

    if (state.state !== req.session.state) {
      return res.status(400).json({ error: 'Invalid state parameter' })
    }

    req.session.state = null

    if (!req.query.code) {
      return res.status(400).json({ error: 'No code provided' })
    }

    const { authentication } = await githubClient.oauth.createToken({
      code: req.query.code,
    })

    req.session.tokens = getTokensFromAuthentication(authentication)

    res.redirect(state.originUrl)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

router.get('/user', async (req, res) => {
  if (!req.session?.tokens?.token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const tokens = await checkAndRefreshToken(req.session.tokens)

  if (!tokens) {
    return destroySession(req, res, 401, { error: 'Token expired' })
  }

  const token = checkRefreshed(req, tokens)

  const octokit = new Octokit({ auth: token })
  const user = await octokit.rest.users.getAuthenticated()

  res.json(user.data)
})

router.post('/logout', (req, res) => {
  destroySession(req, res)
})

router.post('/revoke', async (req, res) => {
  if (!req.session?.tokens?.token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const tokens = await checkAndRefreshToken(req.session.tokens)

  if (!tokens) {
    return destroySession(req, res, 401, { error: 'Token expired' })
  }

  const token = checkRefreshed(req, tokens)

  await githubClient.oauth.deleteAuthorization({ token })

  res.status(204).end()
})

router.get('/rate_limits', async (req, res) => {
  let rateLimits
  const tokens = !req.session?.tokens?.token
    ? { token: config.github.pat }
    : await checkAndRefreshToken(req.session.tokens)

  if (!tokens) {
    return destroySession(req, res, 401, { error: 'Token expired' })
  }

  // Checks if the token is a OAuth token and if it's so, run the check to see if it's refreshed
  const token = tokens.refreshToken ? checkRefreshed(req, tokens) : tokens.token

  const octokit = new Octokit({ auth: token })
  rateLimits = (await octokit.rest.rateLimit.get()).data
  res.status(200).json(rateLimits)
})

export default router
