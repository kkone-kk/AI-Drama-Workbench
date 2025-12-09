import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // 关键：确保静态资源相对路径正确
  build: {
    outDir: 'dist',  // 输出目录，与wrangler配置一致
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 确保文件名稳定，避免缓存问题
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
