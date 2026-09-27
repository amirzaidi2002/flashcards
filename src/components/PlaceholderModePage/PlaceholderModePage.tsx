import type { ModeMenuVariant } from '../ModeMenu/ModeMenu'
import { ModePageHeader } from '../ModePageHeader/ModePageHeader'

export interface PlaceholderModePageProps {
  variant: ModeMenuVariant
  eyebrow: string
  title: string
  message: string
  headingId: string
}

/**
 * A "coming soon" landing screen for a mode whose real UI hasn't been
 * built yet (Quiz, Statistics, Import — see `docs/TODO.md` for their
 * phases). Quiz/Statistics/Import currently render nothing but this
 * placeholder, so this exists purely to avoid three near-identical copies
 * of the same `page-hero`/`ModePageHeader` wiring; once a page grows real
 * content, it should render its own markup instead of this component.
 */
export function PlaceholderModePage({
  variant,
  eyebrow,
  title,
  message,
  headingId,
}: PlaceholderModePageProps) {
  return (
    <section aria-labelledby={headingId} className="page-hero page-hero--roomy">
      <ModePageHeader
        variant={variant}
        eyebrow={eyebrow}
        title={title}
        subtitle={message}
        headingId={headingId}
      />
    </section>
  )
}
