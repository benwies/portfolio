import { useCallback, useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const lineDelay = 260

export function BootSequence() {
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const setBootComplete = useWindowStore((state) => state.setBootComplete)
  const [shownLines, setShownLines] = useState(0)
  const [exiting, setExiting] = useState(false)
  const lines = portfolioData.bootLines
  const { bootSkip } = portfolioData.ui

  const finishBoot = useCallback((delay = 520) => {
    setExiting(true)
    setTimeout(() => setBootComplete(true), delay)
  }, [setBootComplete])

  useEffect(() => {
    if (bootComplete || exiting) return undefined
    if (shownLines >= lines.length) {
      const doneTimer = setTimeout(() => finishBoot(), 420)
      return () => clearTimeout(doneTimer)
    }

    const timer = setTimeout(() => setShownLines((count) => count + 1), lineDelay)
    return () => clearTimeout(timer)
  }, [bootComplete, exiting, finishBoot, lines.length, shownLines])

  useEffect(() => {
    if (bootComplete) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        finishBoot(260)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bootComplete, finishBoot])

  if (bootComplete) return null

  return (
    <div style={{ ...styles.shell, opacity: exiting ? 0 : 1 }}>
      <div style={styles.panel}>
        <div>
          <span>BIOS POST</span>
          <button type="button" style={styles.skip} onClick={() => finishBoot(260)}>
            {bootSkip}
          </button>
        </div>
        <div style={styles.lines} aria-live="polite">
          {lines.slice(0, shownLines).map((line) => (
            <div key={line} style={styles.line}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  shell: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: '#000000',
    color: '#ffffff',
    fontFamily: '"Courier New", monospace',
    transition: 'opacity 260ms ease',
  },
  panel: {
    padding: 18,
  },
  skip: {
    marginLeft: 16,
    border: '1px solid #ffffff',
    background: '#000000',
    color: '#ffffff',
    font: 'inherit',
    padding: '2px 8px',
    cursor: 'pointer',
  },
  lines: { paddingTop: 18, textAlign: 'left', overflow: 'hidden', fontSize: 14 },
  line: { marginBottom: 5 },
}

export default BootSequence
