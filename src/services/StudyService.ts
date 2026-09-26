import type { Flashcard, StudyResult } from '../domain'
import { getReviewCards as selectReviewCards } from './CardLearningService'
import { reinsertForRetry, sortByPriority } from './CardSelectionService'
import { createId } from '../utils/id'

/**
 * In-memory, per-session study state.
 *
 * This is deliberately transient and NOT persisted (see spec section 36,
 * "Application State") — it only tracks the current run through a queue
 * of cards. It has no dependency on React, so it can be created and
 * transformed entirely outside of UI code (see the unit tests below).
 *
 * The initial queue order and in-session retry placement come from the
 * framework-independent `CardSelectionService` (spec 12.1/12.2). Updating
 * a card's own persisted learning fields (`timesStudied`, `correctCount`,
 * etc., via `CardLearningService.applyStudyResult`) and saving that
 * through a repository is a separate concern, handled by the caller (see
 * `useStudySession`'s `onAnswer`) — this module only manages the queue.
 */
export interface StudyState {
  sessionId: string
  deckId?: string
  /** Cards not yet answered; `queue[0]` is always the current card. */
  queue: Flashcard[]
  /** Ids of cards already given their one in-session retry (spec 12.2). */
  retriedCardIds: ReadonlySet<string>
  cardsCompleted: number
  correctCount: number
  incorrectCount: number
  isFlipped: boolean
  isComplete: boolean
}

/**
 * Starts a new study session over the given cards. The initial order is
 * adaptive (missed/high-incorrect-rate cards first; see
 * `CardSelectionService.sortByPriority`), not necessarily the input order.
 */
export function startSession(cards: Flashcard[], deckId?: string): StudyState {
  const queue = sortByPriority(cards)
  return {
    sessionId: createId('session'),
    deckId,
    queue,
    retriedCardIds: new Set(),
    cardsCompleted: 0,
    correctCount: 0,
    incorrectCount: 0,
    isFlipped: false,
    isComplete: queue.length === 0,
  }
}

/** The card currently being studied, if any. */
export function getCurrentCard(state: StudyState): Flashcard | undefined {
  return state.queue[0]
}

/** Total cards in this session (answered so far plus remaining). This can
 * grow mid-session when a missed card earns a retry (spec 12.2). */
export function getTotalCards(state: StudyState): number {
  return state.cardsCompleted + state.queue.length
}

/** Reveals the English translation of the current card. */
export function flipCard(state: StudyState): StudyState {
  if (state.isComplete || state.isFlipped) return state
  return { ...state, isFlipped: true }
}

function recordAnswer(state: StudyState, result: StudyResult): StudyState {
  // Guards against recording an answer before the card has been revealed,
  // and against a duplicate answer for the same card (e.g. a double click):
  // once answered, `isFlipped` resets to false, so a repeat call is a no-op.
  if (state.isComplete || !state.isFlipped) return state

  const [current, ...remaining] = state.queue
  if (!current) return state

  // Each card gets at most one in-session retry, so a session is always
  // guaranteed to terminate even if the user keeps missing the same card.
  const canRetry = result === 'incorrect' && !state.retriedCardIds.has(current.id)
  const queue = canRetry ? reinsertForRetry(remaining, current) : remaining
  const retriedCardIds = canRetry
    ? new Set(state.retriedCardIds).add(current.id)
    : state.retriedCardIds

  return {
    ...state,
    queue,
    retriedCardIds,
    cardsCompleted: state.cardsCompleted + 1,
    correctCount: state.correctCount + (result === 'correct' ? 1 : 0),
    incorrectCount: state.incorrectCount + (result === 'incorrect' ? 1 : 0),
    isFlipped: false,
    isComplete: queue.length === 0,
  }
}

/** Records the current card as correctly answered and advances the queue. */
export function recordCorrect(state: StudyState): StudyState {
  return recordAnswer(state, 'correct')
}

/** Records the current card as incorrectly answered and advances the queue. */
export function recordIncorrect(state: StudyState): StudyState {
  return recordAnswer(state, 'incorrect')
}

export interface StudySessionSummary {
  cardsCompleted: number
  correctCount: number
  incorrectCount: number
}

/** A simple summary of the session so far, suitable for an end-of-session screen. */
export function getSessionSummary(state: StudyState): StudySessionSummary {
  return {
    cardsCompleted: state.cardsCompleted,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
  }
}

/**
 * Filters a set of cards down to those needing review (spec 35/12.3).
 * Exposed here (in addition to `CardLearningService`, which owns the
 * actual rule) so `StudyService`'s public surface matches spec section 35.
 */
export function getReviewCards(cards: Flashcard[]): Flashcard[] {
  return selectReviewCards(cards)
}
