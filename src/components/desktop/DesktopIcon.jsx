import { useEffect, useRef, useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import addressbookIcon from '../../assets/cde-icons/netscape_addressbook.png'
import folderIcon from '../../assets/cde-icons/folder.png'
import settingsIcon from '../../assets/cde-icons/settings.png'
import snakeIcon from '../../assets/cde-icons/snake.png'
import paintIcon from '../../assets/cde-icons/paint.png'
import freeWifiIcon from '../../assets/cde-icons/free_wifi.png'
import spreadsheetIcon from '../../assets/cde-icons/oo_spreadsheet.png'
import terminalIcon from '../../assets/cde-icons/terminal.png'
import textIcon from '../../assets/cde-icons/text.png'

const iconFiles = {
  calculator: settingsIcon,
  certs: spreadsheetIcon,
  folder: folderIcon,
  skills: settingsIcon,
  socials: addressbookIcon,
  terminal: terminalIcon,
  text: textIcon,
  welcome: textIcon,
  snake: snakeIcon,
  paint: paintIcon,
  freeWifi: freeWifiIcon,
}

const iconWidth = 84
const gridStartX = 16
const gridStartY = 16
const gridCellWidth = 120
const gridCellHeight = 130
const taskbarHeight = 64
const resizeDebounce = 150
const widgetZoneWidth = 380
const widgetZoneHeight = 620
const dragThreshold = 8
const iconGridStoragePrefix = 'icon_grid_v5_'
const iconGridEvent = 'cde-icon-grid-update'
const defaultCells = {
  projects: { col: 0, row: 0 },
  about: { col: 0, row: 1 },
  socials: { col: 0, row: 2 },
  certs: { col: 0, row: 3 },
  terminal: { col: 0, row: 4 },
  skills: { col: 0, row: 5 },
  welcome: { col: 0, row: 6 },
  snake: { col: 1, row: 0 },
  freewifi: { col: 1, row: 1 },
  paint: { col: 1, row: 2 },
  pnptprep: { col: 1, row: 3 },
  calculator: { col: 1, row: 4 },
}

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))
const cellKey = (cell) => `${cell.col}:${cell.row}`
const storageKey = (iconId) => `${iconGridStoragePrefix}${iconId}`

export function CdeIcon({ label, type }) {
  const src = iconFiles[type] ?? textIcon
  return <img className="cde-theme-icon" src={src} alt={label ?? ''} draggable="false" />
}

function maxGrid() {
  return {
    col: Math.max(0, Math.floor((window.innerWidth - gridCellWidth - 20 - gridStartX) / gridCellWidth)),
    row: Math.max(0, Math.floor((window.innerHeight - taskbarHeight - gridCellHeight - 8 - gridStartY) / gridCellHeight)),
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
    x: clamp(position.x, gridStartX, window.innerWidth - gridCellWidth - 20),
    y: clamp(position.y, gridStartY, window.innerHeight - taskbarHeight - gridCellHeight - 8),
  }
}

function loadGridCell(icon, index) {
  const fallback = defaultCells[icon.id] ?? { col: 0, row: index }
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

function isInsideWidgetZone(position) {
  return (
    position.x + iconWidth > window.innerWidth - widgetZoneWidth &&
    position.y < widgetZoneHeight
  )
}

function avoidWidgetZone(cell) {
  let next = clampCell(cell)
  while (next.col > 0 && isInsideWidgetZone(gridToPosition(next))) {
    next = { ...next, col: next.col - 1 }
  }
  return next
}

function nextCell(cell) {
  const max = maxGrid()
  let col = cell.col
  let row = cell.row + 1

  if (row > max.row) {
    row = 0
    col += 1
  }

  if (col > max.col) {
    col = 0
    row = 0
  }

  return { col, row }
}

function findAvailableCell(startCell, occupied) {
  const max = maxGrid()
  const totalCells = (max.col + 1) * (max.row + 1)
  let candidate = clampCell(startCell)

  for (let index = 0; index < totalCells; index += 1) {
    const safeCandidate = avoidWidgetZone(candidate)
    if (!occupied.has(cellKey(safeCandidate))) return safeCandidate
    candidate = nextCell(candidate)
  }

  return candidate
}

function resolveCollisions(cells) {
  const resolved = {}
  const occupied = new Set()

  Object.entries(cells).forEach(([iconId, cell]) => {
    const safeCell = findAvailableCell(avoidWidgetZone(clampCell(cell)), occupied)
    resolved[iconId] = safeCell
    occupied.add(cellKey(safeCell))
  })

  return resolved
}

function sanitizeStoredCells(icons) {
  const currentCells = {}
  const updates = {}

  icons.forEach((item, itemIndex) => {
    currentCells[item.id] = loadGridCell(item, itemIndex)
  })

  const resolvedCells = resolveCollisions(currentCells)

  icons.forEach((item) => {
    const current = currentCells[item.id]
    const resolved = resolvedCells[item.id]
    if (resolved && cellKey(current) !== cellKey(resolved)) {
      saveGridCell(item.id, resolved)
      updates[item.id] = resolved
    }
  })

  if (Object.keys(updates).length) {
    window.dispatchEvent(new CustomEvent(iconGridEvent, { detail: updates }))
  }
}

function findIconAtCell(icons, targetCell, currentIconId) {
  return icons.find((item, itemIndex) => {
    if (item.id === currentIconId) return false
    return cellKey(loadGridCell(item, itemIndex)) === cellKey(targetCell)
  })
}

function DesktopIcon({ icon, index, icons, onKernelPanic = () => {} }) {
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

  useEffect(() => {
    let timer
    const handleResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => sanitizeStoredCells(icons), resizeDebounce)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [icons])

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
    const targetCell = avoidWidgetZone(positionToGrid(droppedPosition))
    const updates = { [icon.id]: targetCell }
    const occupant = findIconAtCell(icons, targetCell, icon.id)

    if (occupant) updates[occupant.id] = drag.originCell

    Object.entries(updates).forEach(([iconId, cell]) => saveGridCell(iconId, cell))
    window.dispatchEvent(new CustomEvent(iconGridEvent, { detail: updates }))
  }

  const handleDoubleClick = () => {
    if (icon.action === 'kernelPanic') {
      onKernelPanic()
      return
    }

    if (icon.action === 'link') {
      window.open(icon.url, '_blank', 'noopener,noreferrer')
      return
    }

    openWindow(icon.appId)
  }

  return (
    <button
      type="button"
      className="desktop-icon"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onDoubleClick={handleDoubleClick}
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onDragStart={(event) => event.preventDefault()}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
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
