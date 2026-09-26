import { Navigation } from './components/Navigation/Navigation'
import { AppRoutes } from './routes'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="app__content">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
