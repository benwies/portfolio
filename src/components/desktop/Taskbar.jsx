import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'
import { CdeIcon } from './DesktopIcon'

function formatClock(date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function Taskbar() {
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const openWindow = useWindowStore((state) => state.openWindow)
  const launchers = portfolioData.frontPanel ?? portfolioData.desktopIcons

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer className="front-panel" aria-label="CDE Front Panel">
      <time className="front-panel__clock" dateTime={clock} aria-label={portfolioData.ui.clockLabel}>
        {clock}
      </time>

      <nav className="front-panel__launchers" aria-label={portfolioData.ui.launcherLabel}>
        {launchers.map((item) => (
          <button
            type="button"
            key={item.id}
            className="front-panel__launcher"
            onClick={() => openWindow(item.appId)}
            title={item.label}
          >
            <span className="front-panel__launcher-icon">
              <CdeIcon type={item.icon} />
            </span>
          </button>
        ))}
      </nav>

      <div className="front-panel__workspace" aria-label={portfolioData.ui.workspaceLabel}>
        {[0, 1, 2, 3].map((space) => (
          <span key={space} className="front-panel__workspace-cell" />
        ))}
      </div>
    </footer>
  )
}

export default Taskbar
