import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import addressbookIcon from '../../assets/cde-icons/netscape_addressbook.png'
import folderIcon from '../../assets/cde-icons/folder.png'
import settingsIcon from '../../assets/cde-icons/settings.png'
import spreadsheetIcon from '../../assets/cde-icons/oo_spreadsheet.png'
import terminalIcon from '../../assets/cde-icons/terminal.png'
import textIcon from '../../assets/cde-icons/text.png'

const iconFiles = {
  certs: spreadsheetIcon,
  folder: folderIcon,
  skills: settingsIcon,
  socials: addressbookIcon,
  terminal: terminalIcon,
  text: textIcon,
  welcome: textIcon,
  snake: terminalIcon,
}

const iconWidth = 84
const iconHeight = 96
const grid = 10

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))
const snap = (value) => Math.round(value / grid) * grid

export function CdeIcon({ label, type }) {
  const src = iconFiles[type] ?? textIcon

  if (type === 'trash') return <TrashSvg />

  return <img className="cde-theme-icon" src={src} alt={label ?? ''} draggable="false" />
}

export function TrashSvg() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 22h28l-3 33H21z" fill="#9a9a9a" stroke="#222" strokeWidth="2" />
      <path d="M15 17h34v7H15z" fill="#c0c0c0" stroke="#222" strokeWidth="2" />
      <path d="M23 13h18v5H23z" fill="#808080" stroke="#222" strokeWidth="2" />
      <path d="M24 27v22M32 27v22M40 27v22" stroke="#555" strokeWidth="2" />
      <path d="M18 22h28M21 54h22" stroke="#ddeeff" strokeWidth="2" />
    </svg>
  )
}

function loadPosition(icon, index) {
  const fallback = { x: 16, y: 16 + index * 104 }
  const stored = localStorage.getItem(`icon_pos_${icon.id}`)
  if (!stored) return clampPosition(fallback)

  try {
    return clampPosition({ ...fallback, ...JSON.parse(stored) })
  } catch {
    return clampPosition(fallback)
  }
}

function clampPosition(position) {
  return {
    x: clamp(position.x, 0, window.innerWidth - iconWidth),
    y: clamp(position.y, 0, window.innerHeight - 64 - iconHeight),
  }
}

function DesktopIcon({ icon, index }) {
  const [selected, setSelected] = useState(false)
  const [position, setPosition] = useState(() => loadPosition(icon, index))
  const [dragOffset, setDragOffset] = useState(null)
  const openWindow = useWindowStore((state) => state.openWindow)

  const startDrag = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setSelected(true)
    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    })
  }

  const moveDrag = (event) => {
    if (!dragOffset) return
    setPosition(clampPosition({
      x: event.clientX - dragOffset.x,
      y: event.clientY - dragOffset.y,
    }))
  }

  const endDrag = () => {
    if (!dragOffset) return
    const next = {
      x: snap(clamp(position.x, 0, window.innerWidth - iconWidth)),
      y: snap(clamp(position.y, 0, window.innerHeight - 64 - iconHeight)),
    }
    setDragOffset(null)
    setPosition(next)
    localStorage.setItem(`icon_pos_${icon.id}`, JSON.stringify(next))
  }

  return (
    <button
      type="button"
      className={selected ? 'desktop-icon is-selected' : 'desktop-icon'}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onClick={() => setSelected(true)}
      onDoubleClick={() => openWindow(icon.appId)}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={`Open ${icon.label}`}
    >
      <span className="desktop-icon__glyph">
        <CdeIcon type={icon.icon} label="" />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
