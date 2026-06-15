import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Prevent Vite pre-bundling from breaking Firebase module interop
    // (the app currently crashes with: require_isUnsafeProperty is not a function)
    exclude: ['firebase'],
  },
})

