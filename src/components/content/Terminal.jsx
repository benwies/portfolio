import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { runCommand } from './commandRegistry'

const initialLines = [
  portfolioData.terminal.banner,
  portfolioData.terminal.hint,
]

export default function Terminal() {
  const [cwd, setCwd] = useState('/home/benedikt')
  const [input, setInput] = useState('')
  const [lines, setLines] = useState(initialLines)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [lines])

  const prompt = `${portfolioData.identity.user}@${portfolioData.identity.host}:${cwd.replace('/home/benedikt', '~')}$`

  const submitCommand = () => {
    const result = runCommand({ command: input, cwd, setCwd })
    if (result.clear) {
      setLines([])
    } else {
      setLines((current) => [...current, `${prompt} ${input}`, ...(result.lines ?? [])])
    }
    setInput('')
  }

  const submit = (event) => {
    event.preventDefault()
    submitCommand()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitCommand()
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-lines">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} className="terminal-line">
            {line}
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={submit}>
        <span>{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={portfolioData.ui.terminalCommandLabel}
          autoComplete="off"
        />
      </form>
    </div>
  )
}
