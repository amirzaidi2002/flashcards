import { expect, test } from '@playwright/test'
import { currentCardFrontButton } from './utils.js'

test.describe('Review mode ("Review Cards I Don\'t Know")', () => {
  test('shows an empty state when nothing has been marked incorrect yet', async ({ page }) => {
    await page.goto('/study/review')

    await expect(page.getByRole('heading', { name: "Review Cards I Don't Know" })).toBeVisible()
    await expect(
      page.getByText("Great job! You don't have any cards currently marked for review."),
    ).toBeVisible()
  })

  test('a card marked incorrect during study becomes reviewable, and stays eligible even after being answered correctly in review (spec 12.3 "sticky" rule)', async ({
    page,
  }) => {
    // A fresh page load gives this test its own seeded, untouched repository
    // state; every further navigation below uses in-app links (not
    // page.goto) so that state survives across the flow.
    await page.goto('/study/deck-people-family')
    await page.getByRole('button', { name: 'Start Studying' }).click()
    await currentCardFrontButton(page).click()
    await page.getByRole('button', { name: 'I Got It Wrong' }).click()

    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Study', exact: true })
      .click()
    await expect(page).toHaveURL('/study')
    await expect(page.getByText('1 card need review.')).toBeVisible()

    await page.getByRole('link', { name: 'Review Now' }).click()
    await expect(page).toHaveURL('/study/review')
    await expect(page.getByRole('heading', { name: "Review Cards I Don't Know" })).toBeVisible()
    await expect(page.getByText('1 card to study.')).toBeVisible()

    await page.getByRole('button', { name: 'Start Studying' }).click()
    await currentCardFrontButton(page).click()
    await page.getByRole('button', { name: 'I Got It Right' }).click()

    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText("You studied 1 card from Review Cards I Don't Know.")).toBeVisible()
    await expect(page.getByText('Correct: 1')).toBeVisible()
    await expect(page.getByText('Incorrect: 0')).toBeVisible()

    // The lifetime review-eligibility rule never clears once a card has
    // been missed at least once; only that session's live queue shrank.
    await page.getByRole('link', { name: 'Back to Study' }).click()
    await expect(page.getByText('1 card need review.')).toBeVisible()
  })
})
