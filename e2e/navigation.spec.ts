import { expect, test } from '@playwright/test'

test.describe('Home page and primary navigation', () => {
  test('shows the mode hub with all five colored mode buttons', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Spanish Flashcards' })).toBeVisible()

    const modeMenu = page.getByRole('navigation', { name: 'Modes' })
    await expect(modeMenu.getByRole('link', { name: 'Study Mode' })).toBeVisible()
    await expect(modeMenu.getByRole('link', { name: 'Quiz Mode' })).toBeVisible()
    await expect(modeMenu.getByRole('link', { name: 'Stats Mode' })).toBeVisible()
    await expect(modeMenu.getByRole('link', { name: 'Decks' })).toBeVisible()
    await expect(modeMenu.getByRole('link', { name: 'Import' })).toBeVisible()
  })

  test('each mode button navigates to its destination page', async ({ page }) => {
    await page.goto('/')
    const modeMenu = page.getByRole('navigation', { name: 'Modes' })

    await modeMenu.getByRole('link', { name: 'Study Mode' }).click()
    await expect(page).toHaveURL('/study')
    await expect(page.getByRole('heading', { name: 'Study', exact: true })).toBeVisible()

    await page.goto('/')
    await modeMenu.getByRole('link', { name: 'Quiz Mode' }).click()
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByRole('heading', { name: 'Quiz' })).toBeVisible()

    await page.goto('/')
    await modeMenu.getByRole('link', { name: 'Stats Mode' }).click()
    await expect(page).toHaveURL('/statistics')
    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible()

    await page.goto('/')
    await modeMenu.getByRole('link', { name: 'Decks' }).click()
    await expect(page).toHaveURL('/decks')
    await expect(page.getByRole('heading', { name: 'Decks' })).toBeVisible()

    await page.goto('/')
    await modeMenu.getByRole('link', { name: 'Import' }).click()
    await expect(page).toHaveURL('/import')
    await expect(page.getByRole('heading', { name: 'Import' })).toBeVisible()
  })

  test('primary nav bar links to every top-level section from any page', async ({ page }) => {
    await page.goto('/decks')
    const nav = page.getByRole('navigation', { name: 'Primary' })

    await expect(nav.getByRole('link', { name: 'Spanish Flashcards' })).toBeVisible()

    await nav.getByRole('link', { name: 'Study', exact: true }).click()
    await expect(page).toHaveURL('/study')

    await nav.getByRole('link', { name: 'Quiz', exact: true }).click()
    await expect(page).toHaveURL('/quiz')

    await nav.getByRole('link', { name: 'Statistics' }).click()
    await expect(page).toHaveURL('/statistics')

    await nav.getByRole('link', { name: 'Import' }).click()
    await expect(page).toHaveURL('/import')

    await nav.getByRole('link', { name: 'Decks' }).click()
    await expect(page).toHaveURL('/decks')
  })

  test('nav bar highlights the active section', async ({ page }) => {
    await page.goto('/decks')
    const activeLink = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', {
      name: 'Decks',
    })
    await expect(activeLink).toHaveClass(/nav__link--active/)
  })

  test('unknown routes show a 404 page with a way back', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to Decks' }).click()
    await expect(page).toHaveURL('/decks')
  })
})
