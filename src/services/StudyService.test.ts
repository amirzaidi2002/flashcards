import { describe, expect, it } from 'vitest'
import type { Flashcard } from '../domain'
import {
  flipCard,
  getCurrentCard,
  getReviewCards,
  getSessionSummary,
  getTotalCards,
  recordCorrect,
  recordIncorrect,
  startSession,
} from './StudyService'

function makeCard(
  id: string,
  spanish: string,
  english: string,
  overrides: Partial<Flashcard> = {},
): Flashcard {
  return {
    id,
    spanish,
    english,
    deckId: 'deck-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    timesStudied: 0,
    correctCount: 0,
    incorrectCount: 0,
    ...overrides,
  }
}

const cardA = makeCard('card-a', 'hola', 'hello')
const cardB = makeCard('card-b', 'adiós', 'goodbye')
const cardC = makeCard('card-c', 'gracias', 'thank you')

describe('StudyService', () => {
  it('starts a session with the first card current and nothing completed', () => {
    const state = startSession([cardA, cardB, cardC], 'deck-1')

    expect(state.deckId).toBe('deck-1')
    expect(getCurrentCard(state)).toBe(cardA)
    expect(getTotalCards(state)).toBe(3)
    expect(state.cardsCompleted).toBe(0)
    expect(state.correctCount).toBe(0)
    expect(state.incorrectCount).toBe(0)
    expect(state.isFlipped).toBe(false)
    expect(state.isComplete).toBe(false)
  })

  it('immediately completes a session started with zero cards', () => {
    const state = startSession([])

    expect(getCurrentCard(state)).toBeUndefined()
    expect(state.isComplete).toBe(true)
  })

  it('orders the initial queue by adaptive priority, not input order', () => {
    const missed = makeCard('missed', 'x', 'y', {
      timesStudied: 2,
      incorrectCount: 1,
      lastResult: 'incorrect',
    })
    const mastered = makeCard('mastered', 'x', 'y', {
      timesStudied: 5,
      correctCount: 5,
      lastResult: 'correct',
    })

    // Input order deliberately puts the mastered card first.
    const state = startSession([mastered, missed])
    expect(getCurrentCard(state)?.id).toBe('missed')
  })

  it('flips the current card to reveal the answer', () => {
    const state = flipCard(startSession([cardA]))
    expect(state.isFlipped).toBe(true)
  })

  it('does not record an answer before the card has been flipped', () => {
    const state = startSession([cardA, cardB])
    const afterAnswer = recordCorrect(state)

    // No-op: still on the same card, nothing recorded.
    expect(afterAnswer).toEqual(state)
    expect(getCurrentCard(afterAnswer)).toBe(cardA)
    expect(afterAnswer.correctCount).toBe(0)
  })

  it('records a correct answer, advances the queue, and resets isFlipped', () => {
    let state = startSession([cardA, cardB])
    state = flipCard(state)
    state = recordCorrect(state)

    expect(state.correctCount).toBe(1)
    expect(state.incorrectCount).toBe(0)
    expect(state.cardsCompleted).toBe(1)
    expect(state.isFlipped).toBe(false)
    expect(getCurrentCard(state)).toBe(cardB)
    expect(state.isComplete).toBe(false)
  })

  it('records an incorrect answer independently of the correct counter', () => {
    let state = startSession([cardA, cardB])
    state = flipCard(state)
    state = recordIncorrect(state)

    expect(state.incorrectCount).toBe(1)
    expect(state.correctCount).toBe(0)
    expect(state.cardsCompleted).toBe(1)
  })

  it('produces exactly one result per answer, and total attempts equal correct + incorrect', () => {
    let state = startSession([cardA, cardB, cardC])

    state = recordCorrect(flipCard(state)) // card A -> correct
    state = recordCorrect(flipCard(state)) // card B -> correct
    state = recordCorrect(flipCard(state)) // card C -> correct

    expect(state.isComplete).toBe(true)
    expect(getCurrentCard(state)).toBeUndefined()

    const summary = getSessionSummary(state)
    expect(summary).toEqual({ cardsCompleted: 3, correctCount: 3, incorrectCount: 0 })
    expect(summary.correctCount + summary.incorrectCount).toBe(summary.cardsCompleted)
  })

  it('lets a card marked wrong reappear later in the same session (not immediately next)', () => {
    let state = startSession([cardA, cardB, cardC])

    state = recordIncorrect(flipCard(state)) // card A -> wrong, should retry later
    expect(getCurrentCard(state)?.id).not.toBe('card-a') // not immediately next
    expect(state.isComplete).toBe(false)

    state = recordCorrect(flipCard(state)) // card B -> right
    // card A should now be back in the queue, giving it a second chance.
    expect(state.queue.some((card) => card.id === 'card-a')).toBe(true)

    state = recordCorrect(flipCard(state)) // card C -> right
    expect(getCurrentCard(state)?.id).toBe('card-a')

    state = recordCorrect(flipCard(state)) // card A (retry) -> right this time
    expect(state.isComplete).toBe(true)

    const summary = getSessionSummary(state)
    expect(summary).toEqual({ cardsCompleted: 4, correctCount: 3, incorrectCount: 1 })
  })

  it('gives each card at most one retry, so a session always terminates', () => {
    let state = startSession([cardA, cardB])

    state = recordIncorrect(flipCard(state)) // card A -> wrong, retries
    state = recordIncorrect(flipCard(state)) // card B -> wrong, retries
    expect(state.isComplete).toBe(false)

    state = recordIncorrect(flipCard(state)) // card A retry -> wrong again, no further retry
    state = recordIncorrect(flipCard(state)) // card B retry -> wrong again, no further retry

    expect(state.isComplete).toBe(true)
    expect(getSessionSummary(state)).toEqual({
      cardsCompleted: 4,
      correctCount: 0,
      incorrectCount: 4,
    })
  })

  it('ignores further answers once the session is complete', () => {
    let state = startSession([cardA])
    state = recordCorrect(flipCard(state))
    expect(state.isComplete).toBe(true)

    const afterExtra = recordCorrect(flipCard(state))
    expect(afterExtra).toEqual(state)
  })

  it('exposes getReviewCards for retrieving cards that need review', () => {
    const missed = makeCard('missed', 'x', 'y', { incorrectCount: 1, lastResult: 'incorrect' })
    const neverStudied = makeCard('fresh', 'x', 'y')

    expect(getReviewCards([missed, neverStudied])).toEqual([missed])
  })
})
