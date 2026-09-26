import { useEffect, useState } from 'react'
import type { Flashcard } from '../domain'
import { flashcardRepository } from '../repositories/flashcardRepositoryInstance'

interface Loaded {
  deckId: string
  cards: Flashcard[]
}

/**
 * Loads the current (learning-state-aware) cards for a deck from the
 * shared `flashcardRepository`, rather than the static seed data, so that
 * accumulated `timesStudied`/`correctCount`/`incorrectCount`/`lastResult`
 * from previous sessions are reflected (Phase 3.1).
 *
 * Returns `undefined` while there is no deck to load, or while the result
 * for the current `deckId` hasn't arrived yet, and a `Flashcard[]`
 * (possibly empty) once loaded.
 */
export function useDeckCards(deckId: string | undefined): Flashcard[] | undefined {
  const [loaded, setLoaded] = useState<Loaded | undefined>(undefined)

  useEffect(() => {
    if (!deckId) return

    let cancelled = false
    void flashcardRepository.getByDeckId(deckId).then((cards) => {
      if (!cancelled) setLoaded({ deckId, cards })
    })

    return () => {
      cancelled = true
    }
  }, [deckId])

  if (!deckId || loaded?.deckId !== deckId) return undefined
  return loaded.cards
}
