import type { Flashcard } from '../domain'

/**
 * A simple, framework-independent card-selection service (spec section
 * 12.1/12.2, TODO 3.3). It decides *ordering* only — it never drops or
 * adds cards — so it has no dependency on React and can be unit-tested
 * entirely on plain `Flashcard[]` arrays.
 */

/** How many other cards must appear before a missed card can reappear. */
export const DEFAULT_RETRY_DELAY = 3

/**
 * Scores a card's need for practice; higher means higher priority. Mirrors
 * the priority ladder from spec 12.1, high to low:
 *
 *   recently missed  >  high historical incorrect rate  >
 *   never/not-recently studied  >  consistently correct
 */
export function computeCardPriority(card: Flashcard): number {
  if (card.timesStudied === 0) {
    // Unseen cards deserve some attention, but less than a card with a
    // real track record of being missed.
    return 0.1
  }

  const incorrectRate = card.incorrectCount / card.timesStudied
  const missedRecently = card.lastResult === 'incorrect' ? 1 : 0
  return incorrectRate + missedRecently
}

/**
 * Orders cards from highest to lowest priority. Ties (e.g. two never-
 * studied cards) preserve their original relative order.
 */
export function sortByPriority(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort((a, b) => computeCardPriority(b) - computeCardPriority(a))
}

/**
 * Reinserts a just-missed card back into the remaining queue, `delay`
 * positions ahead (or at the end, if fewer cards remain than `delay`) so
 * it does not immediately reappear (spec 12.2).
 */
export function reinsertForRetry(
  queue: Flashcard[],
  card: Flashcard,
  delay: number = DEFAULT_RETRY_DELAY,
): Flashcard[] {
  const insertAt = Math.min(Math.max(delay, 0), queue.length)
  const next = [...queue]
  next.splice(insertAt, 0, card)
  return next
}
