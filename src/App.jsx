import DesktopShell from './components/desktop/DesktopShell'
import Window from './components/windows/Window'
import BootSequence from './components/atmosphere/BootSequence'
import {
  AboutWindow,
  ClassifiedWindow,
  ContactWindow,
  ProjectsWindow,
  SkillsWindow,
  Terminal,
  WriteupsWindow,
} from './components/content'
import { useWindowStore } from './store/windowStore'
import './App.css'

const windowComponents = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  writeups: WriteupsWindow,
  terminal: Terminal,
  classified: ClassifiedWindow,
}

function App() {
  const windows = useWindowStore((state) => state.windows)
  const bootComplete = useWindowStore((state) => state.bootComplete)

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
