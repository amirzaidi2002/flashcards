/** One selectable answer choice for a multiple-choice quiz question. */
export interface QuizAnswerOption {
  id: string
  /** The flashcard whose English translation this option's text comes from. */
  cardId: string
  text: string
  isCorrect: boolean
}

/** A single multiple-choice quiz question, built from one flashcard. */
export interface QuizQuestion {
  id: string
  /** The flashcard being tested; its `spanish` field is the prompt. */
  cardId: string
  options: QuizAnswerOption[]
  selectedOptionId?: string
  isAnswered: boolean
}

/** The in-progress state of a multiple-choice quiz. */
export interface QuizState {
  id: string
  deckId?: string

  questions: QuizQuestion[]
  currentQuestionIndex: number

  correctCount: number
  incorrectCount: number

  startedAt: string
  completedAt?: string

  /**
   * Reserved for future multi-user support (Phase 11). Version 1 is
   * single-user, so this is omitted/undefined everywhere.
   */
  userId?: string
}

/** Final, persistable summary of a completed quiz. */
export interface QuizResult {
  quizId: string
  deckId?: string

  totalQuestions: number
  correctCount: number
  incorrectCount: number
  accuracy: number

  missedCardIds: string[]

  startedAt: string
  completedAt: string
}
