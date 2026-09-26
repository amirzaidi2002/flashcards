import type { StudyResult } from './flashcard'

/**
 * A single study session, representing a full deck, a subset of cards, or
 * an incorrect-card review run.
 */
export interface StudySession {
  id: string
  deckId?: string

  startedAt: string
  completedAt?: string

  cardsStudied: number
  correctCount: number
  incorrectCount: number

  /**
   * Reserved for future multi-user support (Phase 11). Version 1 is
   * single-user, so this is omitted/undefined everywhere.
   */
  userId?: string
}

/**
 * A single recorded outcome of a card being shown during a study session
 * (one attempt = one "I Got It Right"/"I Got It Wrong" answer).
 */
export interface StudyAttempt {
  id: string
  sessionId: string
  cardId: string
  deckId?: string

  result: StudyResult
  attemptedAt: string

  /**
   * Reserved for future multi-user support (Phase 11). Version 1 is
   * single-user, so this is omitted/undefined everywhere.
   */
  userId?: string
}
