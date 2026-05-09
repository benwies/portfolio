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
}

const iconWidth = 84
const iconHeight = 96
const gridStartX = 16
const gridStartY = 16
const gridCellWidth = 120
const gridCellHeight = 130
const dragThreshold = 8
const iconGridStoragePrefix = 'icon_grid_v2_'

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))

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
  const fallback = gridToPosition({ col: 0, row: index })
  const stored = localStorage.getItem(`${iconGridStoragePrefix}${icon.id}`)
  if (!stored) return fallback

  try {
    return gridToPosition(JSON.parse(stored))
  } catch {
    return fallback
  }
}

function clampPosition(position) {
  return {
    x: clamp(position.x, 0, window.innerWidth - iconWidth),
    y: clamp(position.y, 0, window.innerHeight - 64 - iconHeight),
  }
}

function maxGrid() {
  return {
    col: Math.max(0, Math.floor((window.innerWidth - iconWidth - gridStartX) / gridCellWidth)),
    row: Math.max(0, Math.floor((window.innerHeight - 64 - iconHeight - gridStartY) / gridCellHeight)),
  }
}

function gridToPosition(cell) {
  const max = maxGrid()
  return {
    x: gridStartX + clamp(cell.col ?? 0, 0, max.col) * gridCellWidth,
    y: gridStartY + clamp(cell.row ?? 0, 0, max.row) * gridCellHeight,
  }
}

function positionToGrid(position) {
  const max = maxGrid()
  return {
    col: clamp(Math.round((position.x - gridStartX) / gridCellWidth), 0, max.col),
    row: clamp(Math.round((position.y - gridStartY) / gridCellHeight), 0, max.row),
  }
}

function cellKey(cell) {
  return `${cell.col}:${cell.row}`
}

function loadGridCell(icon, index) {
  const fallback = { col: 0, row: index }
  const stored = localStorage.getItem(`${iconGridStoragePrefix}${icon.id}`)
  if (!stored) return fallback

  try {
    return { ...fallback, ...JSON.parse(stored) }
  } catch {
    return fallback
  }
}

function nextFreeCell(targetCell, icons, currentIconId) {
  const max = maxGrid()
  const occupied = new Set(
    icons
      .filter((item) => item.id !== currentIconId)
      .map((item, itemIndex) => cellKey(loadGridCell(item, itemIndex))),
  )

  for (let row = targetCell.row; row <= max.row; row += 1) {
    for (let col = row === targetCell.row ? targetCell.col : 0; col <= max.col; col += 1) {
      const candidate = { col, row }
      if (!occupied.has(cellKey(candidate))) return candidate
    }
  }

  for (let row = targetCell.row; row >= 0; row -= 1) {
    for (let col = row === targetCell.row ? targetCell.col : max.col; col >= 0; col -= 1) {
      const candidate = { col, row }
      if (!occupied.has(cellKey(candidate))) return candidate
    }
  }

  return targetCell
}

function DesktopIcon({ icon, index, icons }) {
  const [position, setPosition] = useState(() => loadPosition(icon, index))
  const [dragState, setDragState] = useState(null)
  const openWindow = useWindowStore((state) => state.openWindow)

  const startPointer = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragState({
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      started: false,
    })
  }

  const movePointer = (event) => {
    if (!dragState) return
    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    const movedEnough = Math.hypot(deltaX, deltaY) > dragThreshold
    if (!dragState.started && !movedEnough) return
    if (!dragState.started) {
      setDragState((current) => (current ? { ...current, started: true } : current))
    }
    setPosition(clampPosition({
      x: dragState.originX + deltaX,
      y: dragState.originY + deltaY,
    }))
  }

  const endPointer = (event) => {
    if (!dragState) return
    if (dragState.started) {
      const currentPosition = clampPosition({
        x: dragState.originX + event.clientX - dragState.startX,
        y: dragState.originY + event.clientY - dragState.startY,
      })
      const nextCell = nextFreeCell(positionToGrid(currentPosition), icons, icon.id)
      const nextPosition = gridToPosition(nextCell)
      setPosition(nextPosition)
      localStorage.setItem(`${iconGridStoragePrefix}${icon.id}`, JSON.stringify(nextCell))
    }
    setDragState(null)
  }

  return (
    <button
      type="button"
      className="desktop-icon"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onDoubleClick={() => openWindow(icon.appId)}
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onDragStart={(event) => event.preventDefault()}
      tabIndex={-1}
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
