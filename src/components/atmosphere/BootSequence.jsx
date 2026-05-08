import { useCallback, useEffect, useMemo, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const lineDelay = 260

export function BootSequence() {
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const setBootComplete = useWindowStore((state) => state.setBootComplete)
  const [shownLines, setShownLines] = useState(0)
  const [exiting, setExiting] = useState(false)
  const lines = portfolioData.bootLines
  const { bootFooter, bootSkip, bootTitle } = portfolioData.ui

  const finishBoot = useCallback((delay = 520) => {
    setExiting(true)
    setTimeout(() => setBootComplete(true), delay)
  }, [setBootComplete])

  const progress = useMemo(() => {
    if (!lines.length) return 100
    return Math.min(100, Math.round((shownLines / lines.length) * 100))
  }, [lines.length, shownLines])

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
        <div style={styles.header}>
          <span>{bootTitle}</span>
          <button type="button" style={styles.skip} onClick={() => finishBoot(260)}>
            {bootSkip}
          </button>
        </div>
        <div style={styles.lines} aria-live="polite">
          {lines.slice(0, shownLines).map((line) => (
            <div key={line} style={styles.line}>
              <span style={line.includes('WARN') ? styles.warn : styles.ok}>{'>'}</span> {line}
            </div>
          ))}
          <div style={styles.cursor}>_</div>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
        <div style={styles.footer}>
          {bootFooter}... {progress}%
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
    display: 'grid',
    placeItems: 'center',
    background: '#050806',
    color: '#c8ffd5',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    transition: 'opacity 520ms ease',
  },
  panel: {
    width: 'min(760px, calc(100vw - 32px))',
    minHeight: 420,
    border: '1px solid rgba(91, 255, 140, 0.48)',
    background: 'rgba(2, 14, 8, 0.94)',
    boxShadow: '0 0 60px rgba(54, 255, 112, 0.15), inset 0 0 28px rgba(54, 255, 112, 0.08)',
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#7dff9c',
    borderBottom: '1px solid rgba(125, 255, 156, 0.28)',
    paddingBottom: 12,
    textTransform: 'uppercase',
  },
  skip: {
    border: '1px solid rgba(125, 255, 156, 0.5)',
    background: 'rgba(125, 255, 156, 0.08)',
    color: '#c8ffd5',
    font: 'inherit',
    padding: '6px 10px',
    cursor: 'pointer',
  },
  lines: { height: 288, paddingTop: 18, textAlign: 'left', overflow: 'hidden', fontSize: 15 },
  line: { marginBottom: 7, textShadow: '0 0 10px rgba(125, 255, 156, 0.45)' },
  ok: { color: '#4eff82' },
  warn: { color: '#ffd36a' },
  cursor: { color: '#7dff9c', animation: 'atmosBlink 1s steps(2) infinite' },
  progressTrack: { height: 7, background: 'rgba(125, 255, 156, 0.12)', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#65ff8d', transition: 'width 220ms ease' },
  footer: { marginTop: 10, color: '#7dff9c', fontSize: 13, textAlign: 'right' },
}

export default BootSequence
