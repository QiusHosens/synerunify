import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // svgr({
    //   include: '**/*.svg?react', // 仅处理带 ?react 的 SVG
    //   exclude: '**/*.svg', // 其他 SVG 作为静态资源
    // }),
    // svgr({
    //   svgrOptions: {
    //     svgo: true,
    //     svgoConfig: {
    //       removeViewBox: false, // 保留 viewBox 以正确缩放
    //     },
    //   },
    // }),
    svgr({
      svgrOptions: {
        icon: true, // 使 SVG 尺寸可继承，适合图标
        svgo: true, // 优化 SVG
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false, // 保留 viewBox，防止尺寸问题
                },
              },
            },
          ],
        },
      },
      include: '**/*.svg', // 处理所有 SVG 文件
      // include: '/src/assets/image/svg/*.svg?react', // 处理所有 SVG 文件
      exclude: []
    }),
    viteMockServe({
      mockPath: "src/mocks",
      enable: false,
      logger: true,
      watchFiles: true, // 监视文件更改
      ignore: () => true,
    }),
  ],
  // assetsInclude: ['**/*.svg'], // 确保 Vite 识别 SVG 作为静态资源（如果不转为组件）
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Configure @ to point to src directory
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
        target: "http://localhost", // 目标 API 地址 http://192.168.1.18:30850/http://localhost:9000
        changeOrigin: true, // 允许跨域请求
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，将 /api 替换为空
      },
    },
  },
});
