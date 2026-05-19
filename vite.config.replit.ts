import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Replit-specific server configuration
  server: {
    host: '0.0.0.0', // Required for Replit to expose the dev server
    port: 5173,
    strictPort: true, // Fail if port is already in use
    hmr: {
      clientPort: 443, // Use HTTPS port for HMR in Replit
    },
  },

  // Preview server configuration (for production builds)
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
