import { describe, expect, it } from 'vitest'
import { makeFlashcard } from '../test/flashcardFactory'
import {
  computeCardPriority,
  DEFAULT_RETRY_DELAY,
  reinsertForRetry,
  sortByPriority,
} from './CardSelectionService'

describe('computeCardPriority', () => {
  it('gives a recently missed card the highest priority', () => {
    const recentlyMissed = makeFlashcard({
      timesStudied: 4,
      incorrectCount: 1,
      lastResult: 'incorrect',
    })
    const highIncorrectRate = makeFlashcard({
      timesStudied: 4,
      incorrectCount: 2,
      lastResult: 'correct',
    })
    const neverStudied = makeFlashcard({ timesStudied: 0 })
    const consistentlyCorrect = makeFlashcard({
      timesStudied: 5,
      correctCount: 5,
      lastResult: 'correct',
    })

    expect(computeCardPriority(recentlyMissed)).toBeGreaterThan(
      computeCardPriority(highIncorrectRate),
    )
    expect(computeCardPriority(highIncorrectRate)).toBeGreaterThan(
      computeCardPriority(neverStudied),
    )
    expect(computeCardPriority(neverStudied)).toBeGreaterThan(
      computeCardPriority(consistentlyCorrect),
    )
  })
})

describe('sortByPriority', () => {
  it('ranks missed cards above consistently correct cards', () => {
    const missed = makeFlashcard({
      id: 'missed',
      timesStudied: 2,
      incorrectCount: 1,
      lastResult: 'incorrect',
    })
    const correct = makeFlashcard({
      id: 'correct',
      timesStudied: 5,
      correctCount: 5,
      lastResult: 'correct',
    })

    const [first, second] = sortByPriority([correct, missed])
    expect(first.id).toBe('missed')
    expect(second.id).toBe('correct')
  })

  it('preserves original order for cards with equal priority', () => {
    const a = makeFlashcard({ id: 'a' })
    const b = makeFlashcard({ id: 'b' })
    const c = makeFlashcard({ id: 'c' })

    expect(sortByPriority([a, b, c]).map((card) => card.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not depend on React and can be called on plain data', () => {
    expect(() => sortByPriority([makeFlashcard()])).not.toThrow()
  })
})

describe('reinsertForRetry', () => {
  it('does not place the missed card immediately next when other cards remain', () => {
    const missed = makeFlashcard({ id: 'missed' })
    const rest = [
      makeFlashcard({ id: 'b' }),
      makeFlashcard({ id: 'c' }),
      makeFlashcard({ id: 'd' }),
      makeFlashcard({ id: 'e' }),
    ]

    const queue = reinsertForRetry(rest, missed)
    expect(queue[0].id).not.toBe('missed')
    expect(queue.map((card) => card.id)).toContain('missed')
  })

  it('inserts at the given delay offset', () => {
    const missed = makeFlashcard({ id: 'missed' })
    const rest = [
      makeFlashcard({ id: 'b' }),
      makeFlashcard({ id: 'c' }),
      makeFlashcard({ id: 'd' }),
      makeFlashcard({ id: 'e' }),
    ]

    const queue = reinsertForRetry(rest, missed, 2)
    expect(queue.map((card) => card.id)).toEqual(['b', 'c', 'missed', 'd', 'e'])
  })

  it('falls back to appending at the end when fewer cards remain than the delay', () => {
    const missed = makeFlashcard({ id: 'missed' })
    const rest = [makeFlashcard({ id: 'b' })]

    const queue = reinsertForRetry(rest, missed, DEFAULT_RETRY_DELAY)
    expect(queue.map((card) => card.id)).toEqual(['b', 'missed'])
  })

  it('reinserts immediately when no other cards remain', () => {
    const missed = makeFlashcard({ id: 'missed' })
    const queue = reinsertForRetry([], missed)
    expect(queue.map((card) => card.id)).toEqual(['missed'])
  })
})
