import type { Deck, Flashcard } from '../../domain'
import { deckSeeds } from './decks'
import { flashcardSeeds } from './flashcards'

/**
 * Fixed timestamp used for all seed records. Seed data ships with the
 * application bundle itself, so it has no meaningful "created" moment of
 * its own; real timestamps take over once user data is persisted
 * (Phase 4).
 */
const SEED_TIMESTAMP = '2026-01-01T00:00:00.000Z'

export const seedFlashcards: Flashcard[] = flashcardSeeds.map((card) => ({
  id: card.id,
  spanish: card.spanish,
  english: card.english,
  deckId: card.deckId,
  createdAt: SEED_TIMESTAMP,
  updatedAt: SEED_TIMESTAMP,
  timesStudied: 0,
  correctCount: 0,
  incorrectCount: 0,
}))

export const seedDecks: Deck[] = deckSeeds.map((deck) => ({
  id: deck.id,
  name: deck.name,
  description: deck.description,
  cardCount: seedFlashcards.filter((card) => card.deckId === deck.id).length,
  createdAt: SEED_TIMESTAMP,
  updatedAt: SEED_TIMESTAMP,
}))

export { deckSeeds, flashcardSeeds }
