import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { seedDecks } from '../../data/seed'
import { DecksPage } from './DecksPage'

function renderDecksPage() {
  return render(
    <MemoryRouter>
      <DecksPage />
    </MemoryRouter>,
  )
}

describe('DecksPage', () => {
  it('renders every predefined deck with its name', () => {
    renderDecksPage()
    for (const deck of seedDecks) {
      expect(screen.getByRole('heading', { name: deck.name })).toBeInTheDocument()
    }
  })

  it('shows the accurate card count for each deck', () => {
    renderDecksPage()
    for (const deck of seedDecks) {
      const heading = screen.getByRole('heading', { name: deck.name })
      const card = heading.closest('article')
      expect(card).not.toBeNull()

      const label = `${deck.cardCount} ${deck.cardCount === 1 ? 'card' : 'cards'}`
      expect(within(card!).getByText(label)).toBeInTheDocument()
    }
  })

  it('links each deck to its own study and quiz screens', () => {
    renderDecksPage()
    for (const deck of seedDecks) {
      const heading = screen.getByRole('heading', { name: deck.name })
      const card = heading.closest('article')
      expect(card).not.toBeNull()

      expect(within(card!).getByRole('link', { name: /study/i })).toHaveAttribute(
        'href',
        `/study/${deck.id}`,
      )
      expect(within(card!).getByRole('link', { name: /quiz/i })).toHaveAttribute(
        'href',
        `/quiz/${deck.id}`,
      )
    }
  })
})
