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

const API_ROOT = ''
const GITHUB_API_ROOT = `${API_ROOT}/github`

export const apiRoutes = {
  config: () => `${API_ROOT}/config`,
  github: {
    login: () => `${GITHUB_API_ROOT}/oauth/login`,
    user: () => `${GITHUB_API_ROOT}/user`,
    logout: () => `${GITHUB_API_ROOT}/logout`,
    revoke: () => `${GITHUB_API_ROOT}/revoke`,
    rateLimits: () => `${GITHUB_API_ROOT}/rate_limits`,
  },
}
