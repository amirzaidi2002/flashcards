import { seedFlashcards } from '../data/seed'
import { InMemoryFlashcardRepository } from './InMemoryFlashcardRepository'
import type { FlashcardRepository } from './FlashcardRepository'

/**
 * The application-wide `FlashcardRepository` instance, seeded from the
 * static seed data (see `src/data/seed`). Pages/hooks should import this
 * shared instance rather than reading `seedFlashcards` directly, so that
 * learning-state updates (Phase 3.1) are visible across every screen for
 * the lifetime of the page. In Phase 4 this will be swapped for an
 * IndexedDB-backed implementation without changing any caller.
 */
export const flashcardRepository: FlashcardRepository = new InMemoryFlashcardRepository(
  seedFlashcards,
)
