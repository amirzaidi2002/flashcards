import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Flashcard } from '../../domain'
import { makeFlashcard } from '../../test/flashcardFactory'
import { StudySessionRunner } from './StudySessionRunner'

const cards: Flashcard[] = [
  makeFlashcard({ id: 'card-a', spanish: 'hola', english: 'hello', deckId: 'deck-test' }),
  makeFlashcard({ id: 'card-b', spanish: 'adiós', english: 'goodbye', deckId: 'deck-test' }),
]

function renderRunner(overrides: Partial<Parameters<typeof StudySessionRunner>[0]> = {}) {
  return render(
    <MemoryRouter>
      <StudySessionRunner
        title="Test Deck"
        cards={cards}
        emptyStateMessage="This deck has no cards yet."
        {...overrides}
      />
    </MemoryRouter>,
  )
}

describe('StudySessionRunner', () => {
  it('shows an intro screen with the card count before the session starts', () => {
    renderRunner()
    expect(screen.getByRole('heading', { name: 'Test Deck' })).toBeInTheDocument()
    expect(screen.getByText('2 cards to study.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start studying/i })).toBeInTheDocument()
  })

  it('shows the empty-state message instead of Start Studying when there are no cards', () => {
    renderRunner({ cards: [] })
    expect(screen.queryByRole('button', { name: /start studying/i })).not.toBeInTheDocument()
    expect(screen.getByText('This deck has no cards yet.')).toBeInTheDocument()
  })

  it('runs a full study session from start through to the summary', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: /start studying/i }))

    // Card 1 of 2
    expect(screen.getByText('Card 1 of 2')).toBeInTheDocument()
    expect(screen.getAllByText('hola').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    expect(screen.getByText('hello')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /i got it right/i }))

    // Card 2 of 2
    expect(screen.getByText('Card 2 of 2')).toBeInTheDocument()
    expect(screen.getAllByText('adiós').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    await user.click(screen.getByRole('button', { name: /i got it wrong/i }))

    // Card B is the last remaining card, so its one retry reappears right away.
    expect(screen.getByText('Card 3 of 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    await user.click(screen.getByRole('button', { name: /i got it right/i }))

    // Session summary
    expect(screen.getByRole('heading', { name: /session complete/i })).toBeInTheDocument()
    expect(screen.getByText(/you studied 3 cards from test deck/i)).toBeInTheDocument()
    expect(screen.getByText('Correct: 2')).toBeInTheDocument()
    expect(screen.getByText('Incorrect: 1')).toBeInTheDocument()
  })

  it('lets the user study again from the summary screen', async () => {
    const user = userEvent.setup()
    renderRunner()

    await user.click(screen.getByRole('button', { name: /start studying/i }))
    for (let i = 0; i < 2; i += 1) {
      await user.click(screen.getByRole('button', { name: /show the english translation/i }))
      await user.click(screen.getByRole('button', { name: /i got it right/i }))
    }

    expect(screen.getByRole('heading', { name: /session complete/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /study again/i }))

    expect(screen.getByText('Card 1 of 2')).toBeInTheDocument()
  })

  it('calls onAnswer once per answer with the card and result', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    renderRunner({ onAnswer })

    await user.click(screen.getByRole('button', { name: /start studying/i }))
    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    await user.click(screen.getByRole('button', { name: /i got it right/i }))

    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(cards[0], 'correct')
  })

  it('uses the custom backLink label/target on the intro and summary screens', async () => {
    const user = userEvent.setup()
    renderRunner({ backLink: { to: '/study', label: 'Back to Study' } })

    expect(screen.getByRole('link', { name: 'Back to Study' })).toHaveAttribute('href', '/study')

    await user.click(screen.getByRole('button', { name: /start studying/i }))
    for (let i = 0; i < 2; i += 1) {
      await user.click(screen.getByRole('button', { name: /show the english translation/i }))
      await user.click(screen.getByRole('button', { name: /i got it right/i }))
    }

    expect(screen.getByRole('link', { name: 'Back to Study' })).toHaveAttribute('href', '/study')
  })
})
