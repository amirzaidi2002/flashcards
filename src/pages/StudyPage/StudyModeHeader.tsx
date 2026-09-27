import type { ModePageHeaderProps } from '../../components/ModePageHeader/ModePageHeader'
import { ModePageHeader } from '../../components/ModePageHeader/ModePageHeader'

type StudyModeHeaderProps = Omit<ModePageHeaderProps, 'variant' | 'eyebrow'>

/**
 * `ModePageHeader` pre-bound to the Study mode's variant/eyebrow.
 *
 * Every screen in the Study flow (the `/study` landing page, "deck not
 * found", loading, the intro/summary/active-card states of
 * `StudySessionRunner` — including review mode, which is presented as part
 * of Study rather than its own mode) renders under the same purple "Study
 * Mode" badge. Centralizing that pairing here means it's defined exactly
 * once instead of repeated at every call site.
 */
export function StudyModeHeader(props: StudyModeHeaderProps) {
  return <ModePageHeader variant="study" eyebrow="Study Mode" {...props} />
}
