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
    const neofetchTimer = window.setTimeout(() => openWindow({
      id: 'neofetch',
      position: {
        x: Math.round(viewportWidth * 0.52),
        y: Math.round(viewportHeight * 0.13),
      },
      size: { width: 430, height: 310 },
      zIndex: 1,
    }), 300)
    const motdTimer = window.setTimeout(() => openWindow({
      id: 'motd',
      position: {
        x: Math.round(viewportWidth * 0.3),
        y: Math.round(viewportHeight * 0.37),
      },
      size: { width: 370, height: 340 },
      zIndex: 2,
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
