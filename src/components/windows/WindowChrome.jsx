import { portfolioData } from '../../data/portfolioData'

function ChromeButton({ children, onClick, title }) {
  return (
    <button
      aria-label={title}
      className="window-chrome__button"
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      title={title}
      type="button"
    >
      {children}
    </button>
  )
}

export function WindowChrome({ isFocused, onClose, onMinimize, title }) {
  const { closeButton, maximizeButton, menuButton, minimizeButton } = portfolioData.ui
  const { closeLabel, maximizeLabel, minimizeLabel, windowMenuLabel } = portfolioData.ui

  return (
    <div
      className={isFocused ? 'window-chrome window-drag-handle' : 'window-chrome is-inactive window-drag-handle'}
    >
      <ChromeButton title={windowMenuLabel}>{menuButton}</ChromeButton>
      <div className="window-chrome__title">{title}</div>
      <div className="window-chrome__controls">
        <ChromeButton onClick={onMinimize} title={minimizeLabel}>
          {minimizeButton}
        </ChromeButton>
        <ChromeButton title={maximizeLabel}>{maximizeButton}</ChromeButton>
        <ChromeButton onClick={onClose} title={closeLabel}>
          {closeButton}
        </ChromeButton>
      </div>
    </div>
  )
}

export default WindowChrome
