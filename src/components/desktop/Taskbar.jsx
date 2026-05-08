import { useWindowStore } from '../../store/windowStore'
import { portfolioData } from '../../data/portfolioData'

function Taskbar() {
  const windows = useWindowStore((state) => state.windows)
  const crtEnabled = useWindowStore((state) => state.crtEnabled)
  const openWindow = useWindowStore((state) => state.openWindow)
  const focusWindow = useWindowStore((state) => state.focusWindow)
  const toggleCrt = useWindowStore((state) => state.toggleCrt)
  const openWindows = windows.filter((windowItem) => windowItem.isOpen)
  const { menuLabel, crtOn, crtOff } = portfolioData.ui

  return (
    <footer className="taskbar" aria-label="Desktop taskbar">
      <button
        type="button"
        className="taskbar__menu"
        onClick={() => openWindow('terminal')}
      >
        {menuLabel}
      </button>

      <nav className="taskbar__windows" aria-label="Open windows">
        {openWindows.map((windowItem) => (
          <button
            type="button"
            key={windowItem.id}
            className={[
              'taskbar__window',
              windowItem.isFocused ? 'taskbar__window--focused' : '',
              windowItem.isMinimized ? 'taskbar__window--minimized' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => focusWindow(windowItem.id)}
          >
            {windowItem.title}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className={crtEnabled ? 'taskbar__tray is-active' : 'taskbar__tray'}
        onClick={toggleCrt}
        aria-pressed={crtEnabled}
      >
        {crtEnabled ? crtOn : crtOff}
      </button>
    </footer>
  )
}

export default Taskbar
