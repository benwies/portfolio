import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { playKeyClick } from '../../hooks/useSounds'
import { runCommand } from './commandRegistry'

const initialLines = [
  portfolioData.terminal.banner,
  portfolioData.terminal.hint,
]

const displayDir = (cwd) => {
  if (cwd === '/home/benedikt') return '~'
  if (cwd === '/tmp') return '/tmp'
  if (cwd.startsWith('/home/benedikt/')) return `~/${cwd.replace('/home/benedikt/', '')}`
  return cwd
}

export default function Terminal({ initialCommand }) {
  const defaultCwd = '/home/benedikt'
  const initialPrompt = `${portfolioData.identity.user}@${portfolioData.identity.host}:~$`
  const [cwd, setCwd] = useState(defaultCwd)
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [lines, setLines] = useState(() => {
    if (!initialCommand) return initialLines
    const result = runCommand({ command: initialCommand, cwd: defaultCwd, setCwd: () => {} })
    if (!result) return initialLines
    return [`${initialPrompt} ${initialCommand}`, ...(result.lines ?? [])]
  })
  const inputRef = useRef(null)
  const prompt = `${portfolioData.identity.user}@${portfolioData.identity.host}:${displayDir(cwd)}$`

  useEffect(() => {
    inputRef.current?.focus()
  }, [lines])

  const submitCommand = () => {
    const result = runCommand({ command: input, cwd, setCwd })
    if (!result) {
      setInput('')
      return
    }

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
    playKeyClick()
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
        <span className={[
          'terminal-input-wrap',
          input ? '' : 'is-empty',
          isFocused ? 'is-focused' : '',
        ].filter(Boolean).join(' ')}
        >
          <input
            ref={inputRef}
            value={input}
            onBlur={() => setIsFocused(false)}
            onChange={(event) => setInput(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            aria-label={portfolioData.ui.terminalCommandLabel}
            autoComplete="off"
          />
        </span>
      </form>
    </div>
  )
}
