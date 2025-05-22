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

const appStore = useAppStore()

onMounted(() => {
  appStore.fetchConfig()
})

const pageTitle = computed(() => {
  return `${document.title} ${appStore.config.version}`
})
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3">
      <v-btn variant="text" href="https://github.com/kode-blox/profile-metrics" slim flat>Repository</v-btn>
      <v-btn variant="text" href="https://github.com/kode-blox/profile-metrics/blob/main/LICENSE" slim>License</v-btn>
      <v-btn variant="text" href="https://github.com/marketplace/actions/profile-metrics" slim>GitHub Action</v-btn>
      <span>Hosted with ❤️</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
