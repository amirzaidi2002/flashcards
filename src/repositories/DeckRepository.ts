/**
 * Repository contract for reading and writing Deck records.
 *
 * Services depend on this interface rather than on IndexedDB directly, so
 * the storage backend can be swapped without changing service or UI code.
 *
 * TODO(Phase 4.2): once the `Deck` domain model exists (Phase 1.1), define
 * the contract, e.g.:
 *
 *   interface DeckRepository {
 *     getById(id: string): Promise<Deck | undefined>
 *     getAll(): Promise<Deck[]>
 *     save(deck: Deck): Promise<void>
 *   }
 */
export {}
