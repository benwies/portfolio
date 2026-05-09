import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const directions = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
}

const initialSnake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }]
const initialFood = { x: 14, y: 10 }

function SnakeWindow() {
  const canvasRef = useRef(null)
  const shellRef = useRef(null)
  const directionRef = useRef({ x: 1, y: 0 })
  const nextDirectionRef = useRef({ x: 1, y: 0 })
  const [snake, setSnake] = useState(initialSnake)
  const [food, setFood] = useState(initialFood)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const isFocused = useWindowStore((state) =>
    state.windows.find((windowItem) => windowItem.id === 'snake')?.isFocused,
  )
  const { cellSize, boardSize } = portfolioData.snake
  const cells = boardSize / cellSize

  useEffect(() => {
    shellRef.current?.focus()
  }, [])

  const reset = () => {
    directionRef.current = { x: 1, y: 0 }
    nextDirectionRef.current = { x: 1, y: 0 }
    setSnake(initialSnake)
    setFood(initialFood)
    setScore(0)
    setGameOver(false)
  }

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    context.fillStyle = '#000000'
    context.fillRect(0, 0, boardSize, boardSize)
    context.fillStyle = '#00ff00'
    snake.forEach((part) => context.fillRect(part.x * cellSize, part.y * cellSize, cellSize - 1, cellSize - 1))
    context.fillStyle = '#ff4444'
    context.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1)
    if (gameOver) {
      context.fillStyle = '#00ff00'
      context.font = '16px Courier New'
      context.fillText(portfolioData.snake.gameOver, 25, 205)
    }
  }, [boardSize, cellSize, food, gameOver, snake])

  useEffect(() => {
    if (!isFocused || gameOver) return undefined
    const speed = Math.max(70, 160 - Math.floor(score / 5) * 18)
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const nextDirection = nextDirectionRef.current
        if (nextDirection.x !== -directionRef.current.x || nextDirection.y !== -directionRef.current.y) {
          directionRef.current = nextDirection
        }

        const head = current[0]
        const nextHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        }
        const hitWall = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= cells || nextHead.y >= cells
        const hitSelf = current.some((part) => part.x === nextHead.x && part.y === nextHead.y)
        if (hitWall || hitSelf) {
          setGameOver(true)
          return current
        }

        const ate = nextHead.x === food.x && nextHead.y === food.y
        const nextSnake = [nextHead, ...current]
        if (!ate) nextSnake.pop()
        if (ate) {
          setScore((value) => value + 1)
          setFood(() => {
            let nextFood = initialFood
            do {
              nextFood = {
                x: Math.floor(Math.random() * cells),
                y: Math.floor(Math.random() * cells),
              }
            } while (nextSnake.some((part) => part.x === nextFood.x && part.y === nextFood.y))
            return nextFood
          })
        }
        return nextSnake
      })
    }, speed)
    return () => window.clearInterval(timer)
  }, [cells, food.x, food.y, gameOver, isFocused, score])

  const handleKeyDown = (event) => {
    if (directions[event.key]) {
      event.preventDefault()
      nextDirectionRef.current = directions[event.key]
    }
    if (event.key === 'Enter' && gameOver) {
      event.preventDefault()
      reset()
    }
  }

  return (
    <section ref={shellRef} className="snake-window" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="snake-score">
        {portfolioData.snake.scoreLabel} {String(score).padStart(3, '0')}
      </div>
      <canvas ref={canvasRef} width={boardSize} height={boardSize} />
    </section>
  )
}

export default SnakeWindow
