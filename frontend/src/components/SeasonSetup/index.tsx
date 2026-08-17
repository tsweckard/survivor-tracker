import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSeasonStore } from '../../store/seasonStore'
import { createSeason, activateSeason, getSeason } from '../../services/seasonService'
import CreateSeasonStep from './CreateSeasonStep'
import SeasonInfoStep from './SeasonInfoStep'
import TribesStep from './TribesStep'
import PlayersStep from './PlayersStep'
import SeasonLive from './SeasonLive'
import BackButton from './BackButton'
import CheckIcon from '../icons/CheckIcon'

type Step = 1 | 2 | 3

const TABS: { step: Step; label: string }[] = [
  { step: 1, label: 'Season' },
  { step: 2, label: 'Tribes' },
  { step: 3, label: 'Players' },
]

export default function SeasonSetup({ existingSeasonId, onBack }: { existingSeasonId?: number; onBack?: () => void }) {
  const [step, setStep] = useState<Step>(existingSeasonId ? 2 : 1)
  const [isLive, setIsLive] = useState(false)
  const { seasonId, setSeasonId } = useSeasonStore()

  useEffect(() => {
    if (existingSeasonId && !seasonId) setSeasonId(existingSeasonId)
  }, [existingSeasonId])

  const activeSeasonId = seasonId ?? existingSeasonId!

  const { data: season } = useQuery({
    queryKey: ['season', activeSeasonId],
    queryFn: () => getSeason(activeSeasonId),
    enabled: !!activeSeasonId,
  })

  const hasTribes = (season?.tribes.length ?? 0) > 0
  const hasPlayers = (season?.players.length ?? 0) > 0

  const createMutation = useMutation({
    mutationFn: createSeason,
    onSuccess: (created) => { setSeasonId(created.id); setStep(2) },
  })

  const activateMutation = useMutation({
    mutationFn: () => activateSeason(activeSeasonId),
    onSuccess: () => setIsLive(true),
  })

  if (isLive) return <SeasonLive onBack={onBack} />

  function isTabEnabled(tabStep: Step): boolean {
    if (tabStep === 1) return true
    if (tabStep === 2) return !!activeSeasonId
    return hasTribes
  }

  function isTabComplete(tabStep: Step): boolean {
    if (tabStep === 1) return !!activeSeasonId
    if (tabStep === 2) return hasTribes
    return hasPlayers
  }

  function goPrev() {
    if (step === 2) {
      if (onBack) onBack()
      else setStep(1)
      return
    }
    if (step === 3) setStep(2)
  }

  const showBack = step > 1 || !!onBack

  return (
    <div className="flex flex-col">
      <div className="border-b border-base-300">
        <div role="tablist" className="tabs justify-between px-8 divide-x divide-base-300">
          {TABS.map(({ step: tabStep, label }) => {
            const enabled = isTabEnabled(tabStep)
            const complete = isTabComplete(tabStep)
            const active = step === tabStep
            return (
              <button
                key={tabStep}
                role="tab"
                disabled={!enabled}
                onClick={() => setStep(tabStep)}
                className={[
                  'flex-1 tab gap-1.5 border-b-4',
                  active ? 'tab-active border-b-primary' : 'border-b-transparent',
                  complete ? 'text-success' : '',
                  !enabled ? 'tab-disabled' : '',
                ].filter(Boolean).join(' ')}
              >
                {complete && <CheckIcon size={14} />}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        {step === 1 && !activeSeasonId && (
          <CreateSeasonStep
            onSubmit={(data) => createMutation.mutate(data)}
            error={createMutation.error ? (createMutation.error as Error).message : undefined}
          />
        )}
        {step === 1 && activeSeasonId && (
          <SeasonInfoStep seasonId={activeSeasonId} />
        )}
        {step === 2 && activeSeasonId && (
          <TribesStep seasonId={activeSeasonId} />
        )}
        {step === 3 && activeSeasonId && (
          <PlayersStep seasonId={activeSeasonId} />
        )}
      </div>

      <div className="px-8 pb-8 flex items-center justify-between">
        <div>
          {showBack && <BackButton onClick={step > 1 ? goPrev : onBack!} />}
        </div>
        <div className="flex flex-col items-end gap-1">
          {step === 1 && !activeSeasonId && (
            <button
              type="submit"
              form="create-season-form"
              disabled={createMutation.isPending}
              className="btn btn-primary"
            >
              {createMutation.isPending ? 'Creating…' : 'Create Season'}
            </button>
          )}
          {step === 1 && activeSeasonId && (
            <button onClick={() => setStep(2)} className="btn btn-primary">
              Next: Add Tribes →
            </button>
          )}
          {step === 2 && (
            <button onClick={() => setStep(3)} className="btn btn-success">
              Next: Add Players →
            </button>
          )}
          {step === 3 && (
            <>
              {activateMutation.error && (
                <p className="text-error text-sm">{(activateMutation.error as Error).message}</p>
              )}
              <button
                onClick={() => activateMutation.mutate()}
                disabled={activateMutation.isPending}
                className="btn btn-success"
              >
                {activateMutation.isPending ? 'Activating…' : 'Activate Season'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
