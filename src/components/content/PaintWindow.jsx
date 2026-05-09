import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'

const pointFromEvent = (event, canvas) => {
  const source = event.touches?.[0] ?? event
  const rect = canvas.getBoundingClientRect()
  return {
    x: Math.round((source.clientX - rect.left) * (canvas.width / rect.width)),
    y: Math.round((source.clientY - rect.top) * (canvas.height / rect.height)),
  }
}

function drawShape(context, tool, start, end, color, size) {
  context.strokeStyle = color
  context.lineWidth = size
  context.lineCap = 'square'
  if (tool === 'line') {
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
  }
  if (tool === 'rectangle') {
    context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
  }
  if (tool === 'circle') {
    const radius = Math.hypot(end.x - start.x, end.y - start.y)
    context.beginPath()
    context.arc(start.x, start.y, radius, 0, Math.PI * 2)
    context.stroke()
  }
}

function colorsMatch(data, index, target) {
  return data[index] === target[0] && data[index + 1] === target[1] && data[index + 2] === target[2] && data[index + 3] === target[3]
}

function hexToRgba(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 255]
}

function floodFill(canvas, point, color) {
  const context = canvas.getContext('2d')
  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  const fill = hexToRgba(color)
  const startIndex = (point.y * canvas.width + point.x) * 4
  const target = image.data.slice(startIndex, startIndex + 4)
  if (colorsMatch(fill, 0, target)) return

  const stack = [point]
  while (stack.length) {
    const next = stack.pop()
    if (next.x < 0 || next.y < 0 || next.x >= canvas.width || next.y >= canvas.height) continue
    const index = (next.y * canvas.width + next.x) * 4
    if (!colorsMatch(image.data, index, target)) continue
    image.data.set(fill, index)
    stack.push({ x: next.x + 1, y: next.y }, { x: next.x - 1, y: next.y }, { x: next.x, y: next.y + 1 }, { x: next.x, y: next.y - 1 })
  }
  context.putImageData(image, 0, 0)
}

function PaintWindow() {
  const canvasRef = useRef(null)
  const snapshotRef = useRef(null)
  const startRef = useRef(null)
  const [tool, setTool] = useState('pencil')
  const [color, setColor] = useState(portfolioData.paint.colors[0])
  const [size, setSize] = useState(portfolioData.paint.sizes[0].value)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const beginDraw = (event) => {
    event.preventDefault()
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = pointFromEvent(event, canvas)
    if (tool === 'fill') {
      floodFill(canvas, point, color)
      return
    }
    startRef.current = point
    snapshotRef.current = context.getImageData(0, 0, canvas.width, canvas.height)
    setDrawing(true)
    if (tool === 'pencil' || tool === 'eraser') {
      context.beginPath()
      context.moveTo(point.x, point.y)
    }
  }

  const moveDraw = (event) => {
    if (!drawing) return
    event.preventDefault()
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = pointFromEvent(event, canvas)
    const activeColor = tool === 'eraser' ? '#ffffff' : color

    if (tool === 'pencil' || tool === 'eraser') {
      context.strokeStyle = activeColor
      context.lineWidth = size
      context.lineCap = 'round'
      context.lineTo(point.x, point.y)
      context.stroke()
      return
    }

    context.putImageData(snapshotRef.current, 0, 0)
    drawShape(context, tool, startRef.current, point, activeColor, size)
  }

  const endDraw = () => setDrawing(false)

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <section className="paint-window">
      <div className="paint-toolbar">
        <div className="paint-tools">
          {portfolioData.paint.tools.map((item) => (
            <button key={item.id} type="button" className={tool === item.id ? 'is-active' : ''} onClick={() => setTool(item.id)} title={item.label}>
              {item.label.slice(0, 1)}
            </button>
          ))}
          {portfolioData.paint.sizes.map((item) => (
            <button key={item.id} type="button" className={size === item.value ? 'is-active' : ''} onClick={() => setSize(item.value)}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={clear}>{portfolioData.paint.clearLabel}</button>
        </div>
        <div className="paint-colors">
          {portfolioData.paint.colors.map((item) => (
            <button key={item} type="button" className={color === item ? 'is-active' : ''} style={{ background: item }} onClick={() => setColor(item)} aria-label={item} />
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width="900"
        height="650"
        onMouseDown={beginDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={beginDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
      />
    </section>
  )
}

export default PaintWindow
