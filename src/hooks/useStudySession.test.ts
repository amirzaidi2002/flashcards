import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Flashcard, StudyResult } from '../domain'
import { makeFlashcard } from '../test/flashcardFactory'
import { useStudySession } from './useStudySession'

const cards: Flashcard[] = [
  makeFlashcard({ id: 'card-a', spanish: 'hola', english: 'hello' }),
  makeFlashcard({ id: 'card-b', spanish: 'adiós', english: 'goodbye' }),
]

describe('useStudySession', () => {
  it('exposes the current card and total, and progresses through flip/answer', () => {
    const { result } = renderHook(() => useStudySession(cards, 'deck-1'))

    expect(result.current.currentCard).toBe(cards[0])
    expect(result.current.totalCards).toBe(2)
    expect(result.current.state.isFlipped).toBe(false)

    act(() => result.current.flip())
    expect(result.current.state.isFlipped).toBe(true)

    act(() => result.current.answerCorrect())
    expect(result.current.currentCard).toBe(cards[1])
    expect(result.current.state.correctCount).toBe(1)
    expect(result.current.state.isFlipped).toBe(false)

    // Card B is the last card in the queue, so its one in-session retry
    // reinserts it immediately (there is nothing else to delay behind).
    act(() => result.current.flip())
    act(() => result.current.answerIncorrect())
    expect(result.current.state.isComplete).toBe(false)

    act(() => result.current.flip())
    act(() => result.current.answerIncorrect())
    expect(result.current.state.isComplete).toBe(true)
    expect(result.current.state.incorrectCount).toBe(2)
  })

  it('restarts the session back to the first card', () => {
    const { result } = renderHook(() => useStudySession(cards, 'deck-1'))

    act(() => result.current.flip())
    act(() => result.current.answerCorrect())
    expect(result.current.currentCard).toBe(cards[1])

    act(() => result.current.restart())
    expect(result.current.currentCard).toBe(cards[0])
    expect(result.current.state.cardsCompleted).toBe(0)
    expect(result.current.state.isComplete).toBe(false)
  })

  it('calls onAnswer with the card and result exactly once per answer', () => {
    const onAnswer = vi.fn<(card: Flashcard, result: StudyResult) => void>()
    const { result } = renderHook(() => useStudySession(cards, 'deck-1', onAnswer))

    act(() => result.current.flip())
    act(() => result.current.answerCorrect())

    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(cards[0], 'correct')

    act(() => result.current.flip())
    act(() => result.current.answerIncorrect())

    expect(onAnswer).toHaveBeenCalledTimes(2)
    expect(onAnswer).toHaveBeenLastCalledWith(cards[1], 'incorrect')
  })
})
