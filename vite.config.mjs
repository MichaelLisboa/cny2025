import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import path from 'path';

export default defineConfig({
  plugins: [
    imagetools(), // Plugin for image processing
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    assetsInlineLimit: 0, // Prevent inlining small assets
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    emptyOutDir: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  publicDir: 'public',
});