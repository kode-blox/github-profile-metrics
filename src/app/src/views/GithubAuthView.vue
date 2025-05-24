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
import { useAppStore } from '@/stores/app'
import { useGithubStore } from '@/stores/github.js'

const appStore = useAppStore()
const githubStore = useGithubStore()
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col xl="6" lg="8" md="10" sm="12">
        <p class="text-center">
          Signing in with your GitHub account lets you use this web instance with your own API requests quota.
          <br />
          <br />
          A session identifier will be stored in your
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">browser's localStorage</a>
          and will be used by the server to load custom
          <a href="https://github.com/octokit">GitHub Octokit</a>
          instances that are linked to your account.
          <br />
          <br />
          <template v-if="appStore.allExtras.length">
            The following extra features permissions will be granted when logged with your GitHub account:
            <ul id="extras">
              <li v-for="extra in appStore.allExtras" :key="extra">
                <code>{{ extra }}</code>
              </li>
            </ul>
          </template>
          <br />
          <br />
          <v-btn v-if="!githubStore.isAuthenticated" color="primary" :href="githubStore.loginUrl">
            Login with GitHub
          </v-btn>
          <template v-else>
            <v-btn color="error" @click="githubStore.revoke">Revoke Authorization</v-btn>
            <br />
            <small>Session: {{ appStore.config.sessionId }}</small>
          </template>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#extras {
  display: inline-block;

  li {
    text-align: initial;
  }
}
</style>
