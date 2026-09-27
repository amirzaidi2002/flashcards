import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flashcard } from '../../components/Flashcard/Flashcard'
import type { Flashcard as FlashcardModel, StudyResult } from '../../domain'
import { useStudySession } from '../../hooks/useStudySession'
import { getSessionSummary } from '../../services/StudyService'
import { buttonClassName } from '../../utils/buttonClassName'
import { Button } from '../../components/Button/Button'
import { StudyModeHeader } from './StudyModeHeader'

export interface StudySessionBackLink {
  to: string
  label: string
}

export interface StudySessionRunnerProps {
  /** Heading shown throughout the session (a deck's name, or e.g. "Review Cards I Don't Know"). */
  title: string
  cards: FlashcardModel[]
  /** Tags the underlying `StudyState`/`StudySession`; omit for cross-deck sessions (e.g. review). */
  deckId?: string
  /** Shown on the intro screen when `cards` is empty, instead of "Start Studying". */
  emptyStateMessage: string
  backLink?: StudySessionBackLink
  /** Called once per answer, with the card and result, before the queue advances (Phase 3.1). */
  onAnswer?: (card: FlashcardModel, result: StudyResult) => void
}

const DEFAULT_BACK_LINK: StudySessionBackLink = { to: '/decks', label: 'Back to Decks' }

/**
 * Drives one study experience end-to-end: an intro screen (or empty
 * state), the card-by-card flip/answer loop with progress, and a final
 * summary once every card has been answered. Deck-scoped study and
 * cross-deck review mode (Phase 3.4) both use this same component — they
 * differ only in which cards/title/links are passed in. Always rendered
 * under the "Study Mode" badge/color, since review is part of the Study
 * mode rather than its own entry on the Home page's mode hub.
 */
export function StudySessionRunner({
  title,
  cards,
  deckId,
  emptyStateMessage,
  backLink = DEFAULT_BACK_LINK,
  onAnswer,
}: StudySessionRunnerProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const session = useStudySession(cards, deckId, onAnswer)
  const summaryHeadingRef = useRef<HTMLHeadingElement>(null)

  const { isComplete } = session.state

  useEffect(() => {
    if (hasStarted && isComplete) {
      summaryHeadingRef.current?.focus()
    }
  }, [hasStarted, isComplete])

  if (!hasStarted) {
    if (cards.length === 0) {
      return (
        <section aria-labelledby="study-heading" className="page-hero page-hero--roomy">
          <StudyModeHeader title={title} subtitle={emptyStateMessage} headingId="study-heading" />
          <Link to={backLink.to} className={buttonClassName('primary')}>
            {backLink.label}
          </Link>
        </section>
      )
    }

    const cardLabel = `${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`
    return (
      <section aria-labelledby="study-heading" className="page-hero page-hero--roomy">
        <StudyModeHeader
          title={title}
          subtitle={`${cardLabel} to study.`}
          headingId="study-heading"
        />
        <Button onClick={() => setHasStarted(true)}>Start Studying</Button>
        <p>
          <Link to={backLink.to}>{backLink.label}</Link>
        </p>
      </section>
    )
  }

  if (isComplete) {
    const summary = getSessionSummary(session.state)
    return (
      <section aria-labelledby="summary-heading" className="page-hero page-hero--roomy">
        <StudyModeHeader
          title="Session complete"
          subtitle={`You studied ${summary.cardsCompleted} ${summary.cardsCompleted === 1 ? 'card' : 'cards'} from ${title}.`}
          headingId="summary-heading"
          headingRef={summaryHeadingRef}
          headingTabIndex={-1}
        />
        <ul>
          <li>Correct: {summary.correctCount}</li>
          <li>Incorrect: {summary.incorrectCount}</li>
        </ul>
        <div className="study-session__actions">
          <Button onClick={session.restart}>Study Again</Button>
          <Link to={backLink.to} className={buttonClassName('secondary')}>
            {backLink.label}
          </Link>
        </div>
      </section>
    )
  }

  const currentCard = session.currentCard
  if (!currentCard) return null

  const cardNumber = session.state.cardsCompleted + 1

  return (
    <section aria-labelledby="study-heading" className="page-hero">
      <StudyModeHeader title={title} headingId="study-heading" />
      <p className="study-session__progress" role="status">
        Card {cardNumber} of {session.totalCards}
      </p>
      <Flashcard
        card={currentCard}
        isFlipped={session.state.isFlipped}
        onFlip={session.flip}
        onCorrect={session.answerCorrect}
        onIncorrect={session.answerIncorrect}
      />
    </section>
  )
}
