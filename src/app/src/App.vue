<!--
  - Copyright 2025 Sayak Mukhopadhyay
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<script setup>
import { RouterView } from 'vue-router'
import { computed, onMounted } from 'vue'

import { useAppStore } from '@/stores/app'
import { useGithubStore } from '@/stores/github'
import { useTheme } from 'vuetify'

const appStore = useAppStore()
const githubStore = useGithubStore()

// Handle themes and auto-switching
const vuetifyTheme = useTheme()
const themeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

themeMediaQueryList.onchange = (event) => {
  vuetifyTheme.global.name.value = event.matches ? 'dark' : 'light'
}

vuetifyTheme.global.name.value = themeMediaQueryList.matches ? 'dark' : 'light'

onMounted(async () => {
  appStore.fetchConfig()
  githubStore.fetchUser()
})

const pageTitle = computed(() => {
  return `${document.title} ${appStore.config.version}`
})

const isAuthenticated = computed(() => {
  return !!githubStore.user
})
</script>

<template>
  <v-app id="inspire">
    <v-app-bar :class="{ beta: appStore.beta }">
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" color="primary" :href="githubStore.getLoginUrl()">Login with GitHub</v-btn>

      <div v-else class="d-flex align-center">
        <v-avatar size="32" class="mr-2">
          <v-img :src="githubStore.user.avatar_url" alt="User Avatar"></v-img>
        </v-avatar>
        <span class="mr-2">{{ githubStore.user.name || githubStore.user.login }}</span>
        <v-btn color="error" variant="text" @click="githubStore.logout">Logout</v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3">
      <v-btn variant="text" href="https://github.com/kode-blox/profile-metrics" slim flat>Repository</v-btn>
      <v-btn variant="text" href="https://github.com/kode-blox/profile-metrics/blob/main/LICENSE" slim>License</v-btn>
      <v-btn variant="text" href="https://github.com/marketplace/actions/profile-metrics" slim>GitHub Action</v-btn>
      <span>
        Hosted with ❤️ by
        <a :href="appStore.config.hosted?.link">{{ appStore.config.hosted?.by }}</a>
      </span>
    </v-footer>
  </v-app>
</template>

<style>
/* Add transition for theme color changes */
:root {
  --theme-transition-duration: 1s;
}

/* Apply transitions to all elements that might change color with theme */

.v-application,
.v-application * {
  transition:
    color var(--theme-transition-duration) ease,
    background-color var(--theme-transition-duration) ease,
    border-color var(--theme-transition-duration) ease,
    box-shadow var(--theme-transition-duration) ease !important;
}
</style>
