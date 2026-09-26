import { Link } from 'react-router-dom'
import type { Deck } from '../../domain'
import { buttonClassName } from '../../utils/buttonClassName'

interface DeckCardProps {
  deck: Deck
}

/** Summarizes a single deck and links to its Study/Quiz entry points. */
export function DeckCard({ deck }: DeckCardProps) {
  return (
    <article className="deck-card">
      <h2>{deck.name}</h2>
      {deck.description ? <p>{deck.description}</p> : null}
      <p className="deck-card__count">
        {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
      </p>
      <div className="deck-card__actions">
        <Link to={`/study/${deck.id}`} className={buttonClassName('primary')}>
          Study
        </Link>
        <Link to={`/quiz/${deck.id}`} className={buttonClassName('secondary')}>
          Quiz
        </Link>
      </div>
    </article>
  )
}
