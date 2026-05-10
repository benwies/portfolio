import { useEffect, useRef } from 'react'

const cellWidth = 12
const cellHeight = 16
const frameDelay = 80
const maxPipes = 8
const directions = ['up', 'down', 'left', 'right']
const colors = ['#00FF00', '#00FFFF', '#FF00FF', '#FFFF00', '#FF6600', '#00FF88']
const pipeChars = {
  horizontal: '─',
  vertical: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  cross: '┼',
}

const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

function perpendicular(direction) {
  return ['up', 'down'].includes(direction) ? randomItem(['left', 'right']) : randomItem(['up', 'down'])
}

function cornerFor(from, to) {
  if ((from === 'right' && to === 'down') || (from === 'up' && to === 'left')) return pipeChars.topLeft
  if ((from === 'left' && to === 'down') || (from === 'up' && to === 'right')) return pipeChars.topRight
  if ((from === 'right' && to === 'up') || (from === 'down' && to === 'left')) return pipeChars.bottomLeft
  if ((from === 'left' && to === 'up') || (from === 'down' && to === 'right')) return pipeChars.bottomRight
  return pipeChars.cross
}

function charFor(direction) {
  return ['left', 'right'].includes(direction) ? pipeChars.horizontal : pipeChars.vertical
}

function createPipe(cols, rows) {
  return {
    color: randomItem(colors),
    direction: randomItem(directions),
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  }
}

function move(pipe, cols, rows) {
  const next = { ...pipe }
  if (next.direction === 'up') next.y -= 1
  if (next.direction === 'down') next.y += 1
  if (next.direction === 'left') next.x -= 1
  if (next.direction === 'right') next.x += 1
  next.x = (next.x + cols) % cols
  next.y = (next.y + rows) % rows
  return next
}

function ScreensaverOverlay({ onDeactivate }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let cols = 0
    let rows = 0
    let pipes = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.ceil(canvas.width / cellWidth)
      rows = Math.ceil(canvas.height / cellHeight)
      context.fillStyle = '#000000'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.font = `${cellHeight}px monospace`
      context.textBaseline = 'top'
      pipes = Array.from({ length: 3 }, () => createPipe(cols, rows))
    }

    const draw = () => {
      if (pipes.length < maxPipes && Math.random() < 0.08) {
        pipes.push(createPipe(cols, rows))
      }

      pipes = pipes.map((pipe) => {
        const shouldTurn = Math.random() < 0.15
        const nextDirection = shouldTurn ? perpendicular(pipe.direction) : pipe.direction
        const char = shouldTurn ? cornerFor(pipe.direction, nextDirection) : charFor(pipe.direction)
        const nextPipe = move({ ...pipe, direction: nextDirection }, cols, rows)

        context.fillStyle = pipe.color
        context.fillText(char, nextPipe.x * cellWidth, nextPipe.y * cellHeight)
        return nextPipe
      })
    }

    resize()
    const timer = window.setInterval(draw, frameDelay)
    window.addEventListener('resize', resize)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      className="screensaver-overlay"
      onClick={onDeactivate}
      onKeyDown={onDeactivate}
      onMouseDown={onDeactivate}
      onTouchStart={onDeactivate}
      tabIndex={0}
      role="presentation"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}

export default ScreensaverOverlay
