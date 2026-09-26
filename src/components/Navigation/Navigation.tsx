import { Link, NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/study', label: 'Study' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/decks', label: 'Decks' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/import', label: 'Import' },
]

export function Navigation() {
  return (
    <nav className="nav" aria-label="Primary">
      <Link to="/" className="nav__brand">
        Spanish Flashcards
      </Link>
      <ul className="nav__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
