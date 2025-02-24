import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allows access from network
    port: 5173,  // Change if needed
    allowedHosts: [
      "codeeditor-3-fy6t.onrender.com",
      "anandcodeeditor.onrender.com"
    ],  // Add new Render domain
    proxy: {
      "/api": {
        target: "https://anandcodeeditor.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
