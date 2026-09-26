import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-heading">
      <h1 id="not-found-heading">Page not found</h1>
      <p>We couldn&apos;t find the page you were looking for.</p>
      <Link to="/decks">Back to Decks</Link>
    </section>
  )
}
