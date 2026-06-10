export default function StatCell({ value, label, muted }: { value: string; label: string; muted: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-lg font-bold leading-none ${muted ? 'text-base-content/30' : ''}`}>
        {value}
      </span>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40">
        {label}
      </span>
    </div>
  )
}
