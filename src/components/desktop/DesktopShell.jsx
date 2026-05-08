import { portfolioData } from '../../data/portfolioData'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'

function DesktopShell({ children }) {
  return (
    <div className="desktop-shell" style={{ gridTemplateRows: 'minmax(0, 1fr) 52px' }}>
      <main className="desktop-shell__body">
        <nav
          className="desktop-icons"
          style={{ gridAutoRows: 90, width: 90 }}
          aria-label="Desktop icons"
        >
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
