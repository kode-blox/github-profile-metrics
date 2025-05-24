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

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GithubAuthView from '@/views/GithubAuthView.vue'
import { useGithubStore } from '@/stores/github.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/github-auth',
      name: 'github-auth',
      component: GithubAuthView,
    },
  ],
})

router.afterEach((to, from) => {
  const githubStore = useGithubStore()
  if (to.name === 'github-auth') {
    githubStore.lastPageBeforeLogin = `${window.location.origin}${from.path}`
  }
})

export default router
