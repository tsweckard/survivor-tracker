import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createSeason } from '../../services/seasonService'
import BackButton from './BackButton'

export default function CreateSeasonStep({ onCreated, onBack }: { onCreated: (id: number) => void; onBack?: () => void }) {
  const [name, setName] = useState('')
  const mutation = useMutation({
    mutationFn: () => createSeason(name),
    onSuccess: (season) => onCreated(season.id),
  })

  return (
    <div className="p-8 max-w-lg">
      {onBack && <BackButton onClick={onBack} />}
      <h1 className="text-4xl font-bold mb-6">New Season</h1>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate() }} className="space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Season name</legend>
          <input
            id="season-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </fieldset>
        {mutation.error && <p className="text-error text-sm">{(mutation.error as Error).message}</p>}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn btn-primary"
        >
          {mutation.isPending ? 'Creating…' : 'Create Season'}
        </button>
      </form>
    </div>
  )
}
