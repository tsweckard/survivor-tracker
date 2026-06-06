import FireIcon from './icons/FireIcon'

export default function Navbar() {
  return (
    <div className="navbar bg-neutral text-neutral-content px-10">
      <div className="flex items-center gap-4">
        <FireIcon size={20} />
        <span className="font-bold tracking-widest text-md">SURVIVOR TRACKER</span>
      </div>
    </div>
  )
}
