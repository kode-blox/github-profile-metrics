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

import { githubClient, redirectUrlRoot } from '../github.js'

const router = Router()

const checkValidRedirectUrl = (url) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return url
    }
    const parsedUrl = new URL(url)
    return parsedUrl.origin === redirectUrlRoot ? url : null
  } catch {
    return false
  }
}

router.get('/oauth/login', (req, res) => {
  const state = nanoid()

  req.session.state = state

  const originUrl = checkValidRedirectUrl(req.query.originUrl)

  const authOptions = {
    state: req.query.state || JSON.stringify({ state, originUrl }),
    allowSignup: req.query.allowSignup === 'true',
  }
  const { url } = githubClient.getWebFlowAuthorizationUrl(authOptions)

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

    const { authentication } = await githubClient.createToken({
      code: req.query.code,
    })

    req.session.token = authentication.token

    res.redirect(state.originUrl)
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

router.get('/user', async (req, res) => {
  if (!req.session?.token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const octokit = new Octokit({ auth: req.session.token })

  const user = await octokit.rest.users.getAuthenticated()

  res.json(user.data)
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' })
    }
    res.clearCookie('connect.sid').status(204).end()
  })
})

export default router
