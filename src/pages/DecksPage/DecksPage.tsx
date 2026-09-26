import { DeckCard } from '../../components/DeckCard/DeckCard'
import { seedDecks } from '../../data/seed'

export function DecksPage() {
  return (
    <section aria-labelledby="decks-heading">
      <h1 id="decks-heading">Decks</h1>
      <p>Choose a deck to study or take a quiz.</p>
      <div className="deck-grid">
        {seedDecks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </section>
  )
}
