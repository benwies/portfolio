import { useMemo } from 'react'
import { portfolioData } from '../../data/portfolioData'

export function LogTicker() {
  const entries = useMemo(() => [...portfolioData.ticker, ...portfolioData.ticker], [])

  return (
    <div style={styles.wrap} aria-label="security log ticker">
      <style>{keyframes}</style>
      <div style={styles.track}>
        {entries.map((entry, index) => (
          <span key={`${entry}-${index}`} style={styles.entry}>
            {entry}
          </span>
        ))}
      </div>
    </div>
  )
}

const keyframes = `
@keyframes atmosTicker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`

const styles = {
  wrap: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 650,
    overflow: 'hidden',
    borderTop: '1px solid rgba(82, 255, 132, 0.32)',
    background: 'rgba(2, 10, 6, 0.88)',
    color: '#aaffbd',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  track: {
    display: 'inline-flex',
    minWidth: '200%',
    animation: 'atmosTicker 28s linear infinite',
  },
  entry: {
    padding: '7px 22px',
    textShadow: '0 0 8px rgba(82, 255, 132, 0.45)',
  },
}

export default LogTicker
