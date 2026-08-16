import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeason, createTribe, deleteTribe } from '../../services/seasonService'

export default function TribesStep({ seasonId }: { seasonId: number }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#10736C')

  const { data: season } = useQuery({
    queryKey: ['season', seasonId],
    queryFn: () => getSeason(seasonId),
  })

  const createMutation = useMutation({
    mutationFn: () => createTribe(seasonId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season', seasonId] })
      setName('')
      setColor('#10736C')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (tribeId: number) => deleteTribe(seasonId, tribeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['season', seasonId] }),
  })

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-4xl font-serif font-medium mb-6">Add Tribes</h1>

      <ul className="space-y-2 mb-6">
        {season?.tribes.map((tribe) => (
          <li key={tribe.id} className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ background: tribe.color }}
            />
            <span className="flex-1">{tribe.name}</span>
            <button
              onClick={() => deleteMutation.mutate(tribe.id)}
              disabled={deleteMutation.isPending}
              className="btn btn-ghost btn-xs text-error"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate() }} className="space-y-3 mb-6">
        <div className="flex gap-3 items-end">
          <fieldset className="fieldset flex-1">
            <legend className="fieldset-legend">Tribe name</legend>
            <input
              id="tribe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Color</legend>
            <input
              id="tribe-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-base-300"
            />
          </fieldset>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn btn-primary whitespace-nowrap"
          >
            {createMutation.isPending ? 'Adding…' : 'Add Tribe'}
          </button>
        </div>
        {createMutation.error && <p className="text-error text-sm">{(createMutation.error as Error).message}</p>}
        {deleteMutation.error && <p className="text-error text-sm">{(deleteMutation.error as Error).message}</p>}
      </form>

    </div>
  )
}
