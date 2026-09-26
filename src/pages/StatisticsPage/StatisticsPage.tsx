import { ModePageHeader } from '../../components/ModePageHeader/ModePageHeader'

export function StatisticsPage() {
  return (
    <section aria-labelledby="statistics-heading" className="page-hero page-hero--roomy">
      <ModePageHeader
        variant="stats"
        eyebrow="Stats Mode"
        title="Statistics"
        subtitle="Overall learning progress will be shown here. Coming soon."
        headingId="statistics-heading"
      />
    </section>
  )
}
