import { useEffect, useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import { portfolioData } from '../../data/portfolioData'

function formatClock(date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function StartFlag() {
  return (
    <span className="start-flag" aria-hidden="true">
      <span className="flag-red" />
      <span className="flag-green" />
      <span className="flag-blue" />
      <span className="flag-yellow" />
    </span>
  )
}

function Taskbar() {
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const focusWindow = useWindowStore((state) => state.focusWindow)
  const openWindows = windows.filter((windowItem) => windowItem.isOpen)
  const { menuLabel } = portfolioData.ui

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer className="taskbar" aria-label="Desktop taskbar">
      <button
        type="button"
        className="taskbar__menu"
        onClick={() => openWindow('terminal')}
      >
        <StartFlag />
        {menuLabel}
      </button>

      <nav className="taskbar__windows" aria-label="Open windows">
        {openWindows.map((windowItem) => (
          <button
            type="button"
            key={windowItem.id}
            className={[
              'taskbar__window',
              windowItem.isFocused ? 'taskbar__window--focused' : '',
              windowItem.isMinimized ? 'taskbar__window--minimized' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => focusWindow(windowItem.id)}
          >
            {windowItem.title}
          </button>
        ))}
      </nav>

      <time className="taskbar__tray" dateTime={clock}>
        {clock}
      </time>
    </footer>
  )
}

export default Taskbar
