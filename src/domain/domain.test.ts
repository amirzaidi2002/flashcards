import { describe, expect, it } from 'vitest'
import type { Deck, Flashcard, QuizResult, QuizState, StudyAttempt, StudySession } from './index'

describe('domain models', () => {
  it('can represent a Flashcard with no React dependency', () => {
    const card: Flashcard = {
      id: 'card-1',
      spanish: 'hola',
      english: 'hello',
      deckId: 'deck-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      timesStudied: 0,
      correctCount: 0,
      incorrectCount: 0,
    }

    expect(card.spanish).toBe('hola')
    expect(card.english).toBe('hello')
    expect(card.lastResult).toBeUndefined()
  })

  it('can represent a Deck', () => {
    const deck: Deck = {
      id: 'deck-1',
      name: 'Beginner Basics',
      cardCount: 20,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(deck.cardCount).toBe(20)
  })

  it('can represent a StudySession and StudyAttempt', () => {
    const session: StudySession = {
      id: 'session-1',
      deckId: 'deck-1',
      startedAt: '2026-01-01T00:00:00.000Z',
      cardsStudied: 1,
      correctCount: 1,
      incorrectCount: 0,
    }

    const attempt: StudyAttempt = {
      id: 'attempt-1',
      sessionId: session.id,
      cardId: 'card-1',
      result: 'correct',
      attemptedAt: '2026-01-01T00:00:05.000Z',
    }

    expect(attempt.sessionId).toBe(session.id)
    expect(attempt.result).toBe('correct')
  })

  it('can represent an in-progress QuizState and a completed QuizResult', () => {
    const quiz: QuizState = {
      id: 'quiz-1',
      deckId: 'deck-1',
      currentQuestionIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      startedAt: '2026-01-01T00:00:00.000Z',
      questions: [
        {
          id: 'question-1',
          cardId: 'card-1',
          isAnswered: false,
          options: [
            { id: 'option-1', cardId: 'card-1', text: 'hello', isCorrect: true },
            { id: 'option-2', cardId: 'card-2', text: 'goodbye', isCorrect: false },
          ],
        },
      ],
    }

    const result: QuizResult = {
      quizId: quiz.id,
      totalQuestions: 1,
      correctCount: 1,
      incorrectCount: 0,
      accuracy: 1,
      missedCardIds: [],
      startedAt: quiz.startedAt,
      completedAt: '2026-01-01T00:01:00.000Z',
    }

    expect(quiz.questions).toHaveLength(1)
    expect(result.accuracy).toBe(1)
  })
})
