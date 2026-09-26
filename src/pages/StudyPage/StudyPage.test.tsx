import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { seedDecks, seedFlashcards } from '../../data/seed'
import { flashcardRepository } from '../../repositories/flashcardRepositoryInstance'
import { StudyPage } from './StudyPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/study" element={<StudyPage />} />
        <Route path="/study/review" element={<StudyPage mode="review" />} />
        <Route path="/study/:deckId" element={<StudyPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(async () => {
  // Restore the shared, module-level repository to its pristine seed state
  // so answers recorded in one test don't leak into the next.
  await flashcardRepository.saveMany(seedFlashcards)
})

describe('StudyPage', () => {
  it('prompts the user to select a deck and shows the review entry point', async () => {
    renderAt('/study')
    expect(screen.getByRole('heading', { name: /^study$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse decks/i })).toHaveAttribute('href', '/decks')

    expect(await screen.findByText(/0 cards need review/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /review now/i })).toHaveAttribute(
      'href',
      '/study/review',
    )
  })

  it('shows a not-found message for an unknown deck id', async () => {
    renderAt('/study/does-not-exist')
    expect(await screen.findByRole('heading', { name: /deck not found/i })).toBeInTheDocument()
  })

  it('starts a study session for a real seeded deck, loading cards from the repository', async () => {
    const [deck] = seedDecks
    renderAt(`/study/${deck.id}`)

    expect(await screen.findByRole('heading', { name: deck.name })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /start studying/i })).toBeInTheDocument()
  })

  it('persists a correct answer onto the card via the repository', async () => {
    const user = userEvent.setup()
    const [deck] = seedDecks
    renderAt(`/study/${deck.id}`)

    await user.click(await screen.findByRole('button', { name: /start studying/i }))
    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    await user.click(screen.getByRole('button', { name: /i got it right/i }))

    const deckCards = await flashcardRepository.getByDeckId(deck.id)
    const answered = deckCards.find((card) => card.timesStudied > 0)
    expect(answered).toBeDefined()
    expect(answered?.correctCount).toBe(1)
    expect(answered?.lastResult).toBe('correct')
  })

  it('shows an empty state when there are no cards eligible for review', async () => {
    renderAt('/study/review')
    expect(
      await screen.findByRole('heading', { name: /review cards i don't know/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/you don't have any cards currently marked for review/i),
    ).toBeInTheDocument()
  })

  it('loads only review-eligible cards, and finishing review updates their learning state', async () => {
    const user = userEvent.setup()
    const [deck] = seedDecks
    const [firstCard] = await flashcardRepository.getByDeckId(deck.id)

    // Seed one missed card directly through the repository, as if it had
    // been answered incorrectly in a previous session.
    await flashcardRepository.save({
      ...firstCard,
      timesStudied: 1,
      incorrectCount: 1,
      lastResult: 'incorrect',
      lastStudiedAt: '2026-01-02T00:00:00.000Z',
    })

    renderAt('/study/review')

    expect(
      await screen.findByRole('heading', { name: /review cards i don't know/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 card to study.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start studying/i }))
    expect(screen.getAllByText(firstCard.spanish).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    await user.click(screen.getByRole('button', { name: /i got it right/i }))

    expect(await screen.findByRole('heading', { name: /session complete/i })).toBeInTheDocument()

    const updated = await flashcardRepository.getById(firstCard.id)
    expect(updated?.timesStudied).toBe(2)
    expect(updated?.correctCount).toBe(1)
    expect(updated?.lastResult).toBe('correct')
  })
})
