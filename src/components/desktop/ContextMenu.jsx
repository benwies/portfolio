import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const menuWidth = 220
const menuHeight = 104

function clampMenuPosition(position) {
  return {
    x: position.x + menuWidth > window.innerWidth ? Math.max(0, position.x - menuWidth) : position.x,
    y: position.y + menuHeight > window.innerHeight ? Math.max(0, position.y - menuHeight) : position.y,
  }
}

function resetDesktop() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('icon_grid_'))
    .forEach((key) => localStorage.removeItem(key))
  window.location.reload()
}

function ContextMenu({ onClose, position }) {
  const openWindow = useWindowStore((state) => state.openWindow)
  const labels = portfolioData.ui.contextMenu
  const safePosition = clampMenuPosition(position)

  const runAction = (action) => {
    action()
    onClose()
  }

  return (
    <nav
      className="context-menu"
      style={{ left: safePosition.x, top: safePosition.y }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="Desktop context menu"
    >
      <button type="button" className="context-menu-item" onClick={() => runAction(() => openWindow('terminal'))}>
        {labels.newTerminal}
      </button>
      <div className="context-menu-divider" />
      <button type="button" className="context-menu-item" onClick={() => runAction(resetDesktop)}>
        {labels.resetDesktop}
      </button>
      <div className="context-menu-divider" />
      <button
        type="button"
        className="context-menu-item"
        onClick={() => runAction(() => openWindow('workstationAbout'))}
      >
        {labels.aboutWorkstation}
      </button>
    </nav>
  )
}

export default ContextMenu
