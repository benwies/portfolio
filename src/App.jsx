import { useEffect, useState } from 'react'
import DesktopShell from './components/desktop/DesktopShell'
import Window from './components/windows/Window'
import BootSequence from './components/atmosphere/BootSequence'
import MobileView from './components/mobile/MobileView'
import {
  AboutWindow,
  CertsWindow,
  MOTDWindow,
  NeofetchWindow,
  PaintWindow,
  ProjectsWindow,
  SocialsWindow,
  SkillsWindow,
  SnakeWindow,
  Terminal,
  TrashWindow,
  WorkstationAboutWindow,
} from './components/content'
import { useWindowStore } from './store/windowStore'
import './App.css'

const windowComponents = {
  motd: MOTDWindow,
  neofetch: NeofetchWindow,
  snake: SnakeWindow,
  paint: PaintWindow,
  about: AboutWindow,
  socials: SocialsWindow,
  certs: CertsWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  terminal: Terminal,
  trash: TrashWindow,
  workstationAbout: WorkstationAboutWindow,
}

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const windows = useWindowStore((state) => state.windows)
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setWarningDismissed(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!bootComplete || isMobile) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const taskbarHeight = 52
    const usableHeight = viewportHeight - taskbarHeight
    const neofetchTimer = window.setTimeout(() => openWindow({
      id: 'neofetch',
      position: {
        x: Math.round(viewportWidth * 0.52),
        y: Math.round(usableHeight * 0.13),
      },
      size: {
        w: Math.max(Math.round(viewportWidth * 0.28), 340),
        h: Math.max(Math.round(usableHeight * 0.4), 260),
      },
      zIndex: 10,
    }), 300)
    const motdTimer = window.setTimeout(() => openWindow({
      id: 'motd',
      position: {
        x: Math.round(viewportWidth * 0.3),
        y: Math.round(usableHeight * 0.37),
      },
      size: {
        w: Math.max(Math.round(viewportWidth * 0.24), 320),
        h: Math.max(Math.round(usableHeight * 0.42), 300),
      },
      zIndex: 20,
    }), 500)

    return () => {
      window.clearTimeout(neofetchTimer)
      window.clearTimeout(motdTimer)
    }
  }, [bootComplete, isMobile, openWindow])

  if (isMobile) {
    return (
      <MobileView
        showWarning={!warningDismissed}
        onContinueWarning={() => setWarningDismissed(true)}
      />
    )
  }

  return (
    <main className="workstation">
      {!bootComplete ? (
        <BootSequence />
      ) : (
        <DesktopShell>
          {windows
            .filter((windowItem) => windowItem.isOpen && !windowItem.isMinimized)
            .map((windowItem) => {
              const Content = windowComponents[windowItem.component]
              return (
                <Window key={windowItem.id} windowItem={windowItem}>
                  {Content ? <Content /> : null}
                </Window>
              )
            })}
        </DesktopShell>
      )}
    </main>
  )
}

export default App
