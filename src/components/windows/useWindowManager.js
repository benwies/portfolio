import { useCallback } from 'react'
import { useWindowStore } from '../../store/windowStore'

export function useWindowManager() {
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const clearWindowAnimation = useWindowStore((state) => state.clearWindowAnimation)
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  const requestMinimizeWindow = useWindowStore((state) => state.requestMinimizeWindow)
  const focusWindow = useWindowStore((state) => state.focusWindow)
  const updateWindowGeometry = useWindowStore((state) => state.updateWindowGeometry)

  const visibleWindows = windows.filter(
    (windowItem) => windowItem.isOpen && !windowItem.isMinimized,
  )
  const minimizedWindows = windows.filter(
    (windowItem) => windowItem.isOpen && windowItem.isMinimized,
  )
  const focusedWindow = windows.find((windowItem) => windowItem.isFocused) ?? null

  const updateGeometry = useCallback(
    (id, geometry) => {
      updateWindowGeometry(id, geometry)
    },
    [updateWindowGeometry],
  )

  return {
    windows,
    visibleWindows,
    minimizedWindows,
    focusedWindow,
    openWindow,
    closeWindow,
    clearWindowAnimation,
    minimizeWindow,
    requestMinimizeWindow,
    focusWindow,
    updateWindowGeometry: updateGeometry,
  }
}

export default useWindowManager
