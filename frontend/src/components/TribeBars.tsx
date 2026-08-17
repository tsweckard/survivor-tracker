export default function TribeBars({ colors, muted }: { colors: string[]; muted: boolean }) {
  if (muted || colors.length === 0) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-base-content/15" />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-1">
      {colors.map((color, i) => (
        <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}
