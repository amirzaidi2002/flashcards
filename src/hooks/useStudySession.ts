import { useCallback, useMemo, useState } from 'react'
import type { Flashcard, StudyResult } from '../domain'
import {
  flipCard,
  getCurrentCard,
  getTotalCards,
  recordCorrect,
  recordIncorrect,
  startSession,
  type StudyState,
} from '../services/StudyService'

export interface UseStudySessionResult {
  state: StudyState
  currentCard: Flashcard | undefined
  totalCards: number
  flip: () => void
  answerCorrect: () => void
  answerIncorrect: () => void
  restart: () => void
}

/**
 * Thin React binding around the framework-independent `StudyService`. All
 * of the actual queue/session logic lives in pure functions there; this
 * hook only wires that logic to component state so it re-renders
 * correctly, plus an optional `onAnswer` side-effect for persisting
 * per-card learning state (Phase 3.1) — kept separate from `StudyService`
 * itself so that service stays a pure, storage-independent queue mechanism.
 *
 * Note: if the caller needs to swap `cards`/`deckId` for a different deck
 * while staying mounted, prefer remounting with a `key` (e.g.
 * `key={deckId}`) over relying on this hook to detect the change.
 */
export function useStudySession(
  cards: Flashcard[],
  deckId?: string,
  onAnswer?: (card: Flashcard, result: StudyResult) => void,
): UseStudySessionResult {
  const [state, setState] = useState<StudyState>(() => startSession(cards, deckId))

  const restart = useCallback(() => {
    setState(startSession(cards, deckId))
  }, [cards, deckId])

  const flip = useCallback(() => setState((prev) => flipCard(prev)), [])

  const currentCard = useMemo(() => getCurrentCard(state), [state])

  // The side effect (persisting the answer) is fired here, outside the
  // `setState` updater, so it runs exactly once per call regardless of
  // how many times React might invoke the updater function itself.
  const answerCorrect = useCallback(() => {
    if (currentCard) onAnswer?.(currentCard, 'correct')
    setState((prev) => recordCorrect(prev))
  }, [currentCard, onAnswer])

  const answerIncorrect = useCallback(() => {
    if (currentCard) onAnswer?.(currentCard, 'incorrect')
    setState((prev) => recordIncorrect(prev))
  }, [currentCard, onAnswer])

  const totalCards = useMemo(() => getTotalCards(state), [state])

  return { state, currentCard, totalCards, flip, answerCorrect, answerIncorrect, restart }
}
