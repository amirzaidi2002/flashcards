import { describe, expect, it } from 'vitest'
import { seedDecks, seedFlashcards } from './index'

describe('seed data', () => {
  it('includes several starter decks', () => {
    expect(seedDecks.length).toBeGreaterThanOrEqual(4)
  })

  it('includes enough cards for meaningful testing', () => {
    expect(seedFlashcards.length).toBeGreaterThanOrEqual(100)
  })

  it('gives every card non-empty Spanish text, English text, and a deck', () => {
    for (const card of seedFlashcards) {
      expect(card.spanish.trim().length).toBeGreaterThan(0)
      expect(card.english.trim().length).toBeGreaterThan(0)
      expect(card.deckId.trim().length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate card ids', () => {
    const ids = seedFlashcards.map((card) => card.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no duplicate deck ids', () => {
    const ids = seedDecks.map((deck) => deck.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every card a deckId that references a real deck', () => {
    const deckIds = new Set(seedDecks.map((deck) => deck.id))
    for (const card of seedFlashcards) {
      expect(deckIds.has(card.deckId)).toBe(true)
    }
  })

  it('ensures every deck contains at least one valid card and an accurate card count', () => {
    for (const deck of seedDecks) {
      const cardsInDeck = seedFlashcards.filter((card) => card.deckId === deck.id)
      expect(cardsInDeck.length).toBeGreaterThan(0)
      expect(deck.cardCount).toBe(cardsInDeck.length)
    }
  })

  it('initializes every seeded card with zeroed learning counters', () => {
    for (const card of seedFlashcards) {
      expect(card.timesStudied).toBe(0)
      expect(card.correctCount).toBe(0)
      expect(card.incorrectCount).toBe(0)
      expect(card.lastResult).toBeUndefined()
    }
  })
})
