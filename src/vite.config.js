import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/discite-app-claude/', // Replace 'discite-app-claude' with your repository name
  plugins: [react()],
})