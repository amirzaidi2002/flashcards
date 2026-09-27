import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // `e2e/**` holds Playwright specs, which use @playwright/test's own
    // test runner/globals rather than Vitest's, so they must never be
    // collected here.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
