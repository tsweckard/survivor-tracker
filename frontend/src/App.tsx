import { useState } from 'react'
import { useSeasonStore } from './store/seasonStore'
import type { SeasonSummary } from './types'
import SeasonSetup from './components/SeasonSetup'
import SeasonList from './components/SeasonList'

type Screen = 'home' | 'new-season' | 'existing-season'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedSeason, setSelectedSeason] = useState<SeasonSummary | null>(null)
  const { setSeasonId } = useSeasonStore()

  const goHome = () => {
    setScreen('home')
    setSelectedSeason(null)
    setSeasonId(null)
  }

  if (screen === 'new-season') {
    return <SeasonSetup onBack={goHome} />
  }

  if (screen === 'existing-season' && selectedSeason) {
    return <SeasonSetup existingSeasonId={selectedSeason.id} onBack={goHome} />
  }

  return (
    <SeasonList
      onNew={() => setScreen('new-season')}
      onSelect={(season) => {
        setSelectedSeason(season)
        setScreen('existing-season')
      }}
    />
  )
}
