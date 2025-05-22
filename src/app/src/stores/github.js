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

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/index.js'

export const useGithubStore = defineStore('github', () => {
  const user = ref(null)
  const rateLimits = ref(null)

  async function fetchUser() {
    try {
      user.value = await api.getGithubUser()
    } catch (error) {
      console.error('Error fetching github user:', error)
      user.value = null
    }
  }

  async function logout() {
    try {
      user.value = null
      await api.githubLogout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  function getLoginUrl() {
    const loginUrl = new URL(api.getLoginUrl())
    loginUrl.searchParams.set('originUrl', window.location.href)
    return loginUrl.toString()
  }

  async function fetchRateLimits() {
    try {
      rateLimits.value = await api.getGithubRateLimits()
    } catch (error) {
      console.error('Error fetching github rate limits:', error)
      rateLimits.value = null
    }
  }

  return {
    user,
    rateLimits,
    fetchUser,
    logout,
    getLoginUrl,
    fetchRateLimits,
  }
})
