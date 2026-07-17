import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Discite/',
   // This MUST match your GitHub repository name exactly
})