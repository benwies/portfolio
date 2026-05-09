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
  const windows = useWindowStore((state) => state.windows)
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!bootComplete || isMobile) return

    const neofetchTimer = window.setTimeout(() => openWindow('neofetch'), 300)
    const motdTimer = window.setTimeout(() => openWindow('motd'), 500)

    return () => {
      window.clearTimeout(neofetchTimer)
      window.clearTimeout(motdTimer)
    }
  }, [bootComplete, isMobile, openWindow])

  if (isMobile) return <MobileView />

  return (
    <main className="workstation">
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
      {!bootComplete && <BootSequence />}
    </main>
  )
}

export default App
