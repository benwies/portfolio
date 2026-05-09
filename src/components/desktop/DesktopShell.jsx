import { portfolioData } from '../../data/portfolioData'
import ClockWidget from './ClockWidget'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import TrashIcon from './TrashIcon'
import UptimeWidget from './UptimeWidget'
import VisitorWidget from './VisitorWidget'

function DesktopShell({ children }) {
  return (
    <div className="desktop-shell">
      <main className="desktop-shell__body">
        <nav className="desktop-icons" aria-label="Desktop icons">
          {portfolioData.desktopIcons.map((icon, index) => (
            <DesktopIcon key={icon.id} icon={icon} index={index} />
          ))}
        </nav>

        <div className="widget-stack">
          <ClockWidget />
          <UptimeWidget />
          <VisitorWidget />
        </div>
        <TrashIcon />
        <section className="desktop-windows" aria-label="Open windows">
          {children}
        </section>
      </main>

      <Taskbar />
    </div>
  )
}

export default DesktopShell
