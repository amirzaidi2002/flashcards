import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: /spanish flashcards/i })).toBeInTheDocument()
  })

  it('renders the Study page at /study', () => {
    renderApp('/study')
    expect(screen.getByRole('heading', { name: /study/i })).toBeInTheDocument()
  })

  it('renders the Quiz page at /quiz', () => {
    renderApp('/quiz')
    expect(screen.getByRole('heading', { name: /quiz/i })).toBeInTheDocument()
  })

  it('renders the Decks page at /decks', () => {
    renderApp('/decks')
    expect(screen.getByRole('heading', { name: /decks/i })).toBeInTheDocument()
  })

  it('renders the Statistics page at /statistics', () => {
    renderApp('/statistics')
    expect(screen.getByRole('heading', { name: /statistics/i })).toBeInTheDocument()
  })

  it('renders the Import page at /import', () => {
    renderApp('/import')
    expect(screen.getByRole('heading', { name: /import/i })).toBeInTheDocument()
  })

  it('renders a fallback for unknown routes', () => {
    renderApp('/this-route-does-not-exist')
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  it('renders the primary navigation with links to every main screen', () => {
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: /primary/i })
    for (const label of ['Study', 'Quiz', 'Decks', 'Statistics', 'Import']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
  })
})
