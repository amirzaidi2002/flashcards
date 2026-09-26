import type { ReactNode, Ref } from 'react'
import type { ModeMenuVariant } from '../ModeMenu/ModeMenu'

export interface ModePageHeaderProps {
  /** Ties this page's accent color to the matching button on the Home page's mode hub. */
  variant: ModeMenuVariant
  /** Small colored label shown above the heading, e.g. "Study Mode". */
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  headingId?: string
  headingRef?: Ref<HTMLHeadingElement>
  /** Set to `-1` for headings that should be programmatically focusable but not tabbable. */
  headingTabIndex?: number
}

/**
 * A centered page intro (colored eyebrow badge + heading + optional
 * subtitle), matching the Home page's hero look and feel. Used by
 * Study/Quiz/Statistics/Import so every mode reads as part of the same
 * "omnichannel" visual language, with each mode keeping the color of its
 * button on the Home page's mode hub.
 */
export function ModePageHeader({
  variant,
  eyebrow,
  title,
  subtitle,
  headingId,
  headingRef,
  headingTabIndex,
}: ModePageHeaderProps) {
  return (
    <div className="page-hero__intro">
      <span className={`page-hero__badge page-hero__badge--${variant}`}>{eyebrow}</span>
      <h1 id={headingId} ref={headingRef} tabIndex={headingTabIndex}>
        {title}
      </h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}
