import { useState } from 'react'
import type { SeasonPayload } from '../../services/seasonService'
import type { Season } from '../../types'

export default function CreateSeasonStep({ onSubmit, error, season, readOnly }: {
  onSubmit?: (data: SeasonPayload) => void
  error?: string
  season?: Season
  readOnly?: boolean
}) {
  const [name, setName] = useState('')
  const [seasonNumber, setSeasonNumber] = useState('')
  const [location, setLocation] = useState('')
  const [premieredOn, setPremieredOn] = useState('')

  const nameValue = readOnly ? season?.name ?? '' : name
  const seasonNumberValue = readOnly ? season?.season_number?.toString() ?? '' : seasonNumber
  const locationValue = readOnly ? season?.location ?? '' : location
  const premieredOnValue = readOnly ? season?.premiered_on ?? '' : premieredOn

  return (
    <div className="p-8">
      <h1 className="text-4xl font-serif font-medium mb-6">{readOnly ? season?.name : 'New Season'}</h1>
      <form
        id="create-season-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.({
            name,
            season_number: seasonNumber ? parseInt(seasonNumber) : null,
            location: location || null,
            premiered_on: premieredOn || null,
          })
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Season name {!readOnly && <span className="text-error">*</span>}</legend>
            <input
              id="season-name"
              type="text"
              value={nameValue}
              onChange={readOnly ? undefined : (e) => setName(e.target.value)}
              readOnly={readOnly}
              required={!readOnly}
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Season number</legend>
            <input
              id="season-number"
              type="number"
              min={1}
              value={seasonNumberValue}
              onChange={readOnly ? undefined : (e) => setSeasonNumber(e.target.value)}
              readOnly={readOnly}
              className="input input-bordered w-full"
              placeholder="e.g. 48"
            />
          </fieldset>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Location</legend>
            <input
              id="location"
              type="text"
              value={locationValue}
              onChange={readOnly ? undefined : (e) => setLocation(e.target.value)}
              readOnly={readOnly}
              className="input input-bordered w-full"
              placeholder="e.g. Fiji"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Premiere date</legend>
            <input
              id="premiered-on"
              type="date"
              value={premieredOnValue}
              onChange={readOnly ? undefined : (e) => setPremieredOn(e.target.value)}
              readOnly={readOnly}
              className="input input-bordered w-full"
            />
          </fieldset>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}
      </form>
    </div>
  )
}
