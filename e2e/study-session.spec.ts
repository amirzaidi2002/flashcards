import { expect, test } from '@playwright/test'
import { completeStudySession, currentCardFrontButton } from './utils.js'

test.describe('Deck study session', () => {
  test('Study landing page offers a way to browse decks and a review CTA', async ({ page }) => {
    await page.goto('/study')

    await expect(page.getByRole('heading', { name: 'Study', exact: true })).toBeVisible()
    await expect(page.getByText('Select a deck to start studying.')).toBeVisible()
    await page.getByRole('link', { name: 'Browse decks' }).click()
    await expect(page).toHaveURL('/decks')
  })

  test('shows a "deck not found" message for an invalid deck id', async ({ page }) => {
    await page.goto('/study/no-such-deck')

    await expect(page.getByRole('heading', { name: 'Deck not found' })).toBeVisible()
    await page.getByRole('link', { name: 'Browse decks' }).click()
    await expect(page).toHaveURL('/decks')
  })

  test('flips a card to reveal its translation and mark/answer controls', async ({ page }) => {
    await page.goto('/study/deck-beginner-basics')

    await page.getByRole('button', { name: 'Start Studying' }).click()
    await expect(page.getByText('Card 1 of')).toBeVisible()

    const frontButton = currentCardFrontButton(page)
    await expect(frontButton).toBeVisible()
    // The back face (and its buttons) is `aria-hidden` until the card is
    // flipped, so it's intentionally invisible to role-based queries here;
    // a plain CSS locator can still see it in the DOM to check `disabled`.
    await expect(page.locator('.flashcard__face--back .btn--success')).toBeDisabled()

    await frontButton.click()

    await expect(page.getByRole('button', { name: 'I Got It Right' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'I Got It Wrong' })).toBeEnabled()
  })

  test('completing every card in a deck shows an accurate session summary', async ({ page }) => {
    await page.goto('/study/deck-travel')
    await page.getByRole('button', { name: 'Start Studying' }).click()

    await completeStudySession(page)

    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText(/You studied \d+ cards from Travel\./)).toBeVisible()
    await expect(page.getByText('Incorrect: 0')).toBeVisible()
  })

  test('a missed card is retried once more before the session ends', async ({ page }) => {
    await page.goto('/study/deck-numbers-time')
    await page.getByRole('button', { name: 'Start Studying' }).click()

    await completeStudySession(page, { firstAnswer: 'incorrect' })

    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    // The missed card earns exactly one retry, so the summary must show
    // exactly one incorrect answer even though the card is answered twice.
    await expect(page.getByText('Incorrect: 1')).toBeVisible()
  })

  test('"Study Again" restarts the same deck from the beginning', async ({ page }) => {
    await page.goto('/study/deck-common-adjectives')
    await page.getByRole('button', { name: 'Start Studying' }).click()

    await completeStudySession(page)
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()

    await page.getByRole('button', { name: 'Study Again' }).click()

    await expect(page.getByText('Card 1 of')).toBeVisible()
    await expect(currentCardFrontButton(page)).toBeVisible()
  })
})
