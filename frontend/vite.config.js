import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// All requests to /api are proxied to the Express backend,
// so the frontend only ever uses relative URLs like fetch('/api/posts').
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true }, // reliable hot-reload inside Docker on Windows
    proxy: {
      '/api': { target: process.env.API_TARGET || 'http://localhost:5000', changeOrigin: true },
    },
  },
})
