import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createPlayer, updatePlayer, deletePlayer } from '../../services/seasonService'
import type { Player } from '../../types'
import { initials } from '../../utils/format'
import UsersIcon from '../icons/UsersIcon'
import EditIcon from '../icons/EditIcon'
import TrashIcon from '../icons/TrashIcon'

type StatKey = 'athleticism' | 'social' | 'strategic' | 'likability' | 'loyalty'
type Stats = Record<StatKey, number>

const STAT_FIELDS: { key: StatKey; label: string }[] = [
  { key: 'athleticism', label: 'Athleticism' },
  { key: 'social', label: 'Social' },
  { key: 'strategic', label: 'Strategic' },
  { key: 'likability', label: 'Likability' },
  { key: 'loyalty', label: 'Loyalty' },
]

const defaultStats: Stats = { athleticism: 5, social: 5, strategic: 5, likability: 5, loyalty: 5 }

const sectionLabel = 'text-xs font-semibold tracking-widest uppercase'

export default function PlayersStep({ seasonId }: { seasonId: number }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [tribeId, setTribeId] = useState<string>('')
  const [stats, setStats] = useState<Stats>({ ...defaultStats })
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null)

  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  const tribes = season?.tribes ?? []
  const players = season?.players ?? []

  function resetForm() {
    setName('')
    setTribeId('')
    setStats({ ...defaultStats })
    setEditingPlayerId(null)
  }

  const createMutation = useMutation({
    mutationFn: () =>
      createPlayer(seasonId, {
        name,
        tribe_id: tribeId ? parseInt(tribeId) : null,
        ...stats,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePlayer(seasonId, editingPlayerId!, {
        name,
        tribe_id: tribeId ? parseInt(tribeId) : null,
        ...stats,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (playerId: number) => deletePlayer(seasonId, playerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['season', seasonId] }),
  })

  function startEdit(player: Player) {
    setEditingPlayerId(player.id)
    setName(player.name)
    setTribeId(player.tribe_id ? String(player.tribe_id) : '')
    setStats({
      athleticism: player.athleticism,
      social: player.social,
      strategic: player.strategic,
      likability: player.likability,
      loyalty: player.loyalty,
    })
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  const renderPlayerRow = (player: Player, tribeColor?: string) => (
    <li
      key={player.id}
      className="rounded-box border border-base-content/20 px-5 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold text-white"
          style={{ backgroundColor: tribeColor ?? 'var(--color-base-300)' }}
        >
          {initials(player.name)}
        </span>
        <span className="font-semibold">{player.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => startEdit(player)}
          className="btn btn-ghost btn-xs btn-square"
          aria-label={`Edit ${player.name}`}
        >
          <EditIcon size={16} />
        </button>
        <button
          onClick={() => deleteMutation.mutate(player.id)}
          disabled={deleteMutation.isPending}
          className="btn btn-ghost btn-xs btn-square text-error"
          aria-label={`Delete ${player.name}`}
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  )

  const unassignedPlayers = players.filter((p) => p.tribe_id === null)

  return (
    <div className="flex-1 grid grid-cols-2">
      <div className="p-8 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-base-300 mb-6">
          <span className={sectionLabel}>Roster</span>
          <span className={`${sectionLabel} text-base-content/50`}>{players.length} Players</span>
        </div>

        {players.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-base-content/25 flex items-center justify-center">
              <UsersIcon size={24} className="text-base-content/25" />
            </div>
            <div>
              <p className="font-semibold">No players yet</p>
              <p className="text-sm text-base-content/50 mt-1">Add your first player using the form</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {tribes.map((tribe) => {
              const tribePlayers = players.filter((p) => p.tribe_id === tribe.id)
              if (tribePlayers.length === 0) return null
              return (
                <div key={tribe.id}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-base-content/40 mb-2">
                    {tribe.name}
                  </p>
                  <ul className="space-y-3">
                    {tribePlayers.map((player) => renderPlayerRow(player, tribe.color))}
                  </ul>
                </div>
              )
            })}

            {unassignedPlayers.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-base-content/40 mb-2">
                  Unassigned
                </p>
                <ul className="space-y-3">
                  {unassignedPlayers.map((player) => renderPlayerRow(player))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col">
        <div className="flex items-center pb-3 border-b border-base-300 mb-6">
          <span className={sectionLabel}>{editingPlayerId ? 'Edit Player' : 'Add a Player'}</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (editingPlayerId) updateMutation.mutate()
            else createMutation.mutate()
          }}
          className="flex-1 flex flex-col"
        >
          <fieldset className="fieldset">
            <legend className={`fieldset-legend ${sectionLabel}`}>Name</legend>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset mt-4">
            <legend className={`fieldset-legend ${sectionLabel}`}>Tribe (optional)</legend>
            <select
              id="player-tribe"
              value={tribeId}
              onChange={(e) => setTribeId(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">— unassigned —</option>
              {tribes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </fieldset>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {STAT_FIELDS.map(({ key, label }) => (
              <fieldset key={key} className="fieldset">
                <legend className={`fieldset-legend ${sectionLabel}`}>{label}: {stats[key]}</legend>
                <input
                  id={`stat-${key}`}
                  type="range"
                  min={1}
                  max={10}
                  value={stats[key]}
                  onChange={(e) => setStats((s) => ({ ...s, [key]: parseInt(e.target.value) }))}
                  className="range range-primary w-full"
                />
              </fieldset>
            ))}
          </div>

          {createMutation.error && <p className="text-error text-sm mt-4">{(createMutation.error as Error).message}</p>}
          {updateMutation.error && <p className="text-error text-sm mt-4">{(updateMutation.error as Error).message}</p>}
          {deleteMutation.error && <p className="text-error text-sm mt-4">{(deleteMutation.error as Error).message}</p>}

          <div className="mt-auto flex justify-end gap-2 pt-6">
            {editingPlayerId && (
              <button type="button" onClick={resetForm} className="btn btn-outline whitespace-nowrap">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || !name}
              className="btn btn-primary whitespace-nowrap"
            >
              {isSaving ? 'Saving…' : editingPlayerId ? 'Save Changes' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
