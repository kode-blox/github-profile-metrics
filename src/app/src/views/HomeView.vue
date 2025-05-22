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

const appStore = useAppStore()
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="4">
        <v-card variant="outlined" v-if="appStore.config.modes?.includes('embed')" class="mt-6 mb-6">
          <v-card-item>
            <v-card-title>Create your own metrics</v-card-title>
          </v-card-item>
          <v-card-text>
            Choose among dozens of plugins and hundreds of options to craft your own custom metrics infographics.
            Preview renders and auto-generate a configuration file.
          </v-card-text>
          <v-card-actions>
            <v-row align="center">
              <v-col cols="10" class="pr-0">
                <v-text-field variant="outlined" density="compact" hide-details="auto" />
              </v-col>

              <v-col cols="2">
                <v-btn variant="elevated" color="success">Start</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>

        <v-card variant="outlined" v-if="appStore.config.modes?.includes('insights')" class="mt-6 mb-6">
          <v-card-item>
            <v-card-title>Search a GitHub user</v-card-title>
          </v-card-item>
          <v-card-text>
            Display rankings, highlights, contributions, repositories, user reactions, stars, commits history, used
            languages and recent activity from any user account.
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="10" class="pr-0">
                <v-text-field variant="outlined" density="compact" hide-details="auto" />
              </v-col>

              <v-col cols="2">
                <v-btn variant="elevated" color="success">Search</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>

        <v-alert color="warning" variant="outlined">
          Metrics are rendered by <a href="https://profilemetrics.kodeblox.com/">profilemetrics.kodeblox.com</a> in preview mode.<br />
          Any backend changes won't be reflected but client-side rendering can still be tested.
        </v-alert>

        <v-alert color="warning" variant="outlined">
          This web instance has run out of GitHub API requests. Please wait until {{ rlreset }} to generate metrics
          again.
        </v-alert>

        <section>
<!--          <small :class="{ 'error-text': !requests.rest.remaining || !requests.graphql.remaining }">-->
<!--            Remaining GitHub requests-->
<!--            <span v-if="requests.login"> for {{ requests.login }}</span>-->
<!--            : {{ requests.rest.remaining }} REST / {{ requests.graphql.remaining }} GraphQL /-->
<!--            {{ requests.search.remaining }} search-->
<!--          </small>-->
          <small>
            Send feedback on
            <a href="https://github.com/kode-blox/profile-metrics/discussions" target="_blank">GitHub discussions</a>
          </small>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>
