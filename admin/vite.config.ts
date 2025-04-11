import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: 'src/mocks',
      enable: false,
      ignore: () => true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Configure @ to point to src directory
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./src/styles/variables.scss";`,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:9000", // 目标 API 地址
        changeOrigin: true, // 允许跨域请求
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，将 /api 替换为空
      },
    },
  },
})
