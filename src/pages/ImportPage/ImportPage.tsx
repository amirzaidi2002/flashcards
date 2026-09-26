import { ModePageHeader } from '../../components/ModePageHeader/ModePageHeader'

export function ImportPage() {
  return (
    <section aria-labelledby="import-heading" className="page-hero page-hero--roomy">
      <ModePageHeader
        variant="import"
        eyebrow="Import"
        title="Import"
        subtitle="Import flashcards from a CSV or JSON file. Coming soon."
        headingId="import-heading"
      />
    </section>
  )
}
