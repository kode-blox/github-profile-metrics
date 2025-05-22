import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vite.dev/config/

console.log(fileURLToPath(new URL('./src', import.meta.url)))

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vueDevTools(),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
