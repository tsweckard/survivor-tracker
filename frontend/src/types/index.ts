export interface Season {
  id: number
  name: string
  status: 'setup' | 'active' | 'completed'
  game_phase: 'pre_merge' | 'merged' | 'final_tribal'
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
