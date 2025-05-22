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

import { apiAxiosInstance } from './axiosInstance'
import { apiRoutes } from './route'

async function fetchConfig() {
  return (await apiAxiosInstance.get(apiRoutes.config())).data
}

function getGithubLoginUrl() {
  return apiAxiosInstance.defaults.baseURL + apiRoutes.github.login()
}

async function getGithubUser() {
  return (await apiAxiosInstance.get(apiRoutes.github.user())).data
}

function githubLogout() {
  apiAxiosInstance.get(apiRoutes.github.logout())
}

async function getGithubRateLimits() {
  return (await apiAxiosInstance.get(apiRoutes.github.rateLimits())).data
}

export default {
  fetchConfig,
  getLoginUrl: getGithubLoginUrl,
  getGithubUser,
  githubLogout,
  getGithubRateLimits,
}
