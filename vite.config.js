import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  // base: './', // GitHub Pages 部署时需要修改为仓库名
  base: process.env.GITHUB_PAGES ? '/kangxiaoxing/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd-mobile']
        }
      }
    }
  }
})