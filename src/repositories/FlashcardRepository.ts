import type { Flashcard } from '../domain'

/**
 * Repository contract for reading and writing Flashcard records.
 *
 * Services and UI code depend on this interface rather than on a specific
 * storage backend, so the backend (an in-memory store today, IndexedDB in
 * Phase 4.1/4.2, a REST/GraphQL API further ahead) can be swapped without
 * changing service or UI code (spec section 30/34).
 *
 * All methods are async even though the current in-memory implementation
 * could run synchronously: this keeps the contract identical to what an
 * IndexedDB- or API-backed implementation requires, so Phase 4 can swap
 * implementations without touching any caller.
 */
export interface FlashcardRepository {
  getAll(): Promise<Flashcard[]>
  getById(id: string): Promise<Flashcard | undefined>
  getByDeckId(deckId: string): Promise<Flashcard[]>
  save(card: Flashcard): Promise<void>
  saveMany(cards: Flashcard[]): Promise<void>
}
