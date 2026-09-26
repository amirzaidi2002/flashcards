import { useEffect, useRef } from 'react'
import type { Flashcard as FlashcardModel } from '../../domain'
import { Button } from '../Button/Button'

export interface FlashcardProps {
  card: FlashcardModel
  isFlipped: boolean
  onFlip: () => void
  onCorrect: () => void
  onIncorrect: () => void
}

/**
 * A single interactive flashcard: shows the Spanish prompt on the front,
 * and the English translation with correct/incorrect controls on the
 * back. Both faces are native `<button>`/`<Button>` elements, so keyboard
 * support (Tab, Enter, Space) comes for free from semantic HTML rather
 * than a re-implemented `onKeyDown` handler.
 */
export function Flashcard({ card, isFlipped, onFlip, onCorrect, onIncorrect }: FlashcardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frontButtonRef = useRef<HTMLButtonElement>(null)
  const correctButtonRef = useRef<HTMLButtonElement>(null)

  // Keep keyboard focus on the flashcard as it flips between faces. The
  // front button becomes `disabled` (and therefore unfocusable) the
  // instant the card flips, which would otherwise silently drop focus
  // back to <body>; only do this if focus was already inside the card,
  // so we never steal focus from elsewhere on the page.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !root.contains(document.activeElement)) return

    if (isFlipped) {
      correctButtonRef.current?.focus()
    } else {
      frontButtonRef.current?.focus()
    }
  }, [isFlipped])

  return (
    <div className="flashcard" ref={rootRef}>
      <div className={`flashcard__inner${isFlipped ? ' flashcard__inner--flipped' : ''}`}>
        <button
          ref={frontButtonRef}
          type="button"
          className="flashcard__face flashcard__face--front"
          onClick={onFlip}
          disabled={isFlipped}
          aria-hidden={isFlipped}
          aria-label={`Spanish word: ${card.spanish}. Show the English translation.`}
        >
          <p className="flashcard__prompt">{card.spanish}</p>
          <span className="flashcard__hint">Show Answer</span>
        </button>

        <div className="flashcard__face flashcard__face--back" aria-hidden={!isFlipped}>
          <p className="flashcard__prompt flashcard__prompt--muted">{card.spanish}</p>
          <p className="flashcard__answer">{card.english}</p>
          <div className="flashcard__actions">
            <Button variant="danger" disabled={!isFlipped} onClick={onIncorrect}>
              I Got It Wrong
            </Button>
            <Button
              ref={correctButtonRef}
              variant="success"
              disabled={!isFlipped}
              onClick={onCorrect}
            >
              I Got It Right
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
