import { create } from 'zustand'

interface SeasonStore {
  seasonId: number | null
  setSeasonId: (id: number) => void
}

export const useSeasonStore = create<SeasonStore>((set) => ({
  seasonId: null,
  setSeasonId: (id) => set({ seasonId: id }),
}))
