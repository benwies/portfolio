const buttonBase = {
  alignItems: 'center',
  background: '#c0c0c0',
  borderColor: '#ffffff #404040 #404040 #ffffff',
  borderStyle: 'solid',
  borderWidth: 2,
  color: '#111111',
  display: 'inline-flex',
  font: '700 12px/1 ui-monospace, SFMono-Regular, Consolas, monospace',
  height: 20,
  justifyContent: 'center',
  padding: 0,
  width: 20,
}

const styles = {
  bar: {
    alignItems: 'center',
    background: '#8b1f1f',
    borderBottom: '2px solid #404040',
    color: '#ffffff',
    cursor: 'move',
    display: 'flex',
    gap: 8,
    height: 28,
    padding: '3px 4px 3px 8px',
    userSelect: 'none',
  },
  inactive: {
    background: '#777777',
  },
  title: {
    flex: 1,
    font: '700 13px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace',
    minWidth: 0,
    overflow: 'hidden',
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  controls: {
    display: 'flex',
    flex: '0 0 auto',
    gap: 3,
  },
}

function ChromeButton({ label, title, onClick }) {
  return (
    <button
      aria-label={title}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      style={buttonBase}
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
      className="window-drag-handle"
      style={{ ...styles.bar, ...(isFocused ? null : styles.inactive) }}
    >
      <div style={styles.title}>{title}</div>
      <div style={styles.controls}>
        <ChromeButton label="." onClick={onMinimize} title="Minimize" />
        <ChromeButton label="x" onClick={onClose} title="Close" />
      </div>
    </div>
  )
}

export default WindowChrome
