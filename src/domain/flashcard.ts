/** Outcome of a single study/quiz attempt on a flashcard. */
export type StudyResult = 'correct' | 'incorrect'

/**
 * A single Spanish/English vocabulary flashcard.
 *
 * This is the core learning unit of the application. It intentionally has
 * no dependency on React so it can be created, validated, and reasoned
 * about entirely outside of UI code (e.g. in seed data or unit tests).
 */
export interface Flashcard {
  id: string
  spanish: string
  english: string
  deckId: string

  createdAt: string
  updatedAt: string

  timesStudied: number
  correctCount: number
  incorrectCount: number

  lastStudiedAt?: string
  lastResult?: StudyResult

  /**
   * Reserved for future multi-user support (Phase 11). Version 1 is
   * single-user, so this is omitted/undefined everywhere.
   */
  userId?: string
}

/**
 * Future spaced-repetition scheduling fields (Phase 12). Not required for
 * Version 1. Designed to be attached to a card later (e.g.
 * `type ScheduledFlashcard = Flashcard & { learning?: LearningState }`)
 * without requiring a breaking migration of existing records.
 */
export interface LearningState {
  intervalDays?: number
  easeFactor?: number
  dueAt?: string
  repetitionCount?: number
}
