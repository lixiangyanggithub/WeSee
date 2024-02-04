import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 80,//端口号,前端端口号，ip127.0.0.1
    host: "0.0.0.0",//ip地址 或 '0.0.0.0' 或 "loaclhost"
    open: false, //启动后是否自动打开浏览器
    https: false, // 是否开启 https
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
