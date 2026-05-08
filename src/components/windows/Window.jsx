import { Rnd } from 'react-rnd'
import WindowChrome from './WindowChrome'
import { useWindowManager } from './useWindowManager'

const minSize = { width: 320, height: 220 }

const styles = {
  shell: {
    background: '#d4d0c8',
    borderColor: '#ffffff #808080 #808080 #ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: '1px 1px 0 #000000',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  focused: {
    boxShadow: '1px 1px 0 #000000',
  },
  body: {
    background: '#d4d0c8',
    borderColor: '#808080 #ffffff #ffffff #808080',
    borderStyle: 'solid',
    borderWidth: 2,
    color: '#000000',
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: 2,
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
