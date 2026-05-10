import { create } from 'zustand'
import { windowDefinitions } from '../data/portfolioData'

const initialWindows = windowDefinitions.map((windowDef, index) => ({
  ...windowDef,
  isOpen: false,
  isMinimized: false,
  isFocused: false,
  animation: null,
  zIndex: 100 + index,
}))

const centeredPosition = (windowItem) => {
  if (typeof window === 'undefined') return windowItem.position

  if (windowItem.id === 'neofetch') {
    const x = Math.round(window.innerWidth * 0.6)
    return {
      x: Math.max(120, Math.min(x, window.innerWidth - windowItem.size.width - 24)),
      y: 40,
    }
  }

  if (!['motd', 'snake'].includes(windowItem.id)) return windowItem.position

  return {
    x: Math.max(16, Math.round((window.innerWidth - windowItem.size.width) / 2)),
    y: Math.max(16, Math.round((window.innerHeight - windowItem.size.height) / 2) - (windowItem.id === 'motd' ? 24 : 0)),
  }
}

export const useWindowStore = create((set, get) => ({
  windows: initialWindows,
  bootComplete: false,
  openWindow: (request) =>
    set((state) => {
      const config = typeof request === 'string' ? { id: request } : request
      const { id } = config
      const configuredSize = config.size
        ? {
            width: config.size.width ?? config.size.w,
            height: config.size.height ?? config.size.h,
          }
        : null
      const topZ = Math.max(...state.windows.map((windowItem) => windowItem.zIndex), 99) + 1
      return {
        windows: state.windows.map((windowItem) => {
          if (windowItem.id !== id) {
            return {
              ...windowItem,
              isFocused: false,
            }
          }

          const nextSize = configuredSize ?? windowItem.size
          return {
            ...windowItem,
            isOpen: true,
            isMinimized: false,
            isFocused: true,
            initialCommand: config.initialCommand ?? null,
            animation: windowItem.isOpen && windowItem.isMinimized ? 'restoring' : null,
            position: config.position ?? centeredPosition({ ...windowItem, size: nextSize }),
            size: nextSize,
            zIndex: config.zIndex !== undefined ? 100 + config.zIndex : topZ,
          }
        }),
      }
    }),
  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isOpen: windowItem.id === id ? false : windowItem.isOpen,
        isFocused: windowItem.id === id ? false : windowItem.isFocused,
        initialCommand: windowItem.id === id ? null : windowItem.initialCommand,
        animation: windowItem.id === id ? null : windowItem.animation,
      })),
    }))
  },
  requestMinimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        animation: windowItem.id === id ? 'minimizing' : windowItem.animation,
      })),
    })),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isMinimized: windowItem.id === id ? true : windowItem.isMinimized,
        isFocused: windowItem.id === id ? false : windowItem.isFocused,
        animation: windowItem.id === id ? null : windowItem.animation,
      })),
    })),
  focusWindow: (id) => {
    const topZ = Math.max(...get().windows.map((windowItem) => windowItem.zIndex), 99) + 1
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isFocused: windowItem.id === id,
        isMinimized: windowItem.id === id ? false : windowItem.isMinimized,
        zIndex: windowItem.id === id ? topZ : windowItem.zIndex,
      })),
    }))
  },
  clearWindowAnimation: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        animation: windowItem.id === id ? null : windowItem.animation,
      })),
    })),
  updateWindowGeometry: (id, geometry) =>
    set((state) => ({
      windows: state.windows.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, ...geometry } : windowItem,
      ),
    })),
  setBootComplete: (bootComplete) => set({ bootComplete }),
}))
