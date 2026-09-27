import { describe, expect, it } from 'vitest'
import { makeFlashcard } from '../test/flashcardFactory'
import { InMemoryFlashcardRepository } from './InMemoryFlashcardRepository'

function makeCard(id: string, deckId: string) {
  return makeFlashcard({ id, deckId })
}

describe('InMemoryFlashcardRepository', () => {
  it('returns all seeded cards', async () => {
    const repo = new InMemoryFlashcardRepository([makeCard('a', 'deck-1'), makeCard('b', 'deck-2')])
    const all = await repo.getAll()
    expect(all.map((card) => card.id).sort()).toEqual(['a', 'b'])
  })

  it('gets a card by id', async () => {
    const card = makeCard('a', 'deck-1')
    const repo = new InMemoryFlashcardRepository([card])
    expect(await repo.getById('a')).toEqual(card)
    expect(await repo.getById('missing')).toBeUndefined()
  })

  it('filters cards by deck id', async () => {
    const repo = new InMemoryFlashcardRepository([
      makeCard('a', 'deck-1'),
      makeCard('b', 'deck-2'),
      makeCard('c', 'deck-1'),
    ])
    const deckOneCards = await repo.getByDeckId('deck-1')
    expect(deckOneCards.map((card) => card.id).sort()).toEqual(['a', 'c'])
  })

  it('saves an updated card so subsequent reads see the change', async () => {
    const repo = new InMemoryFlashcardRepository([makeCard('a', 'deck-1')])
    const updated = { ...makeCard('a', 'deck-1'), timesStudied: 1, correctCount: 1 }

    await repo.save(updated)

    expect(await repo.getById('a')).toEqual(updated)
  })

  it('adds a new card via save if it did not already exist', async () => {
    const repo = new InMemoryFlashcardRepository([])
    await repo.save(makeCard('a', 'deck-1'))
    expect(await repo.getAll()).toHaveLength(1)
  })

  it('saves many cards at once', async () => {
    const repo = new InMemoryFlashcardRepository([])
    await repo.saveMany([makeCard('a', 'deck-1'), makeCard('b', 'deck-1')])
    expect(await repo.getAll()).toHaveLength(2)
  })
})
