import { create } from 'zustand'
import { useSeasonStore } from './seasonStore'
import type { SeasonSummary } from '../types'

type Screen = 'home' | 'new-season' | 'existing-season'

interface NavigationStore {
  screen: Screen
  selectedSeason: SeasonSummary | null
  goHome: () => void
  goToNewSeason: () => void
  goToExistingSeason: (season: SeasonSummary) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  screen: 'home',
  selectedSeason: null,
  goHome: () => {
    useSeasonStore.getState().setSeasonId(null)
    set({ screen: 'home', selectedSeason: null })
  },
  goToNewSeason: () => set({ screen: 'new-season' }),
  goToExistingSeason: (season) => set({ screen: 'existing-season', selectedSeason: season }),
}))
