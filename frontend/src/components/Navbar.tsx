import FireIcon from './icons/FireIcon'
import { useNavigationStore } from '../store/navigationStore'

export default function Navbar() {
  const goHome = useNavigationStore((s) => s.goHome)

  return (
    <div className="navbar bg-neutral text-neutral-content px-10">
      <button onClick={goHome} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
        <FireIcon size={20} />
        <span className="font-bold tracking-widest text-md">SURVIVOR TRACKER</span>
      </button>
    </div>
  )
}
