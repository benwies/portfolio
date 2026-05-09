import { useEffect, useRef, useState } from 'react'
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
const iconGridEvent = 'cde-icon-grid-update'

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))
const cellKey = (cell) => `${cell.col}:${cell.row}`
const storageKey = (iconId) => `${iconGridStoragePrefix}${iconId}`

export function CdeIcon({ label, type }) {
  const src = iconFiles[type] ?? textIcon
  return <img className="cde-theme-icon" src={src} alt={label ?? ''} draggable="false" />
}

function maxGrid() {
  return {
    col: Math.max(0, Math.floor((window.innerWidth - iconWidth - gridStartX) / gridCellWidth)),
    row: Math.max(0, Math.floor((window.innerHeight - 64 - iconHeight - gridStartY) / gridCellHeight)),
  }
}

function clampCell(cell) {
  const max = maxGrid()
  return {
    col: clamp(cell.col ?? 0, 0, max.col),
    row: clamp(cell.row ?? 0, 0, max.row),
  }
}

function gridToPosition(cell) {
  const next = clampCell(cell)
  return {
    x: gridStartX + next.col * gridCellWidth,
    y: gridStartY + next.row * gridCellHeight,
  }
}

function positionToGrid(position) {
  return clampCell({
    col: Math.round((position.x - gridStartX) / gridCellWidth),
    row: Math.round((position.y - gridStartY) / gridCellHeight),
  })
}

function clampPosition(position) {
  return {
    x: clamp(position.x, 0, window.innerWidth - iconWidth),
    y: clamp(position.y, 0, window.innerHeight - 64 - iconHeight),
  }
}

function loadGridCell(icon, index) {
  const fallback = { col: 0, row: index }
  const stored = localStorage.getItem(storageKey(icon.id))
  if (!stored) return fallback

  try {
    return clampCell({ ...fallback, ...JSON.parse(stored) })
  } catch {
    return fallback
  }
}

function saveGridCell(iconId, cell) {
  localStorage.setItem(storageKey(iconId), JSON.stringify(clampCell(cell)))
}

function findIconAtCell(icons, targetCell, currentIconId) {
  return icons.find((item, itemIndex) => {
    if (item.id === currentIconId) return false
    return cellKey(loadGridCell(item, itemIndex)) === cellKey(targetCell)
  })
}

function DesktopIcon({ icon, index, icons }) {
  const [position, setPosition] = useState(() => gridToPosition(loadGridCell(icon, index)))
  const dragRef = useRef(null)
  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    const handleGridUpdate = (event) => {
      const nextCell = event.detail?.[icon.id]
      if (nextCell) setPosition(gridToPosition(nextCell))
    }

    window.addEventListener(iconGridEvent, handleGridUpdate)
    return () => window.removeEventListener(iconGridEvent, handleGridUpdate)
  }, [icon.id])

  const startPointer = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      originCell: loadGridCell(icon, index),
      started: false,
    }
  }

  const movePointer = (event) => {
    const drag = dragRef.current
    if (!drag) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (!drag.started && Math.hypot(deltaX, deltaY) <= dragThreshold) return

    drag.started = true
    setPosition(clampPosition({
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    }))
  }

  const endPointer = (event) => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null

    if (!drag.started) return

    const droppedPosition = clampPosition({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    })
    const targetCell = positionToGrid(droppedPosition)
    const updates = { [icon.id]: targetCell }
    const occupant = findIconAtCell(icons, targetCell, icon.id)

    if (occupant) updates[occupant.id] = drag.originCell

    Object.entries(updates).forEach(([iconId, cell]) => saveGridCell(iconId, cell))
    window.dispatchEvent(new CustomEvent(iconGridEvent, { detail: updates }))
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
