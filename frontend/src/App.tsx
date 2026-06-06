import Navbar from './components/Navbar'
import SeasonsPage from './components/SeasonsPage'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <SeasonsPage />
      </main>
    </div>
  )
}
