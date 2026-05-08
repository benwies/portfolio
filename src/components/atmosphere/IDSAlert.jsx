import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useWindowStore } from '../../store/windowStore'
import { portfolioData } from '../../data/portfolioData'

export function IDSAlert() {
  const alerts = useWindowStore((state) => state.activeAlerts)
  const dismissAlert = useWindowStore((state) => state.dismissAlert)
  const pushAlert = useWindowStore((state) => state.pushAlert)
  const { idsAlertLevel, idsAlertMessage, idsAlertTitle } = portfolioData.ui

  useEffect(() => {
    const timers = alerts.map((alert) =>
      setTimeout(() => dismissAlert(alert.id), alert.timeout ?? 6500),
    )
    return () => timers.forEach(clearTimeout)
  }, [alerts, dismissAlert])

  useEffect(() => {
    const timer = setInterval(() => {
      pushAlert({
        level: idsAlertLevel,
        title: idsAlertTitle,
        message: idsAlertMessage,
      })
    }, 150000)

    return () => clearInterval(timer)
  }, [idsAlertLevel, idsAlertMessage, idsAlertTitle, pushAlert])

  if (!alerts.length) return null

  return (
    <div style={styles.stack} aria-live="polite" aria-label="IDS alerts">
      {alerts.map((alert) => (
        <article key={alert.id} style={styles.toast}>
          <div style={styles.header}>
            <strong style={styles.level}>{alert.level ?? idsAlertLevel}</strong>
            <button
              type="button"
              aria-label="Dismiss alert"
              style={styles.close}
              onClick={() => dismissAlert(alert.id)}
            >
              <X size={15} />
            </button>
          </div>
          <div style={styles.title}>{alert.title ?? idsAlertTitle}</div>
          {alert.message && <p style={styles.message}>{alert.message}</p>}
        </article>
      ))}
    </div>
  )
}

const styles = {
  stack: {
    position: 'fixed',
    right: 18,
    top: 18,
    zIndex: 800,
    display: 'grid',
    gap: 10,
    width: 'min(360px, calc(100vw - 36px))',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
  },
  toast: {
    border: '1px solid rgba(255, 97, 97, 0.55)',
    background: 'rgba(25, 3, 4, 0.92)',
    color: '#ffe4e4',
    boxShadow: '0 14px 40px rgba(0, 0, 0, 0.32), inset 0 0 18px rgba(255, 97, 97, 0.08)',
    padding: 12,
    textAlign: 'left',
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  level: { color: '#ff6b6b', fontSize: 12, letterSpacing: 0, textTransform: 'uppercase' },
  close: {
    display: 'grid',
    placeItems: 'center',
    width: 26,
    height: 26,
    border: '1px solid rgba(255, 228, 228, 0.22)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#ffe4e4',
    cursor: 'pointer',
  },
  title: { marginTop: 8, color: '#fff', fontSize: 14 },
  message: { marginTop: 4, color: '#ffc1c1', fontSize: 13, lineHeight: 1.35 },
}

export default IDSAlert
