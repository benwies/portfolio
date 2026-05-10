import { useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { playDiskActivity, playWindowClose, playWindowOpen } from '../../hooks/useSounds'
import WindowChrome from './WindowChrome'
import { useWindowManager } from './useWindowManager'

const minSize = { width: 320, height: 220 }
const resizeHandleStyles = {
  bottom: { bottom: 0, height: 6, left: 12, right: 12, zIndex: 10 },
  bottomLeft: { bottom: 0, height: 12, left: 0, width: 12, zIndex: 11 },
  bottomRight: { bottom: 0, height: 12, right: 0, width: 12, zIndex: 11 },
  left: { bottom: 12, left: 0, top: 12, width: 6, zIndex: 10 },
  right: { bottom: 12, right: 0, top: 12, width: 6, zIndex: 10 },
  top: { height: 6, left: 12, right: 12, top: 0, zIndex: 10 },
  topLeft: { height: 12, left: 0, top: 0, width: 12, zIndex: 11 },
  topRight: { height: 12, right: 0, top: 0, width: 12, zIndex: 11 },
}

function getGeometry(windowItem) {
  return {
    position: windowItem.position ?? { x: 80, y: 80 },
    size: windowItem.size ?? { width: 640, height: 420 },
  }
}

export function Window({ children, window: windowItem, windowItem: fallbackWindow }) {
  const activeWindow = windowItem ?? fallbackWindow
  const playedOpenSound = useRef(false)
  const {
    clearWindowAnimation,
    closeWindow,
    focusWindow,
    minimizeWindow,
    requestMinimizeWindow,
    updateWindowGeometry,
  } = useWindowManager()
  const shouldRender = activeWindow?.isOpen && !activeWindow.isMinimized

  useEffect(() => {
    if (shouldRender && !playedOpenSound.current) {
      playedOpenSound.current = true
      playWindowOpen()
      playDiskActivity()
    }
  }, [shouldRender])

  if (!shouldRender) return null

  const { position, size } = getGeometry(activeWindow)
  const handleFocus = () => focusWindow(activeWindow.id)
  const isDialog = ['motd', 'workstationAbout'].includes(activeWindow.id)

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

  const handleAnimationEnd = () => {
    if (activeWindow.animation === 'minimizing') {
      minimizeWindow(activeWindow.id)
      return
    }

    if (activeWindow.animation === 'restoring') {
      clearWindowAnimation(activeWindow.id)
    }
  }

  const handleClose = () => {
    playWindowClose()
    playDiskActivity()
    closeWindow(activeWindow.id)
  }

  return (
    <Rnd
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      disableDragging={false}
      enableResizing={!activeWindow.fixedSize}
      minHeight={activeWindow.fixedSize ? size.height : minSize.height}
      minWidth={activeWindow.fixedSize ? size.width : minSize.width}
      onDragStart={handleFocus}
      onDragStop={handleDragStop}
      onMouseDown={handleFocus}
      onResizeStart={handleFocus}
      onResizeStop={handleResizeStop}
      position={position}
      resizeHandleClasses={{
        bottom: 'resize-handle resize-s',
        bottomLeft: 'resize-handle resize-sw',
        bottomRight: 'resize-handle resize-se',
        left: 'resize-handle resize-w',
        right: 'resize-handle resize-e',
        top: 'resize-handle resize-n',
        topLeft: 'resize-handle resize-nw',
        topRight: 'resize-handle resize-ne',
      }}
      resizeHandleStyles={resizeHandleStyles}
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
          activeWindow.animation === 'minimizing' ? 'window-minimizing' : '',
          activeWindow.animation === 'restoring' ? 'window-restoring' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onAnimationEnd={handleAnimationEnd}
        role="dialog"
      >
        <WindowChrome
          canMaximize={!isDialog && !activeWindow.fixedSize}
          canMinimize={!isDialog}
          isFocused={activeWindow.isFocused}
          onClose={handleClose}
          onMinimize={() => requestMinimizeWindow(activeWindow.id)}
          title={activeWindow.title}
        />
        <div className="cde-window__body">{children}</div>
      </section>
    </Rnd>
  )
}

export default Window
