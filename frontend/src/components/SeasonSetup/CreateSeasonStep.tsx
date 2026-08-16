import { useState } from 'react'
import type { SeasonPayload } from '../../services/seasonService'

export default function CreateSeasonStep({ onSubmit, error }: {
  onSubmit: (data: SeasonPayload) => void
  error?: string
}) {
  const [name, setName] = useState('')
  const [seasonNumber, setSeasonNumber] = useState('')
  const [location, setLocation] = useState('')
  const [premieredOn, setPremieredOn] = useState('')

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-4xl font-serif font-medium mb-6">New Season</h1>
      <form
        id="create-season-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            name,
            season_number: seasonNumber ? parseInt(seasonNumber) : null,
            location: location || null,
            premiered_on: premieredOn || null,
          })
        }}
        className="space-y-4"
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Season name <span className="text-error">*</span></legend>
          <input
            id="season-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Season number</legend>
            <input
              id="season-number"
              type="number"
              min={1}
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              className="input input-bordered w-full"
              placeholder="e.g. 48"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Premiere date</legend>
            <input
              id="premiered-on"
              type="date"
              value={premieredOn}
              onChange={(e) => setPremieredOn(e.target.value)}
              className="input input-bordered w-full"
            />
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Location</legend>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input input-bordered w-full"
            placeholder="e.g. Fiji"
          />
        </fieldset>

        {error && <p className="text-error text-sm">{error}</p>}
      </form>
    </div>
  )
}
