import { expect, test } from '@playwright/test'

test.describe('Placeholder mode pages (Quiz, Statistics, Import)', () => {
  test('Quiz page shows its coming-soon placeholder with the Quiz Mode badge', async ({ page }) => {
    await page.goto('/quiz')

    await expect(page.getByText('Quiz Mode')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quiz' })).toBeVisible()
    await expect(
      page.getByText('Select a deck to start a multiple-choice quiz. Coming soon.'),
    ).toBeVisible()
  })

  test('Statistics page shows its coming-soon placeholder with the Stats Mode badge', async ({
    page,
  }) => {
    await page.goto('/statistics')

    await expect(page.getByText('Stats Mode')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible()
    await expect(
      page.getByText('Overall learning progress will be shown here. Coming soon.'),
    ).toBeVisible()
  })

  test('Import page shows its coming-soon placeholder with the Import badge', async ({ page }) => {
    await page.goto('/import')

    await expect(page.getByRole('heading', { name: 'Import' })).toBeVisible()
    await expect(
      page.getByText('Import flashcards from a CSV or JSON file. Coming soon.'),
    ).toBeVisible()
  })
})
