import { apiFetch } from './api'
import type { Season, SeasonSummary, Tribe, Player } from '../types'

export const listSeasons = () =>
  apiFetch<SeasonSummary[]>('/seasons')

export interface SeasonPayload {
  name: string
  season_number?: number | null
  location?: string | null
  premiered_on?: string | null
}

export const createSeason = (data: SeasonPayload) =>
  apiFetch<Season>('/seasons', { method: 'POST', body: JSON.stringify({ season: data }) })

export const getSeason = (id: number) =>
  apiFetch<Season>(`/seasons/${id}`)

export const activateSeason = (id: number) =>
  apiFetch<Season>(`/seasons/${id}/activate`, { method: 'PATCH' })

export const createTribe = (seasonId: number, data: { name: string; color: string }) =>
  apiFetch<Tribe>(`/seasons/${seasonId}/tribes`, { method: 'POST', body: JSON.stringify({ tribe: data }) })

export const updateTribe = (seasonId: number, tribeId: number, data: { name?: string; color?: string }) =>
  apiFetch<Tribe>(`/seasons/${seasonId}/tribes/${tribeId}`, { method: 'PATCH', body: JSON.stringify({ tribe: data }) })

export const deleteTribe = (seasonId: number, tribeId: number) =>
  apiFetch<void>(`/seasons/${seasonId}/tribes/${tribeId}`, { method: 'DELETE' })

export interface PlayerPayload {
  name: string
  tribe_id?: number | null
  athleticism: number
  social: number
  strategic: number
  likability: number
  loyalty: number
}

export const createPlayer = (seasonId: number, data: PlayerPayload) =>
  apiFetch<Player>(`/seasons/${seasonId}/players`, { method: 'POST', body: JSON.stringify({ player: data }) })

export const updatePlayer = (seasonId: number, playerId: number, data: Partial<PlayerPayload>) =>
  apiFetch<Player>(`/seasons/${seasonId}/players/${playerId}`, { method: 'PATCH', body: JSON.stringify({ player: data }) })

export const deletePlayer = (seasonId: number, playerId: number) =>
  apiFetch<void>(`/seasons/${seasonId}/players/${playerId}`, { method: 'DELETE' })
