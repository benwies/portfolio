import { useEffect, useRef, useState } from 'react'

const buttons = [
  ['C', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
]

const operators = ['+', '-', '*', '/']

function trimDisplay(value) {
  if (value === 'ERROR') return value
  const text = String(value)
  return text.length > 12 ? text.slice(0, 12) : text
}

function calculate(a, b, op) {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b === 0 ? 'ERROR' : a / b
    default:
      return b
  }
}

function CalcWindow() {
  const calcRef = useRef(null)
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  useEffect(() => {
    calcRef.current?.focus()
  }, [])

  const commitDisplay = (value) => setDisplay(trimDisplay(value))

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const handleNumber = (num) => {
    if (display === 'ERROR') {
      setDisplay(String(num))
      setWaitingForOperand(false)
      return
    }

    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      commitDisplay(display === '0' ? String(num) : `${display}${num}`)
    }
  }

  const handleOperator = (op) => {
    if (display === 'ERROR') return
    const current = Number.parseFloat(display)

    if (prevValue !== null && !waitingForOperand) {
      const result = calculate(prevValue, current, operator)
      if (result === 'ERROR') {
        setDisplay('ERROR')
        setPrevValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }
      const rounded = Number.parseFloat(result.toFixed(10))
      commitDisplay(String(rounded))
      setPrevValue(rounded)
    } else {
      setPrevValue(current)
    }

    setOperator(op)
    setWaitingForOperand(true)
  }

  const handleEquals = () => {
    if (!operator || prevValue === null || display === 'ERROR') return
    const result = calculate(prevValue, Number.parseFloat(display), operator)
    commitDisplay(result === 'ERROR' ? 'ERROR' : String(Number.parseFloat(result.toFixed(10))))
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handlePlusMinus = () => {
    if (display === 'ERROR' || display === '0') return
    commitDisplay(String(Number.parseFloat(display) * -1))
  }

  const handlePercent = () => {
    if (display === 'ERROR') return
    commitDisplay(String(Number.parseFloat(display) / 100))
  }

  const handleDecimal = () => {
    if (display === 'ERROR' || waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) commitDisplay(`${display}.`)
  }

  const handleBackspace = () => {
    if (display === 'ERROR' || waitingForOperand) {
      setDisplay('0')
      setWaitingForOperand(false)
      return
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const handleButton = (label) => {
    if (/^\d$/.test(label)) handleNumber(label)
    else if (operators.includes(label)) handleOperator(label)
    else if (label === '=') handleEquals()
    else if (label === 'C') handleClear()
    else if (label === '+/-') handlePlusMinus()
    else if (label === '%') handlePercent()
    else if (label === '.') handleDecimal()
  }

  const handleKeyDown = (event) => {
    const { key } = event
    if (/^\d$/.test(key)) {
      event.preventDefault()
      handleNumber(key)
    } else if (operators.includes(key)) {
      event.preventDefault()
      handleOperator(key)
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault()
      handleEquals()
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
      event.preventDefault()
      handleClear()
    } else if (key === 'Backspace') {
      event.preventDefault()
      handleBackspace()
    } else if (key === '.') {
      event.preventDefault()
      handleDecimal()
    }
  }

  return (
    <section
      className="calc-window"
      onKeyDown={handleKeyDown}
      onMouseDown={() => calcRef.current?.focus()}
      ref={calcRef}
      tabIndex={0}
    >
      <div className="calc-display" aria-live="polite">{display}</div>
      <div className="calc-grid">
        {buttons.flat().map((label) => (
          <button
            key={label}
            type="button"
            className={[
              'calc-btn',
              operators.includes(label) ? 'calc-btn-operator' : '',
              label === '=' ? 'calc-btn-equals' : '',
              label === 'C' ? 'calc-btn-clear' : '',
              label === '0' ? 'calc-btn-zero' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleButton(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default CalcWindow
