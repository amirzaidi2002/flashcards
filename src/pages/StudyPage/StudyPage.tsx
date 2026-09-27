import { Link, useParams } from 'react-router-dom'
import type { Flashcard, StudyResult } from '../../domain'
import { seedDecks } from '../../data/seed'
import { useDeckCards } from '../../hooks/useDeckCards'
import { useReviewCards } from '../../hooks/useReviewCards'
import { flashcardRepository } from '../../repositories/flashcardRepositoryInstance'
import { applyStudyResult } from '../../services/CardLearningService'
import { buttonClassName } from '../../utils/buttonClassName'
import { StudyModeHeader } from './StudyModeHeader'
import { StudySessionRunner } from './StudySessionRunner'

export interface StudyPageProps {
  /** Set for the `/study/review` route (Phase 3.4); otherwise a normal deck-scoped session. */
  mode?: 'review'
}

/**
 * Persists the result of one study attempt onto the card's own learning
 * state (Phase 3.1), via the shared repository. A stable module-level
 * function, so it can be passed directly as `onAnswer` without needing to
 * be wrapped in `useCallback` by callers.
 */
function persistAnswer(card: Flashcard, result: StudyResult) {
  void flashcardRepository.save(applyStudyResult(card, result))
}

/**
 * A generic "loading" placeholder, distinct from any real screen's own
 * heading text, so tests (and users relying on the accessibility tree)
 * can unambiguously tell the loading state apart from the loaded state.
 */
function LoadingSection() {
  return (
    <section aria-labelledby="study-heading" className="page-hero page-hero--roomy">
      <StudyModeHeader title="Loading…" headingId="study-heading" />
    </section>
  )
}

export function StudyPage({ mode }: StudyPageProps) {
  const { deckId } = useParams<{ deckId: string }>()

  if (mode === 'review') {
    return <ReviewSession />
  }

  if (!deckId) {
    return <StudyHome />
  }

  const deck = seedDecks.find((candidate) => candidate.id === deckId)
  if (!deck) {
    return (
      <section aria-labelledby="study-heading" className="page-hero page-hero--roomy">
        <StudyModeHeader
          title="Deck not found"
          subtitle="We couldn't find that deck."
          headingId="study-heading"
        />
        <Link to="/decks" className={buttonClassName('primary')}>
          Browse decks
        </Link>
      </section>
    )
  }

  return <DeckStudySession key={deck.id} deckId={deck.id} deckName={deck.name} />
}

/** The `/study` landing screen: pick a deck, or jump into reviewing missed cards. */
function StudyHome() {
  const { cards: reviewCards } = useReviewCards()
  const reviewCount = reviewCards?.length

  return (
    <section aria-labelledby="study-heading" className="page-hero page-hero--roomy">
      <StudyModeHeader
        title="Study"
        subtitle="Select a deck to start studying."
        headingId="study-heading"
      />
      <Link to="/decks" className={buttonClassName('primary')}>
        Browse decks
      </Link>

      <div className="page-hero__section">
        <h2>Review cards you don&apos;t know</h2>
        {reviewCount === undefined ? (
          <p>Loading…</p>
        ) : (
          <p>
            {reviewCount} {reviewCount === 1 ? 'card' : 'cards'} need review.
          </p>
        )}
        <Link to="/study/review" className={buttonClassName('secondary')}>
          Review Now
        </Link>
      </div>
    </section>
  )
}

function DeckStudySession({ deckId, deckName }: { deckId: string; deckName: string }) {
  const cards = useDeckCards(deckId)

  if (!cards) {
    return <LoadingSection />
  }

  return (
    <StudySessionRunner
      title={deckName}
      cards={cards}
      deckId={deckId}
      emptyStateMessage="This deck has no cards yet."
      onAnswer={persistAnswer}
    />
  )
}

function ReviewSession() {
  const { cards } = useReviewCards()

  if (!cards) {
    return <LoadingSection />
  }

  return (
    <StudySessionRunner
      title="Review Cards I Don't Know"
      cards={cards}
      emptyStateMessage="Great job! You don't have any cards currently marked for review."
      backLink={{ to: '/study', label: 'Back to Study' }}
      onAnswer={persistAnswer}
    />
  )
}
