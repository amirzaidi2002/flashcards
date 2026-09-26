import { ModePageHeader } from '../../components/ModePageHeader/ModePageHeader'

export function QuizPage() {
  return (
    <section aria-labelledby="quiz-heading" className="page-hero page-hero--roomy">
      <ModePageHeader
        variant="quiz"
        eyebrow="Quiz Mode"
        title="Quiz"
        subtitle="Select a deck to start a multiple-choice quiz. Coming soon."
        headingId="quiz-heading"
      />
    </section>
  )
}
