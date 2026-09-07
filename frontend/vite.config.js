import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,          // fixed port — always localhost:5174
    strictPort: true,    // fail clearly if 5174 is taken (no silent increment)
    proxy: {
      // All /auth and /predict calls proxied to FastAPI backend
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/predict': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
