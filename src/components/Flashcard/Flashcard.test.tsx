import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Flashcard as FlashcardModel } from '../../domain'
import { Flashcard } from './Flashcard'

const card: FlashcardModel = {
  id: 'card-1',
  spanish: 'hola',
  english: 'hello',
  deckId: 'deck-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  timesStudied: 0,
  correctCount: 0,
  incorrectCount: 0,
}

describe('Flashcard', () => {
  it('shows the Spanish word and hides the English translation before flipping', () => {
    render(
      <Flashcard
        card={card}
        isFlipped={false}
        onFlip={vi.fn()}
        onCorrect={vi.fn()}
        onIncorrect={vi.fn()}
      />,
    )

    expect(screen.getAllByText('hola').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('button', { name: /show the english translation/i }),
    ).toBeInTheDocument()
    // The back face is aria-hidden until flipped, so role queries (which
    // respect the accessibility tree) correctly can't find its controls.
    expect(screen.queryByRole('button', { name: /i got it right/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /i got it wrong/i })).not.toBeInTheDocument()
  })

  it('calls onFlip when the front of the card is activated', async () => {
    const user = userEvent.setup()
    const onFlip = vi.fn()
    render(
      <Flashcard
        card={card}
        isFlipped={false}
        onFlip={onFlip}
        onCorrect={vi.fn()}
        onIncorrect={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /show the english translation/i }))
    expect(onFlip).toHaveBeenCalledTimes(1)
  })

  it('reveals the English translation and correct/incorrect controls after flipping', () => {
    render(
      <Flashcard
        card={card}
        isFlipped={true}
        onFlip={vi.fn()}
        onCorrect={vi.fn()}
        onIncorrect={vi.fn()}
      />,
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /i got it right/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /i got it wrong/i })).toBeInTheDocument()
  })

  it('calls onCorrect and onIncorrect from the back of the card', async () => {
    const user = userEvent.setup()
    const onCorrect = vi.fn()
    const onIncorrect = vi.fn()
    render(
      <Flashcard
        card={card}
        isFlipped={true}
        onFlip={vi.fn()}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />,
    )

    await user.click(screen.getByRole('button', { name: /i got it right/i }))
    expect(onCorrect).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /i got it wrong/i }))
    expect(onIncorrect).toHaveBeenCalledTimes(1)
  })

  it('supports flipping and answering entirely from the keyboard', async () => {
    const user = userEvent.setup()
    const onFlip = vi.fn()
    const onCorrect = vi.fn()
    render(
      <Flashcard
        card={card}
        isFlipped={false}
        onFlip={onFlip}
        onCorrect={onCorrect}
        onIncorrect={vi.fn()}
      />,
    )

    await user.tab()
    expect(screen.getByRole('button', { name: /show the english translation/i })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onFlip).toHaveBeenCalledTimes(1)
  })

  it('moves focus to the correct/incorrect controls once flipped, so keyboard flow continues', () => {
    const { rerender } = render(
      <Flashcard
        card={card}
        isFlipped={false}
        onFlip={vi.fn()}
        onCorrect={vi.fn()}
        onIncorrect={vi.fn()}
      />,
    )

    screen.getByRole('button', { name: /show the english translation/i }).focus()
    rerender(
      <Flashcard
        card={card}
        isFlipped={true}
        onFlip={vi.fn()}
        onCorrect={vi.fn()}
        onIncorrect={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /i got it right/i })).toHaveFocus()
  })
})
