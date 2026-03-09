import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// SPA fallback: serve index.html for client-side routes (fixes 404 on direct /services, /about, etc.)
function spaFallback() {
  const fallbackMiddleware = (req: { url?: string }, _res: object, next: () => void) => {
    const url = req.url ?? ''
    const hasExtension = path.extname(url.split('?')[0]).length > 0
    const isAsset = url.startsWith('/assets/') || url.startsWith('/@') || url.startsWith('/node_modules/')
    if (!hasExtension && !isAsset && url !== '/' && !url.startsWith('/images/')) {
      req.url = '/index.html'
    }
    next()
  }
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use(fallbackMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(fallbackMiddleware)
    },
    closeBundle() {
      const distIndex = path.resolve(__dirname, 'dist/index.html')
      const dist404 = path.resolve(__dirname, 'dist/404.html')
      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist404)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    spaFallback(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
