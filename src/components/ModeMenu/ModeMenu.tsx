import { Link } from 'react-router-dom'

export type ModeMenuVariant = 'study' | 'quiz' | 'stats' | 'decks' | 'import'

interface ModeMenuItem {
  to: string
  label: string
  variant: ModeMenuVariant
}

const MODE_MENU_ITEMS: ModeMenuItem[] = [
  { to: '/study', label: 'Study Mode', variant: 'study' },
  { to: '/quiz', label: 'Quiz Mode', variant: 'quiz' },
  { to: '/statistics', label: 'Stats Mode', variant: 'stats' },
  { to: '/decks', label: 'Decks', variant: 'decks' },
  { to: '/import', label: 'Import', variant: 'import' },
]

/**
 * The application's primary "omnichannel" mode hub: five large, distinctly
 * colored buttons stacked vertically. This uses the same single-column
 * layout at every viewport width (see `.mode-menu` in index.css) rather
 * than reflowing into a grid on larger screens, so desktop and handheld
 * users see the same shape and can navigate the same way on either.
 */
export function ModeMenu() {
  return (
    <nav className="mode-menu" aria-label="Modes">
      {MODE_MENU_ITEMS.map((item) => (
        <Link key={item.to} to={item.to} className={`mode-btn mode-btn--${item.variant}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
