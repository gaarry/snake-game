import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'web',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './common'),
    },
  },
  build: {
    outDir: '../dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
