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

import { config as dotenvConfig } from 'dotenv'
import { readFileSync } from 'fs'
import packageJson from '../../package.json' with { type: 'json' }

dotenvConfig()

const config = {
  port: parseInt(process.env.PORT || '3000'),
  version: packageJson.version,
  modes: process.env.MODES.split(','),
  domain: process.env.DOMAIN || 'localhost',
  hosted: {
    by: process.env.HOSTED_BY,
    link: process.env.HOSTED_LINK,
  },
  github: {
    appId: process.env.GITHUB_APP_ID,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    privateKey: readFileSync(process.env.GITHUB_PRIVATE_KEY, 'utf8'),
    pat: process.env.GITHUB_PAT,
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  sessionSecret: process.env.SESSION_SECRET,
}

export default config
