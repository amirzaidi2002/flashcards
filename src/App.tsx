import { Navigation } from './components/Navigation/Navigation'
import { PageContainer } from './components/PageContainer/PageContainer'
import { AppRoutes } from './routes'

function App() {
  return (
    <div className="app">
      <header>
        <Navigation />
      </header>
      <main className="app__main">
        <PageContainer>
          <AppRoutes />
        </PageContainer>
      </main>
    </div>
  )
}

export default App
