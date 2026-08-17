import { useNavigationStore } from '../store/navigationStore'
import SeasonSetup from './SeasonSetup'
import SeasonList from './SeasonList'

export default function SeasonsPage() {
  const { screen, selectedSeason, goHome, goToNewSeason, goToExistingSeason } = useNavigationStore()

  if (screen === 'new-season') {
    return <SeasonSetup onBack={goHome} />
  }

  if (screen === 'existing-season' && selectedSeason) {
    return <SeasonSetup existingSeasonId={selectedSeason.id} onBack={goHome} />
  }

  return (
    <SeasonList onNew={goToNewSeason} onSelect={goToExistingSeason} />
  )
}
