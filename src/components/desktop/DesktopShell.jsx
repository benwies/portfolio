import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'

function formatClock(date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function DesktopShell({ children }) {
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const registerIdsClick = useWindowStore((state) => state.registerIdsClick)
  const { user, host } = portfolioData.identity
  const { idsStatus } = portfolioData.ui

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="desktop-shell">
      <header className="desktop-topbar">
        <div className="desktop-topbar__session">
          [{user}@{host}]
        </div>
        <button
          type="button"
          className="desktop-topbar__ids"
          onClick={registerIdsClick}
          aria-label="IDS status"
        >
          {idsStatus}
        </button>
        <time className="desktop-topbar__clock" dateTime={clock}>
          {clock}
        </time>
      </header>

      <main className="desktop-shell__body">
        <nav className="desktop-icons" aria-label="Desktop icons">
          {portfolioData.desktopIcons.map((icon) => (
            <DesktopIcon key={icon.id} icon={icon} />
          ))}
        </nav>

        <section className="desktop-windows" aria-label="Open windows">
          {children}
        </section>
      </main>

      <Taskbar />
    </div>
  )
}

export default DesktopShell
