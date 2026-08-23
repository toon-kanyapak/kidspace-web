import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages serves a project site from /<repo>/, so the base path comes from
 * the CI environment (VITE_BASE) and falls back to "/" for local dev and for
 * user/org pages served from the domain root.
 */
const base = process.env.VITE_BASE || '/'

/**
 * Pages has no SPA rewrite rule: a deep link like /activities/peekaboo would 404
 * before React Router ever loads. Serving the same document as 404.html makes
 * Pages hand every unknown path back to the app, which then routes it client-side.
 */
function githubPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist')
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
      // keep Pages from running the files through Jekyll
      writeFileSync(resolve(out, '.nojekyll'), '')
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
})
