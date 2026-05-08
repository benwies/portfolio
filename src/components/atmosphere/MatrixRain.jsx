import { useEffect, useRef } from 'react'
import { useWindowStore } from '../../store/windowStore'

const glyphs = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&<>[]{}'

export function MatrixRain() {
  const canvasRef = useRef(null)
  const matrixMode = useWindowStore((state) => state.matrixMode)

  useEffect(() => {
    if (!matrixMode || !canvasRef.current) return undefined

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const columns = []
    let animationFrame = 0

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.ceil(window.innerWidth / 16)
      columns.length = count
      for (let index = 0; index < count; index += 1) {
        columns[index] = Math.random() * -window.innerHeight
      }
    }

    const draw = () => {
      context.fillStyle = 'rgba(0, 5, 2, 0.14)'
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)
      context.font = '16px ui-monospace, SFMono-Regular, Consolas, monospace'
      context.fillStyle = '#63ff87'

      columns.forEach((drop, index) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)]
        context.fillText(char, index * 16, drop)
        columns[index] = drop > window.innerHeight + Math.random() * 900 ? 0 : drop + 16
      })

      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [matrixMode])

  if (!matrixMode) return null

  return <canvas ref={canvasRef} aria-hidden="true" style={styles.canvas} />
}

const styles = {
  canvas: {
    position: 'fixed',
    inset: 0,
    zIndex: 120,
    pointerEvents: 'none',
    opacity: 0.42,
    mixBlendMode: 'screen',
  },
}

export default MatrixRain
