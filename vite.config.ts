import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ant-design/icons/lib/dist$': 'ant-design-vue/es/icons/index.js'
    }
  },
  optimizeDeps: {
    include: ['@ant-design/icons-vue']
  }
})
