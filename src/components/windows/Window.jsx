import { Rnd } from 'react-rnd'
import WindowChrome from './WindowChrome'
import { useWindowManager } from './useWindowManager'

const minSize = { width: 320, height: 220 }

function getGeometry(windowItem) {
  return {
    position: windowItem.position ?? { x: 80, y: 80 },
    size: windowItem.size ?? { width: 640, height: 420 },
  }
}

export function Window({ children, window: windowItem, windowItem: fallbackWindow }) {
  const activeWindow = windowItem ?? fallbackWindow
  const { closeWindow, focusWindow, minimizeWindow, updateWindowGeometry } = useWindowManager()

  if (!activeWindow?.isOpen || activeWindow.isMinimized) return null

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
        className={[
          'cde-window',
          activeWindow.variant ? `cde-window--${activeWindow.variant}` : '',
          activeWindow.isFocused ? 'is-focused' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
      >
        <WindowChrome
          canMaximize={activeWindow.id !== 'motd'}
          canMinimize={activeWindow.id !== 'motd'}
          isFocused={activeWindow.isFocused}
          onClose={() => closeWindow(activeWindow.id)}
          onMinimize={() => minimizeWindow(activeWindow.id)}
          title={activeWindow.title}
        />
        <div className="cde-window__body">{children}</div>
      </section>
    </Rnd>
  )
}

export default Window
