import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'

function FolderIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="9" y="20" width="47" height="30" fill="#c8b87a" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="9" y="15" width="17" height="8" fill="#c8b87a" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="13" y="18" width="7" height="6" fill="#41566a" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M12 24h41" stroke="#eee2b0" strokeWidth="2" />
      <path d="M10 49h46V22" stroke="#7b7045" strokeWidth="3" fill="none" />
    </svg>
  )
}

function TextIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M17 7h29l8 8v43H17z" fill="#f0ede0" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M46 7v10h10" fill="#ccc" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M24 24h25M24 31h24M24 38h22M24 45h24" stroke="#777" strokeWidth="3" />
    </svg>
  )
}

function SocialsIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="15" rx="20" ry="7" fill="#4a7a6a" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M12 15v31c0 5 9 8 20 8s20-3 20-8V15" fill="#3f6b62" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M13 26c6 5 32 5 38 0M13 38c6 5 32 5 38 0" stroke="#9fb0aa" strokeWidth="2" fill="none" />
      <ellipse cx="32" cy="46" rx="20" ry="8" fill="#31584f" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="23" y="30" width="18" height="12" fill="#d6d0bd" stroke="#1a1a1a" strokeWidth="2" />
      <text x="32" y="39" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#1a1a1a">DB</text>
    </svg>
  )
}

function CertsIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="12" width="44" height="40" fill="#f0ede0" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="10" y="12" width="44" height="9" fill="#aaa195" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M10 30h44M10 39h44M24 21v31M39 21v31" stroke="#888" strokeWidth="2" />
      <path d="M15 17h9M28 17h9M42 17h7" stroke="#eee" strokeWidth="2" />
    </svg>
  )
}

function SkillsIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M28 7h8l2 9 7-5 6 6-5 7 9 2v8l-9 2 5 7-6 6-7-5-2 9h-8l-2-9-7 5-6-6 5-7-9-2v-8l9-2-5-7 6-6 7 5z"
        fill="#808080"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <circle cx="32" cy="30" r="15" fill="#b8a898" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="32" cy="30" r="7" fill="#f0ede0" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="9" y="12" width="46" height="37" fill="#000" stroke="#888" strokeWidth="2" />
      <rect x="9" y="12" width="46" height="8" fill="#8a8a8a" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M16 30l7 5-7 5M26 42h12" stroke="#00ff00" strokeWidth="3" fill="none" />
      <rect x="39" y="39" width="6" height="3" fill="#00ff00" />
    </svg>
  )
}

export function CdeIcon({ type }) {
  const icons = {
    folder: FolderIcon,
    text: TextIcon,
    socials: SocialsIcon,
    certs: CertsIcon,
    skills: SkillsIcon,
    terminal: TerminalIcon,
  }
  const Icon = icons[type] ?? TextIcon
  return <Icon />
}

function DesktopIcon({ icon }) {
  const [selected, setSelected] = useState(false)
  const openWindow = useWindowStore((state) => state.openWindow)

  return (
    <button
      type="button"
      className={selected ? 'desktop-icon is-selected' : 'desktop-icon'}
      onClick={() => setSelected(true)}
      onDoubleClick={() => openWindow(icon.appId)}
      aria-label={`Open ${icon.label}`}
    >
      <span className="desktop-icon__glyph">
        <CdeIcon type={icon.icon} />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
