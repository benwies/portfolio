import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'
import { CdeIcon } from './DesktopIcon'

function formatClock(date) {
  return {
    date: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
    }).format(date),
    time: new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    }).format(date),
  }
}

function Taskbar() {
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const requestMinimizeWindow = useWindowStore((state) => state.requestMinimizeWindow)
  const launchers = (portfolioData.frontPanel ?? portfolioData.desktopIcons).filter((item) => item.appId)

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const handleLauncherClick = (appId) => {
    const windowItem = windows.find((item) => item.id === appId)
    if (windowItem?.isOpen && !windowItem.isMinimized && windowItem.isFocused) {
      requestMinimizeWindow(appId)
      return
    }

    openWindow(appId)
  }

  return (
    <footer className="front-panel" aria-label="CDE Front Panel">
      <time className="front-panel__clock" dateTime={`${clock.date} ${clock.time}`} aria-label={portfolioData.ui.clockLabel}>
        <span>{clock.date}</span>
        <strong>{clock.time}</strong>
      </time>

      <nav className="front-panel__launchers" aria-label={portfolioData.ui.launcherLabel}>
        {launchers.map((item) => (
          <button
            type="button"
            key={item.id}
            className="front-panel__launcher"
            onClick={() => handleLauncherClick(item.appId)}
            title={item.label}
          >
            <span className="front-panel__launcher-icon">
              <CdeIcon type={item.icon} label={item.label} />
            </span>
          </button>
        ))}
      </nav>

      <div className="front-panel__workspace" aria-label={portfolioData.ui.workspaceLabel}>
        {['One', 'Two', 'Three', 'Four'].map((space) => (
          <span key={space} className="front-panel__workspace-cell">
            {space}
          </span>
        ))}
      </div>
    </footer>
  )
}

export default Taskbar
