import { defineConfig, devices } from '@playwright/test'

/**
 * Runs against a dedicated dev-server port (not 5173) so these tests never
 * collide with a Vite dev server you might already have running manually
 * while developing. Playwright starts/stops this server itself.
 */
const PORT = 5183
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    // The flashcard flip is a real 0.5s CSS 3D transform; the app already
    // honors `prefers-reduced-motion` (see `src/index.css`) to disable it,
    // so opt into that here rather than adding artificial waits/sleeps
    // throughout the tests.
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
