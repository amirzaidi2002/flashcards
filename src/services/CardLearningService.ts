import type { Flashcard, StudyResult } from '../domain'

/**
 * Pure functions that turn a single study attempt into updated learning
 * state on a `Flashcard`, and that decide which cards still need review.
 *
 * These have no dependency on React, storage, or session/queue mechanics
 * (that lives in `StudyService`/`CardSelectionService`), so they can be
 * reasoned about and tested in complete isolation (spec section 11, 12.3).
 */

/**
 * Applies the outcome of one study attempt to a card, per spec section 11:
 * increments `timesStudied` and the matching correct/incorrect counter,
 * and records `lastResult`/`lastStudiedAt`. Returns a new object; the
 * input card is never mutated.
 */
export function applyStudyResult(
  card: Flashcard,
  result: StudyResult,
  answeredAt: string = new Date().toISOString(),
): Flashcard {
  return {
    ...card,
    timesStudied: card.timesStudied + 1,
    correctCount: card.correctCount + (result === 'correct' ? 1 : 0),
    incorrectCount: card.incorrectCount + (result === 'incorrect' ? 1 : 0),
    lastResult: result,
    lastStudiedAt: answeredAt,
    updatedAt: answeredAt,
  }
}

/**
 * The initial review-eligibility rule suggested by spec section 12.3 /
 * TODO 3.2: a card needs review if it has ever been missed at least once,
 * or if its most recent attempt was incorrect.
 *
 * This is intentionally "sticky": a card's lifetime `incorrectCount` never
 * decreases, so a card that has ever been missed remains eligible for
 * review indefinitely. What a user can affect session-to-session is the
 * *active* review set (see `StudyService`/`StudySessionRunner`) — getting
 * a card right removes it from the current review session's queue, even
 * though it may be selected into review again later. A more nuanced
 * "mastered" rule is deferred to Phase 12 spaced repetition.
 */
export function isEligibleForReview(card: Flashcard): boolean {
  return card.incorrectCount > 0 || card.lastResult === 'incorrect'
}

/** Filters a set of cards down to those currently eligible for review. */
export function getReviewCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(isEligibleForReview)
}

/** The number of cards currently eligible for review. */
export function getReviewCount(cards: Flashcard[]): number {
  return getReviewCards(cards).length
}
