import type { Flashcard } from '../domain'
import type { FlashcardRepository } from './FlashcardRepository'

/**
 * An in-memory implementation of `FlashcardRepository`.
 *
 * This is the "before IndexedDB exists" adapter used for Phase 3: it lets
 * card learning state (timesStudied/correctCount/incorrectCount/lastResult)
 * accumulate across study sessions for as long as the page stays open,
 * without requiring the Phase 4 storage layer to exist yet. State does not
 * survive a browser refresh — that arrives in Phase 4, when this class is
 * replaced by an IndexedDB-backed implementation behind the same interface.
 */
export class InMemoryFlashcardRepository implements FlashcardRepository {
  private readonly cardsById: Map<string, Flashcard>

  constructor(initialCards: Flashcard[] = []) {
    this.cardsById = new Map(initialCards.map((card) => [card.id, card]))
  }

  async getAll(): Promise<Flashcard[]> {
    return [...this.cardsById.values()]
  }

  async getById(id: string): Promise<Flashcard | undefined> {
    return this.cardsById.get(id)
  }

  async getByDeckId(deckId: string): Promise<Flashcard[]> {
    return [...this.cardsById.values()].filter((card) => card.deckId === deckId)
  }

  async save(card: Flashcard): Promise<void> {
    this.cardsById.set(card.id, card)
  }

  async saveMany(cards: Flashcard[]): Promise<void> {
    for (const card of cards) {
      this.cardsById.set(card.id, card)
    }
  }
}
