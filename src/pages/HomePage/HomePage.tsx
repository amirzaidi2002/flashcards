import { ModeMenu } from '../../components/ModeMenu/ModeMenu'

export function HomePage() {
  return (
    <section aria-labelledby="home-heading" className="home-hero">
      <div className="home-hero__intro">
        <h1 id="home-heading">Spanish Flashcards</h1>
        <p>Learn Spanish vocabulary through flashcards, quizzes, and progress tracking.</p>
      </div>
      <ModeMenu />
    </section>
  )
}
