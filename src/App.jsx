import { useEffect, useState } from 'react'
import DesktopShell from './components/desktop/DesktopShell'
import Window from './components/windows/Window'
import BootSequence from './components/atmosphere/BootSequence'
import MobileView from './components/mobile/MobileView'
import {
  AboutWindow,
  CalcWindow,
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
  calculator: CalcWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  terminal: Terminal,
  trash: TrashWindow,
  workstationAbout: WorkstationAboutWindow,
}

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [warningDismissed, setWarningDismissed] = useState(
    () => sessionStorage.getItem('mobile_warning_dismissed') === 'true',
  )
  const windows = useWindowStore((state) => state.windows)
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleWarningDismiss = () => {
    sessionStorage.setItem('mobile_warning_dismissed', 'true')
    setWarningDismissed(true)
  }

  useEffect(() => {
    if (!bootComplete || isMobile) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const neofetchWidth = Math.min(
      Math.max(380, Math.round(viewportWidth * 0.3)),
      Math.min(500, viewportWidth - 40),
    )
    const motdWidth = Math.min(
      Math.max(380, Math.round(viewportWidth * 0.35)),
      Math.min(480, Math.round(viewportWidth * 0.6), viewportWidth - 40),
    )
    const neofetchX = Math.max(
      20,
      Math.min(Math.round(viewportWidth * 0.52), viewportWidth - neofetchWidth - 20),
    )
    const motdX = Math.max(
      20,
      Math.min(Math.round(viewportWidth * 0.3), viewportWidth - motdWidth - 20),
    )
    const neofetchTimer = window.setTimeout(() => openWindow({
      id: 'neofetch',
      position: {
        x: neofetchX,
        y: Math.round(viewportHeight * 0.13),
      },
      size: { w: neofetchWidth, h: 310 },
      zIndex: 10,
    }), 300)
    const motdTimer = window.setTimeout(() => openWindow({
      id: 'motd',
      position: {
        x: motdX,
        y: Math.round(viewportHeight * 0.37),
      },
      size: { w: motdWidth, h: 340 },
      zIndex: 20,
    }), 500)

    return () => {
      window.clearTimeout(neofetchTimer)
      window.clearTimeout(motdTimer)
    }
  }, [bootComplete, isMobile, openWindow])

  if (isMobile) {
    if (!bootComplete) return <BootSequence />

    return (
      <MobileView
        showWarning={!warningDismissed}
        onContinueWarning={handleWarningDismiss}
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
