function ChromeButton({ label, title, onClick }) {
  return (
    <button
      aria-label={title}
      className="window-chrome__button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      title={title}
      type="button"
    >
      {label}
    </button>
  )
}

export function WindowChrome({ isFocused, onClose, onMinimize, title }) {
  return (
    <div
      className={isFocused ? 'window-chrome window-drag-handle' : 'window-chrome is-inactive window-drag-handle'}
    >
      <div className="window-chrome__title">{title}</div>
      <div className="window-chrome__controls">
        <ChromeButton label="_" onClick={onMinimize} title="Minimize" />
        <ChromeButton label="□" onClick={() => {}} title="Maximize" />
        <ChromeButton label="X" onClick={onClose} title="Close" />
      </div>
    </div>
  )
}

export default WindowChrome
