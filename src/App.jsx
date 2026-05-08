import { useEffect } from 'react'
import DesktopShell from './components/desktop/DesktopShell'
import Window from './components/windows/Window'
import BootSequence from './components/atmosphere/BootSequence'
import {
  AboutWindow,
  CertsWindow,
  MOTDWindow,
  NeofetchWindow,
  ProjectsWindow,
  SocialsWindow,
  SkillsWindow,
  Terminal,
} from './components/content'
import { useWindowStore } from './store/windowStore'
import './App.css'

const windowComponents = {
  motd: MOTDWindow,
  neofetch: NeofetchWindow,
  about: AboutWindow,
  socials: SocialsWindow,
  certs: CertsWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  terminal: Terminal,
}

function App() {
  const windows = useWindowStore((state) => state.windows)
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const openWindow = useWindowStore((state) => state.openWindow)

  useEffect(() => {
    if (!bootComplete) return

    const neofetchTimer = window.setTimeout(() => openWindow('neofetch'), 300)
    const motdTimer = window.setTimeout(() => openWindow('motd'), 500)

    return () => {
      window.clearTimeout(neofetchTimer)
      window.clearTimeout(motdTimer)
    }
  }, [bootComplete, openWindow])

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
