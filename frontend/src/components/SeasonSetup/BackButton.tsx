export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn btn-ghost btn-sm">
      ← Back
    </button>
  )
}
