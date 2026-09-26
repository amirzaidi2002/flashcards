/**
 * Repository contract for reading and writing Flashcard records.
 *
 * Services depend on this interface rather than on IndexedDB directly, so
 * the storage backend (IndexedDB today, a REST/GraphQL API in the future)
 * can be swapped without changing service or UI code.
 *
 * TODO(Phase 4.2): once the `Flashcard` domain model exists (Phase 1.1),
 * define the contract, e.g.:
 *
 *   interface FlashcardRepository {
 *     getById(id: string): Promise<Flashcard | undefined>
 *     getByDeckId(deckId: string): Promise<Flashcard[]>
 *     save(card: Flashcard): Promise<void>
 *     delete(id: string): Promise<void>
 *   }
 */
export {}
