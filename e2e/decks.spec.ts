import { expect, test } from '@playwright/test'

test.describe('Decks page', () => {
  test('lists every starter deck with a card count and Study/Quiz links', async ({ page }) => {
    await page.goto('/decks')

    await expect(page.getByRole('heading', { name: 'Decks' })).toBeVisible()

    const deckCard = page.locator('.deck-card').filter({ hasText: 'Beginner Basics' })
    await expect(deckCard).toBeVisible()
    await expect(deckCard.getByText(/\d+ cards?/)).toBeVisible()
    await expect(deckCard.getByRole('link', { name: 'Study' })).toHaveAttribute(
      'href',
      '/study/deck-beginner-basics',
    )
    await expect(deckCard.getByRole('link', { name: 'Quiz' })).toHaveAttribute(
      'href',
      '/quiz/deck-beginner-basics',
    )

    // Sanity-check a second, differently-named deck is also present.
    await expect(page.locator('.deck-card').filter({ hasText: 'Common Verbs' })).toBeVisible()
  })

  test('clicking Study on a deck card opens that deck\u2019s study session', async ({ page }) => {
    await page.goto('/decks')

    await page
      .locator('.deck-card')
      .filter({ hasText: 'Food & Drinks' })
      .getByRole('link', { name: 'Study' })
      .click()

    await expect(page).toHaveURL('/study/deck-food-drinks')
    await expect(page.getByRole('heading', { name: 'Food & Drinks' })).toBeVisible()
    await expect(page.getByText(/cards to study\./)).toBeVisible()
  })
})
