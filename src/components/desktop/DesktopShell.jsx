import { useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import ClockWidget from './ClockWidget'
import DesktopIcon from './DesktopIcon'
import KernelPanicOverlay from './KernelPanicOverlay'
import Taskbar from './Taskbar'
import TrashIcon from './TrashIcon'
import UptimeWidget from './UptimeWidget'
import VisitorWidget from './VisitorWidget'

function DesktopShell({ children }) {
  const [kernelPanic, setKernelPanic] = useState(false)

  return (
    <div className="desktop-shell">
      <main className="desktop-shell__body">
        <nav className="desktop-icons" aria-label="Desktop icons">
          {portfolioData.desktopIcons.map((icon, index) => (
            <DesktopIcon
              key={icon.id}
              icon={icon}
              index={index}
              icons={portfolioData.desktopIcons}
              onKernelPanic={() => setKernelPanic(true)}
            />
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
      {kernelPanic && <KernelPanicOverlay onDismiss={() => setKernelPanic(false)} />}
    </div>
  )
}

export default DesktopShell
