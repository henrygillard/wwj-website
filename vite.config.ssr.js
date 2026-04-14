import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate config for SSR bundle — outputs entry-server.js into dist/
// without wiping the client build that's already there.
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/entry-server.jsx',
    },
  },
})
