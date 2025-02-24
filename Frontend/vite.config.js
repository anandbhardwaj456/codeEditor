import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allows access from network
    port: 5173,  // Change if needed
    allowedHosts: ["codeeditor-3-fy6t.onrender.com"],  // Allow Render deployment
    proxy: {
      "/api": {
        target: "https://codeeditor-1-ocln.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
