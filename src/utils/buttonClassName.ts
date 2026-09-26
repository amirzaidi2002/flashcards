export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'

/**
 * Builds the shared `.btn` class names for a given variant, so both the
 * `Button` component and non-`<button>` elements that need to look like a
 * button (e.g. a react-router `Link` used as a call to action) stay
 * visually consistent.
 */
export function buttonClassName(variant: ButtonVariant = 'primary', className?: string): string {
  return ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
}
