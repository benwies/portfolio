import { useEffect, useState } from 'react'
import CRTBezel from './components/desktop/CRTBezel'
import DesktopShell from './components/desktop/DesktopShell'
import Window from './components/windows/Window'
import BootSequence from './components/atmosphere/BootSequence'
import MobileView from './components/mobile/MobileView'
import {
  playMouseClick,
  startAmbientNoise,
  stopAmbientNoise,
  unlockAudio,
} from './hooks/useSounds'
import { isAmbientEnabled } from './store/soundStore'
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
  const [audioUnlocked, setAudioUnlocked] = useState(() => (
    window.innerWidth < 768 || sessionStorage.getItem('audio_unlocked') === 'true'
  ))
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

  const handleAudioUnlock = () => {
    unlockAudio()
    sessionStorage.setItem('audio_unlocked', 'true')
    setAudioUnlocked(true)
  }

  useEffect(() => {
    if (isMobile || !audioUnlocked) return undefined

    const handleMouseDown = () => {
      unlockAudio()
      playMouseClick()
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [audioUnlocked, isMobile])

  useEffect(() => {
    if (!bootComplete || isMobile) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const taskbarHeight = 64
    const bottomMargin = 20
    const maxWindowHeight = viewportHeight - taskbarHeight - bottomMargin * 2
    const neofetchWidth = Math.min(
      Math.max(520, Math.round(viewportWidth * 0.38)),
      Math.min(720, viewportWidth - 40),
    )
    const neofetchHeight = Math.min(
      Math.max(390, Math.round((viewportHeight - taskbarHeight) * 0.5)),
      maxWindowHeight,
    )
    const motdWidth = Math.min(
      Math.max(500, Math.round(viewportWidth * 0.42)),
      Math.min(660, Math.round(viewportWidth * 0.72), viewportWidth - 40),
    )
    const motdHeight = Math.min(
      Math.max(440, Math.round((viewportHeight - taskbarHeight) * 0.56)),
      maxWindowHeight,
    )
    const neofetchX = Math.max(
      20,
      Math.min(Math.round(viewportWidth * 0.52), viewportWidth - neofetchWidth - 20),
    )
    const neofetchY = Math.max(
      20,
      Math.min(Math.round(viewportHeight * 0.13), viewportHeight - taskbarHeight - neofetchHeight - bottomMargin),
    )
    const motdX = Math.max(
      20,
      Math.min(Math.round(viewportWidth * 0.3), viewportWidth - motdWidth - 20),
    )
    const motdY = Math.max(
      20,
      Math.min(Math.round(viewportHeight * 0.37), viewportHeight - taskbarHeight - motdHeight - bottomMargin),
    )
    const neofetchTimer = window.setTimeout(() => openWindow({
      id: 'neofetch',
      position: {
        x: neofetchX,
        y: neofetchY,
      },
      size: { w: neofetchWidth, h: neofetchHeight },
      zIndex: 10,
    }), 300)
    const motdTimer = window.setTimeout(() => openWindow({
      id: 'motd',
      position: {
        x: motdX,
        y: motdY,
      },
      size: { w: motdWidth, h: motdHeight },
      zIndex: 20,
    }), 500)

    return () => {
      window.clearTimeout(neofetchTimer)
      window.clearTimeout(motdTimer)
    }
  }, [bootComplete, isMobile, openWindow])

  useEffect(() => {
    if (!bootComplete || isMobile) return undefined
    if (isAmbientEnabled()) startAmbientNoise()
    return () => stopAmbientNoise()
  }, [bootComplete, isMobile])

  if (!audioUnlocked && !isMobile) {
    return (
      <button type="button" className="audio-start-gate" onClick={handleAudioUnlock}>
        CLICK ANYWHERE TO START
      </button>
    )
  }

  if (isMobile) {
    if (!bootComplete) return <BootSequence />

    return (
      <MobileView
        showWarning={!warningDismissed}
        onContinueWarning={handleWarningDismiss}
      />
    )
  }

  if (!bootComplete) return <BootSequence />

  return (
    <>
      <CRTBezel />
      <div className="crt-reflection" />
      <div className="crt-edge-blur" />
      <div className="vignette-overlay" />
      <div className="scanlines-overlay" />
      <div className="crt-wrapper">
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
        </main>
      </div>
    </>
  )
}

export default App
