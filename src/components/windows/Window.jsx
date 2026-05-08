import { Rnd } from 'react-rnd'
import WindowChrome from './WindowChrome'
import { useWindowManager } from './useWindowManager'

const minSize = { width: 320, height: 220 }

const styles = {
  shell: {
    background: '#c0c0c0',
    borderColor: '#ffffff #303030 #303030 #ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.35)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  focused: {
    boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.45)',
  },
  body: {
    background: '#101010',
    borderColor: '#404040 #ffffff #ffffff #404040',
    borderStyle: 'solid',
    borderWidth: 2,
    color: '#f2f2f2',
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
  },
}

function getGeometry(windowItem) {
  return {
    position: windowItem.position ?? { x: 80, y: 80 },
    size: windowItem.size ?? { width: 640, height: 420 },
  }
}

export function Window({ children, window: windowItem, windowItem: fallbackWindow }) {
  const activeWindow = windowItem ?? fallbackWindow
  const { closeWindow, focusWindow, minimizeWindow, updateWindowGeometry } = useWindowManager()

  if (!activeWindow?.isOpen || activeWindow.isMinimized) {
    return null
  }

  const { position, size } = getGeometry(activeWindow)
  const handleFocus = () => focusWindow(activeWindow.id)

  const handleDragStop = (_event, data) => {
    updateWindowGeometry(activeWindow.id, { position: { x: data.x, y: data.y } })
  }

  const handleResizeStop = (_event, _direction, ref, _delta, nextPosition) => {
    updateWindowGeometry(activeWindow.id, {
      position: nextPosition,
      size: {
        height: Math.max(ref.offsetHeight, minSize.height),
        width: Math.max(ref.offsetWidth, minSize.width),
      },
    })
  }

  return (
    <Rnd
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      minHeight={minSize.height}
      minWidth={minSize.width}
      onDragStart={handleFocus}
      onDragStop={handleDragStop}
      onMouseDown={handleFocus}
      onResizeStart={handleFocus}
      onResizeStop={handleResizeStop}
      position={position}
      size={size}
      style={{ zIndex: activeWindow.zIndex }}
    >
      <section
        aria-label={activeWindow.title}
        aria-modal="false"
        role="dialog"
        style={{
          ...styles.shell,
          ...(activeWindow.isFocused ? styles.focused : null),
        }}
      >
        <WindowChrome
          isFocused={activeWindow.isFocused}
          onClose={() => closeWindow(activeWindow.id)}
          onMinimize={() => minimizeWindow(activeWindow.id)}
          title={activeWindow.title}
        />
        <div style={styles.body}>{children}</div>
      </section>
    </Rnd>
  )
}

export default Window
