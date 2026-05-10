import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { startAmbientNoise, stopAmbientNoise, unlockAudio } from '../../hooks/useSounds'
import {
  isAmbientEnabled,
  isSoundEnabled,
  toggleAmbient,
  toggleSound,
} from '../../store/soundStore'
import { useWindowStore } from '../../store/windowStore'
import { CdeIcon } from './DesktopIcon'

const visualWorkspaces = [
  { name: 'One', label: 'One' },
  { name: 'Two', label: 'Two' },
  { name: 'Three', label: 'Three' },
  { name: 'Four', label: 'Four' },
]

function formatClock(date) {
  return {
    date: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
    }).format(date),
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date),
  }
}

function Taskbar() {
  const [clock, setClock] = useState(() => formatClock(new Date()))
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const [ambientOn, setAmbientOn] = useState(() => isAmbientEnabled())
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const requestMinimizeWindow = useWindowStore((state) => state.requestMinimizeWindow)
  const visibleInTaskbar = windows.filter((windowItem) => windowItem.isOpen)

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const handleWindowButtonClick = (appId) => {
    const windowItem = windows.find((item) => item.id === appId)
    if (windowItem?.isOpen && !windowItem.isMinimized && windowItem.isFocused) {
      requestMinimizeWindow(appId)
      return
    }

    openWindow(appId)
  }

  const iconForWindow = (windowItem) => {
    if (windowItem.id === 'neofetch') return 'terminal'
    if (windowItem.id === 'motd') return 'welcome'
    return portfolioData.desktopIcons.find((item) => item.appId === windowItem.id)?.icon ?? 'text'
  }

  const handleSoundToggle = () => {
    const next = toggleSound()
    if (next) {
      unlockAudio()
      if (ambientOn) startAmbientNoise()
    } else {
      stopAmbientNoise()
    }
    setSoundOn(next)
  }

  const handleAmbientToggle = () => {
    const next = toggleAmbient()
    setAmbientOn(next)
    if (next) {
      unlockAudio()
      startAmbientNoise()
      return
    }
    stopAmbientNoise()
  }

  return (
    <footer className="front-panel" aria-label="CDE Front Panel">
      <time className="front-panel__clock" dateTime={`${clock.date} ${clock.time}`} aria-label={portfolioData.ui.clockLabel}>
        <span>{clock.date}</span>
        <strong>{clock.time}</strong>
      </time>
      <button
        type="button"
        className="front-panel__sound"
        onClick={handleSoundToggle}
        title={soundOn ? 'Sound: ON' : 'Sound: OFF'}
        aria-label={soundOn ? 'Sound on' : 'Sound off'}
      >
        {soundOn ? 'ON' : 'X'}
      </button>
      <button
        type="button"
        className="front-panel__sound front-panel__ambient"
        onClick={handleAmbientToggle}
        title={ambientOn ? 'Background noise: ON' : 'Background noise: OFF'}
        aria-label={ambientOn ? 'Background noise on' : 'Background noise off'}
      >
        {ambientOn ? '\u224b' : '\u25cb'}
      </button>

      <nav className="front-panel__launchers" aria-label={portfolioData.ui.launcherLabel}>
        {visibleInTaskbar.map((windowItem) => (
          <button
            type="button"
            key={windowItem.id}
            className={windowItem.isFocused ? 'front-panel__launcher is-active' : 'front-panel__launcher'}
            onClick={() => handleWindowButtonClick(windowItem.id)}
            title={windowItem.title}
          >
            <span className="front-panel__launcher-icon">
              <CdeIcon type={iconForWindow(windowItem)} label={windowItem.title} />
            </span>
          </button>
        ))}
      </nav>

      <div className="front-panel__workspace" aria-label={portfolioData.ui.workspaceLabel}>
        {visualWorkspaces.map((workspace, index) => (
          <button
            key={workspace.name}
            type="button"
            className={index === 0 ? 'front-panel__workspace-cell is-active' : 'front-panel__workspace-cell'}
            tabIndex={-1}
          >
            {workspace.label}
          </button>
        ))}
      </div>
    </footer>
  )
}

export default Taskbar
