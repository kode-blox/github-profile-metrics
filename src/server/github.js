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

import { App } from 'octokit'
import _ from 'lodash'
import config from './config.js'

export const redirectUrlRoot =
  process.env.NODE_ENV === 'production' ? `https://${config.domain}` : `http://${config.domain}:${config.port}`

export const githubClient = new App({
  oauth: {
    clientId: config.github.clientId,
    clientSecret: config.github.clientSecret,
  },
  appId: config.github.appId,
  privateKey: config.github.privateKey,
  redirectUrl: new URL('/api/github/oauth/callback', redirectUrlRoot).toString(),
})

/**
 * Check if the token is expired and refresh it if needed
 *
 * @param tokens
 * @returns {Promise<{ token: string; expiresAt: string; refreshToken: string; refreshTokenExpiresAt: string } | null>}
 */
export async function checkAndRefreshToken(tokens) {
  const now = new Date()

  if (new Date(tokens.expiresAt) > now) {
    return tokens
  }

  if (new Date(tokens.refreshTokenExpiresAt) > now) {
    const refreshToken = await githubClient.oauth.refreshToken({
      refreshToken: tokens.refreshToken,
    })
    return getTokensFromAuthentication(refreshToken.authentication)
  }

  return null
}

/**
 * Get only the token properties from the authentication obejct
 *
 * @param authentication
 * @returns {{ token: string; expiresAt: string; refreshToken: string; refreshTokenExpiresAt: string }}
 */
export function getTokensFromAuthentication(authentication) {
  return _.pick(authentication, ['token', 'expiresAt', 'refreshToken', 'refreshTokenExpiresAt'])
}
