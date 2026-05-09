import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore, WORKSPACES } from '../../store/windowStore'
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
  const activeWorkspace = useWindowStore((state) => state.activeWorkspace)
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const requestMinimizeWindow = useWindowStore((state) => state.requestMinimizeWindow)
  const switchWorkspace = useWindowStore((state) => state.switchWorkspace)
  const visibleInTaskbar = windows.filter(
    (windowItem) => windowItem.workspace === activeWorkspace && windowItem.isOpen,
  )

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const handleWindowButtonClick = (appId) => {
    const windowItem = windows.find((item) => item.id === appId)
    if (windowItem?.isOpen && !windowItem.isMinimized && windowItem.isFocused) {
      requestMinimizeWindow(appId)
      return
    }

    openWindow(appId)
  }

  const iconForWindow = (windowItem) => {
    if (windowItem.id === 'neofetch') return 'terminal'
    if (windowItem.id === 'motd') return 'welcome'
    return portfolioData.desktopIcons.find((item) => item.appId === windowItem.id)?.icon ?? 'text'
  }

  return (
    <footer className="front-panel" aria-label="CDE Front Panel">
      <time className="front-panel__clock" dateTime={`${clock.date} ${clock.time}`} aria-label={portfolioData.ui.clockLabel}>
        <span>{clock.date}</span>
        <strong>{clock.time}</strong>
      </time>

      <nav className="front-panel__launchers" aria-label={portfolioData.ui.launcherLabel}>
        {visibleInTaskbar.map((windowItem) => (
          <button
            type="button"
            key={windowItem.id}
            className={windowItem.isFocused ? 'front-panel__launcher is-active' : 'front-panel__launcher'}
            onClick={() => handleWindowButtonClick(windowItem.id)}
            title={windowItem.title}
          >
            <span className="front-panel__launcher-icon">
              <CdeIcon type={iconForWindow(windowItem)} label={windowItem.title} />
            </span>
          </button>
        ))}
      </nav>

      <div className="front-panel__workspace" aria-label={portfolioData.ui.workspaceLabel}>
        {Object.entries(WORKSPACES).map(([number, workspace]) => (
          <button
            key={workspace.name}
            type="button"
            className={activeWorkspace === Number(number)
              ? 'front-panel__workspace-cell is-active'
              : 'front-panel__workspace-cell'}
            onClick={() => switchWorkspace(Number(number))}
          >
            {workspace.label}
          </button>
        ))}
      </div>
    </footer>
  )
}

export default Taskbar
