import { useEffect, useState } from 'react'
import type { Flashcard } from '../domain'
import { flashcardRepository } from '../repositories/flashcardRepositoryInstance'
import { getReviewCards } from '../services/CardLearningService'

export interface UseReviewCardsResult {
  /** `undefined` while the initial load is in flight. */
  cards: Flashcard[] | undefined
  /** Re-fetches from the repository (e.g. after finishing a review session). */
  reload: () => void
}

/**
 * Loads every card across all decks currently eligible for review (spec
 * 12.3, TODO 3.2/3.4), via the shared `flashcardRepository`.
 */
export function useReviewCards(): UseReviewCardsResult {
  const [cards, setCards] = useState<Flashcard[] | undefined>(undefined)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    void flashcardRepository.getAll().then((all) => {
      if (!cancelled) setCards(getReviewCards(all))
    })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  return { cards, reload: () => setReloadToken((token) => token + 1) }
}
