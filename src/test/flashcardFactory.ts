import type { Flashcard } from '../domain'

/**
 * Builds a plain, valid `Flashcard` for tests, with sensible defaults for
 * every required field so call sites only need to specify the properties
 * that matter to the behavior under test.
 *
 * This is the single shared source of test flashcard data — several test
 * files previously each defined their own slightly different `makeCard`
 * helper; consolidating them here keeps default values (and any future
 * changes to the `Flashcard` shape) in one place.
 */
export function makeFlashcard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: 'card-1',
    spanish: 'hola',
    english: 'hello',
    deckId: 'deck-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    timesStudied: 0,
    correctCount: 0,
    incorrectCount: 0,
    ...overrides,
  }
}
