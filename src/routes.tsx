import { Route, Routes } from 'react-router-dom'
import { DecksPage } from './pages/DecksPage/DecksPage'
import { HomePage } from './pages/HomePage/HomePage'
import { ImportPage } from './pages/ImportPage/ImportPage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { QuizPage } from './pages/QuizPage/QuizPage'
import { StatisticsPage } from './pages/StatisticsPage/StatisticsPage'
import { StudyPage } from './pages/StudyPage/StudyPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/study" element={<StudyPage />} />
      <Route path="/study/review" element={<StudyPage mode="review" />} />
      <Route path="/study/:deckId" element={<StudyPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quiz/:deckId" element={<QuizPage />} />
      <Route path="/decks" element={<DecksPage />} />
      <Route path="/decks/:deckId" element={<DecksPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
