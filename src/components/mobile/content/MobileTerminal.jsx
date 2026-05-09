import { useRef, useState } from 'react'
import { portfolioData } from '../../../data/portfolioData'
import { readFile } from '../../content/fileSystem'

function runMobileCommand(command) {
  const trimmed = command.trim()
  const [base, ...args] = trimmed.split(/\s+/)

  if (!trimmed) return []
  if (base === 'whoami') return [portfolioData.identity.user]
  if (base === 'ls') return portfolioData.terminal.files
  if (base === 'help') return portfolioData.mobile.terminal.commands
  if (base === 'cat' && args[0] === 'about.txt') return readFile(args[0])
  if (base === 'ping' && args[0] === portfolioData.mobile.terminal.pingTarget) {
    return portfolioData.mobile.terminal.pingLines
  }
  return [`${base}: command not found`]
}

function MobileTerminal() {
  const [lines, setLines] = useState([portfolioData.terminal.banner, portfolioData.terminal.hint])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const submit = (event) => {
    event.preventDefault()
    const command = input
    setInput('')
    if (command.trim() === 'clear') {
      setLines([])
      return
    }
    setLines((current) => [
      ...current,
      `${portfolioData.mobile.terminal.prompt} ${command}`,
      ...runMobileCommand(command),
    ])
  }

  return (
    <section className="mobile-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="mobile-terminal__output">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
      <form className="mobile-terminal__form" onSubmit={submit}>
        <span>{portfolioData.mobile.terminal.prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-label={portfolioData.ui.terminalCommandLabel}
          autoComplete="off"
        />
      </form>
    </section>
  )
}

export default MobileTerminal
