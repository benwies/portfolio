import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'

function FolderIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#c08000" d="M2 8h11l3 4h14v16H2z" />
      <path fill="#ffff80" d="M3 9h10l3 4h13v3H3z" />
      <path fill="#ffd040" d="M3 14h26v13H3z" />
      <path fill="#805000" d="M2 27h28v2H2z" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="5" width="26" height="22" fill="#000" stroke="#808080" strokeWidth="2" />
      <path fill="#d4d0c8" d="M7 10h6v2H7zM7 14h3v2H7zM11 16h8v2h-8z" />
      <path fill="#ffffff" d="M5 7h22v2H5z" opacity=".35" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#808080" d="M16 3l11 4v8c0 7-4 11-11 14C9 26 5 22 5 15V7z" />
      <path fill="#1084d0" d="M16 6l8 3v6c0 5-3 8-8 11z" />
      <path fill="#d4d0c8" d="M16 6L8 9v6c0 5 3 8 8 11z" />
      <path fill="#000080" d="M14 11h4v8h-4zM11 14h10v3H11z" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#ffffff" stroke="#808080" d="M7 3h13l5 5v21H7z" />
      <path fill="#d00000" d="M20 3v6h6zM9 20h14v6H9z" />
      <path fill="#ffffff" d="M11 22h2v2h-2zM15 22h2v2h-2zM19 22h2v2h-2z" />
    </svg>
  )
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="6" width="11" height="9" fill="#c0c0c0" stroke="#404040" />
      <rect x="18" y="6" width="11" height="9" fill="#c0c0c0" stroke="#404040" />
      <rect x="5" y="8" width="7" height="5" fill="#000080" />
      <rect x="20" y="8" width="7" height="5" fill="#1084d0" />
      <path stroke="#202020" strokeWidth="2" d="M9 16v4h14v-4M16 20v5" fill="none" />
      <rect x="12" y="25" width="8" height="3" fill="#808080" />
    </svg>
  )
}

function LogsIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#ffffff" stroke="#808080" d="M8 3h17v26H8z" />
      <path fill="#d4d0c8" d="M10 5h13v3H10z" />
      <path stroke="#000" d="M11 12h11M11 16h11M11 20h8M11 24h10" />
      <path fill="#000080" d="M6 6h3v22H6z" />
    </svg>
  )
}

const icons = {
  folder: FolderIcon,
  script: ShieldIcon,
  pdf: PdfIcon,
  terminal: TerminalIcon,
  network: NetworkIcon,
  logs: LogsIcon,
}

function DesktopIcon({ icon }) {
  const [selected, setSelected] = useState(false)
  const openWindow = useWindowStore((state) => state.openWindow)
  const Icon = icons[icon.icon] ?? FolderIcon

  const open = () => {
    setSelected(true)
    openWindow(icon.appId)
  }

  return (
    <button
      type="button"
      className={selected ? 'desktop-icon is-selected' : 'desktop-icon'}
      onClick={() => setSelected(true)}
      onDoubleClick={open}
      aria-label={`Open ${icon.label}`}
    >
      <span className="desktop-icon__glyph">
        <Icon />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
