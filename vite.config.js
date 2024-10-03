import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject any custom environment variables here
    'process.env': JSON.stringify(process.env),
  },
})
