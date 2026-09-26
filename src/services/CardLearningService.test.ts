import { describe, expect, it } from 'vitest'
import type { Flashcard } from '../domain'
import {
  applyStudyResult,
  getReviewCards,
  getReviewCount,
  isEligibleForReview,
} from './CardLearningService'

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'card-1',
    spanish: 'hola',
    english: 'hello',
    deckId: 'deck-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    timesStudied: 0,
    correctCount: 0,
    incorrectCount: 0,
    ...overrides,
  }
}

describe('applyStudyResult', () => {
  it('increments only the correct counter for a correct answer', () => {
    const card = makeCard()
    const updated = applyStudyResult(card, 'correct', '2026-02-01T00:00:00.000Z')

    expect(updated.timesStudied).toBe(1)
    expect(updated.correctCount).toBe(1)
    expect(updated.incorrectCount).toBe(0)
    expect(updated.lastResult).toBe('correct')
    expect(updated.lastStudiedAt).toBe('2026-02-01T00:00:00.000Z')
  })

  it('increments only the incorrect counter for an incorrect answer', () => {
    const card = makeCard()
    const updated = applyStudyResult(card, 'incorrect', '2026-02-01T00:00:00.000Z')

    expect(updated.timesStudied).toBe(1)
    expect(updated.correctCount).toBe(0)
    expect(updated.incorrectCount).toBe(1)
    expect(updated.lastResult).toBe('incorrect')
  })

  it('keeps total attempts equal to correct + incorrect across repeated calls', () => {
    let card = makeCard()
    card = applyStudyResult(card, 'correct', '2026-02-01T00:00:00.000Z')
    card = applyStudyResult(card, 'incorrect', '2026-02-02T00:00:00.000Z')
    card = applyStudyResult(card, 'incorrect', '2026-02-03T00:00:00.000Z')

    expect(card.timesStudied).toBe(3)
    expect(card.correctCount + card.incorrectCount).toBe(card.timesStudied)
  })

  it('reflects only the latest attempt in lastResult/lastStudiedAt', () => {
    let card = makeCard()
    card = applyStudyResult(card, 'incorrect', '2026-02-01T00:00:00.000Z')
    card = applyStudyResult(card, 'correct', '2026-02-02T00:00:00.000Z')

    expect(card.lastResult).toBe('correct')
    expect(card.lastStudiedAt).toBe('2026-02-02T00:00:00.000Z')
  })

  it('does not mutate the original card', () => {
    const card = makeCard()
    const updated = applyStudyResult(card, 'correct', '2026-02-01T00:00:00.000Z')

    expect(card.timesStudied).toBe(0)
    expect(updated).not.toBe(card)
  })
})

describe('isEligibleForReview / getReviewCards / getReviewCount', () => {
  it('makes a newly missed card eligible for review', () => {
    const card = applyStudyResult(makeCard(), 'incorrect')
    expect(isEligibleForReview(card)).toBe(true)
  })

  it('does not make a never-answered card eligible for review', () => {
    const card = makeCard()
    expect(isEligibleForReview(card)).toBe(false)
  })

  it('does not make a card that has only ever been answered correctly eligible', () => {
    let card = makeCard()
    card = applyStudyResult(card, 'correct')
    card = applyStudyResult(card, 'correct')
    expect(isEligibleForReview(card)).toBe(false)
  })

  it('keeps a once-missed card eligible even after a subsequent correct answer', () => {
    let card = makeCard()
    card = applyStudyResult(card, 'incorrect')
    card = applyStudyResult(card, 'correct')

    // lastResult is now "correct", but the card was marked wrong at some
    // point in its history (incorrectCount > 0), so it remains eligible.
    expect(card.lastResult).toBe('correct')
    expect(isEligibleForReview(card)).toBe(true)
  })

  it('matches the review count to the number of eligible cards', () => {
    const neverStudied = makeCard({ id: 'a' })
    const missedOnce = applyStudyResult(makeCard({ id: 'b' }), 'incorrect')
    const consistentlyCorrect = applyStudyResult(makeCard({ id: 'c' }), 'correct')
    const cards = [neverStudied, missedOnce, consistentlyCorrect]

    expect(getReviewCards(cards)).toEqual([missedOnce])
    expect(getReviewCount(cards)).toBe(1)
  })
})
