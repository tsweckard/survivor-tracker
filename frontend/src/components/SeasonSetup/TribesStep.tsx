import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createTribe, updateTribe, deleteTribe } from '../../services/seasonService'
import UsersIcon from '../icons/UsersIcon'
import EditIcon from '../icons/EditIcon'
import TrashIcon from '../icons/TrashIcon'

const TRIBE_COLORS = ['#10736C', '#1D4A47', '#D3AC58', '#A4483A', '#3E7F86', '#4F8A6C']

const sectionLabel = 'text-xs font-semibold tracking-widest uppercase'

export default function TribesStep({ seasonId }: { seasonId: number }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [editingTribeId, setEditingTribeId] = useState<number | null>(null)

  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  const tribes = season?.tribes ?? []

  const usedByOther = new Map(
    tribes.filter((t) => t.id !== editingTribeId).map((t) => [t.color, t.name])
  )
  const swatchColors = Array.from(new Set([...TRIBE_COLORS, ...tribes.map((t) => t.color)]))
  const isCustomColor = color !== '' && !swatchColors.includes(color)

  function resetForm() {
    setName('')
    setColor('')
    setEditingTribeId(null)
  }

  const createMutation = useMutation({
    mutationFn: () => createTribe(seasonId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => updateTribe(seasonId, editingTribeId!, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (tribeId: number) => deleteTribe(seasonId, tribeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['season', seasonId] }),
  })

  function startEdit(tribeId: number, tribeName: string, tribeColor: string) {
    setEditingTribeId(tribeId)
    setName(tribeName)
    setColor(tribeColor)
  }

  const playerCount = (tribeId: number) => (season?.players ?? []).filter((p) => p.tribe_id === tribeId).length

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex-1 grid grid-cols-2">
      <div className="p-8 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-base-300 mb-6">
          <span className={sectionLabel}>Tribes</span>
          <span className={`${sectionLabel} text-base-content/50`}>{tribes.length} Added</span>
        </div>

        {tribes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-base-content/25 flex items-center justify-center">
              <UsersIcon size={24} className="text-base-content/25" />
            </div>
            <div>
              <p className="font-semibold">No tribes yet</p>
              <p className="text-sm text-base-content/50 mt-1">Add your first tribe using the form</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {tribes.map((tribe) => (
              <li
                key={tribe.id}
                className="rounded-box border border-base-content/20 px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tribe.color }} />
                  <span className="font-semibold" style={{ color: tribe.color }}>{tribe.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-base-content/50">{playerCount(tribe.id)} players</span>
                  <button
                    onClick={() => startEdit(tribe.id, tribe.name, tribe.color)}
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label={`Edit ${tribe.name}`}
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(tribe.id)}
                    disabled={deleteMutation.isPending}
                    className="btn btn-ghost btn-xs btn-square text-error"
                    aria-label={`Delete ${tribe.name}`}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-8 flex flex-col">
        <div className="flex items-center pb-3 border-b border-base-300 mb-6">
          <span className={sectionLabel}>{editingTribeId ? 'Edit Tribe' : 'Add a Tribe'}</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (editingTribeId) updateMutation.mutate()
            else createMutation.mutate()
          }}
          className="flex-1 flex flex-col"
        >
          <fieldset className="fieldset">
            <legend className={`fieldset-legend ${sectionLabel}`}>Tribe Name</legend>
            <input
              id="tribe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Lagi"
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset mt-4">
            <legend className={`fieldset-legend ${sectionLabel}`}>Tribe Color</legend>
            <div className="flex items-center gap-2">
              {swatchColors.map((hex) => {
                const usedByTribe = usedByOther.get(hex)
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => !usedByTribe && setColor(hex)}
                    disabled={!!usedByTribe}
                    aria-label={usedByTribe ? `${hex}, already used by ${usedByTribe}` : hex}
                    title={usedByTribe ? `Already used by ${usedByTribe}` : undefined}
                    className={[
                      'relative h-8 w-8 rounded-full transition-transform overflow-hidden',
                      usedByTribe ? 'cursor-not-allowed' : 'hover:scale-105',
                      color === hex && !usedByTribe ? 'ring-2 ring-offset-2 ring-base-content ring-offset-base-100' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ backgroundColor: hex }}
                  >
                    {usedByTribe && (
                      <span className="absolute inset-0 rounded-full bg-base-100/60 flex items-center justify-center">
                        <span className="w-7 h-0.5 rounded-full bg-base-content/70 rotate-45" />
                      </span>
                    )}
                  </button>
                )
              })}
              <label
                className={[
                  'h-8 w-8 rounded-full transition-transform hover:scale-105 cursor-pointer block',
                  isCustomColor ? 'ring-2 ring-offset-2 ring-base-content ring-offset-base-100' : '',
                ].filter(Boolean).join(' ')}
                style={
                  isCustomColor
                    ? { backgroundColor: color }
                    : { background: 'conic-gradient(from 0deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)' }
                }
                title="Custom color"
              >
                <input
                  type="color"
                  value={color || '#10736C'}
                  onChange={(e) => setColor(e.target.value)}
                  className="sr-only"
                />
              </label>
              {!color && <span className="text-sm text-base-content/50 ml-1">Pick one</span>}
            </div>
          </fieldset>

          {createMutation.error && <p className="text-error text-sm mt-4">{(createMutation.error as Error).message}</p>}
          {updateMutation.error && <p className="text-error text-sm mt-4">{(updateMutation.error as Error).message}</p>}
          {deleteMutation.error && <p className="text-error text-sm mt-4">{(deleteMutation.error as Error).message}</p>}

          <div className="mt-auto flex justify-end gap-2 pt-6">
            {editingTribeId && (
              <button type="button" onClick={resetForm} className="btn btn-outline whitespace-nowrap">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || !name || !color}
              className="btn btn-primary whitespace-nowrap"
            >
              {isSaving ? 'Saving…' : editingTribeId ? 'Save Changes' : 'Add Tribe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
