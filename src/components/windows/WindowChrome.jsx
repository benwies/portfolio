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

function WindowMenuButton({ title }) {
  return (
    <div className="window-chrome__menu-button" title={title} aria-label={title}>
      <span />
    </div>
  )
}

export function WindowChrome({
  canMaximize = true,
  canMinimize = true,
  isFocused,
  onClose,
  onMinimize,
  title,
}) {
  const { closeButton, maximizeButton, minimizeButton } = portfolioData.ui
  const { closeLabel, maximizeLabel, minimizeLabel, windowMenuLabel } = portfolioData.ui

  return (
    <div
      className={isFocused ? 'window-chrome window-drag-handle' : 'window-chrome is-inactive window-drag-handle'}
    >
      <WindowMenuButton title={windowMenuLabel} />
      <div className="window-chrome__title">{title}</div>
      <div className="window-chrome__controls">
        {canMinimize ? (
          <ChromeButton onClick={onMinimize} title={minimizeLabel}>
            {minimizeButton}
          </ChromeButton>
        ) : null}
        {canMaximize ? <ChromeButton title={maximizeLabel}>{maximizeButton}</ChromeButton> : null}
        <ChromeButton onClick={onClose} title={closeLabel}>
          {closeButton}
        </ChromeButton>
      </div>
    </div>
  )
}

export default WindowChrome
