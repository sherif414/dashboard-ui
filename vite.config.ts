import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: [
      { find: /^~\//, replacement: `${fileURLToPath(new URL('./src/', import.meta.url))}` },
      { find: '~', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  plugins: [
    Vue(),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
  ],
})
