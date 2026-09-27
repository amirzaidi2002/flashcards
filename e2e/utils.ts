import type { Locator, Page } from '@playwright/test'

/** The front-face button of whichever flashcard is currently showing. */
export function currentCardFrontButton(page: Page): Locator {
  return page.getByRole('button', { name: /^Spanish word:/ })
}

/**
 * Flips the currently-shown flashcard and answers it, repeating until the
 * session's summary screen appears. Defaults to always answering
 * "correct" so a full deck completes in the minimum number of rounds
 * (no in-session retries); pass `firstAnswer: 'incorrect'` to exercise the
 * one-retry-per-card behavior (see `CardSelectionService.reinsertForRetry`)
 * on the very first card of the session.
 */
export async function completeStudySession(
  page: Page,
  options: { firstAnswer?: 'correct' | 'incorrect' } = {},
): Promise<void> {
  const { firstAnswer = 'correct' } = options
  const summaryHeading = page.getByRole('heading', { name: 'Session complete' })
  const frontButton = currentCardFrontButton(page)
  // Matches whichever of the two shows up next, so we don't have to guess
  // exactly when React has finished re-rendering after each click.
  const nextStateIndicator = summaryHeading.or(frontButton)

  let isFirstCard = true
  // A generous but finite bound so a real bug (session never completing)
  // fails the test instead of hanging forever.
  for (let round = 0; round < 200; round++) {
    if (await summaryHeading.isVisible()) return

    await frontButton.click()
    const result = isFirstCard ? firstAnswer : 'correct'
    const buttonName = result === 'correct' ? 'I Got It Right' : 'I Got It Wrong'
    await page.getByRole('button', { name: buttonName }).click()
    isFirstCard = false

    await nextStateIndicator.first().waitFor()
  }

  throw new Error('completeStudySession: exceeded round limit without reaching the summary screen')
}
