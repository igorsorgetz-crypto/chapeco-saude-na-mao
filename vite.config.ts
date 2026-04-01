import { defineConfig } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgPage = repositoryName?.endsWith('.github.io')
const githubPagesBase =
  repositoryName && !isUserOrOrgPage ? `/${repositoryName}/` : '/'

export default defineConfig({
  base:
    process.env.VITE_BASE_PATH ??
    (process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/'),
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used - do not remove them.
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory.
      '@': path.resolve(__dirname, './src'),
    },
  },
  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
