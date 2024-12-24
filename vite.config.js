// Vite configuration
import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Root directory for the project
  publicDir: 'public', // Public directory for static assets
  build: {
    outDir: 'dist', // Output directory for production build
    rollupOptions: {
      input: './index.html' // Entry point for Vite
    }
  },
  server: {
    open: true, // Automatically open the app in the browser
  }
});
