export interface SeasonSummary {
  id: number
  name: string
  status: 'setup' | 'active' | 'completed'
  game_phase: 'pre_merge' | 'merged' | 'final_tribal'
  season_number: number | null
  location: string | null
  premiered_on: string | null
  ended_on: string | null
  tribe_colors: string[]
  player_count: number
  booted_count: number
  episode_count: number
}

export interface Season {
  id: number
  name: string
  status: 'setup' | 'active' | 'completed'
  game_phase: 'pre_merge' | 'merged' | 'final_tribal'
  season_number: number | null
  location: string | null
  premiered_on: string | null
  ended_on: string | null
  tribes: Tribe[]
  players: Player[]
}

export interface Tribe {
  id: number
  name: string
  color: string
  status: 'active' | 'dissolved'
}

export interface Player {
  id: number
  name: string
  tribe_id: number | null
  status: 'active' | 'jury' | 'eliminated' | 'winner'
  athleticism: number
  social: number
  strategic: number
  likability: number
  loyalty: number
}
