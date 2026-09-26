import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section aria-labelledby="home-heading">
      <h1 id="home-heading">Spanish Flashcards</h1>
      <p>Learn Spanish vocabulary through flashcards, quizzes, and progress tracking.</p>
      <p>
        <Link to="/decks">Browse decks to get started</Link>
      </p>
    </section>
  )
}
