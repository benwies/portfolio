import { create } from 'zustand'
import { windowDefinitions } from '../data/portfolioData'

const initialWindows = windowDefinitions.map((windowDef, index) => ({
  ...windowDef,
  isOpen: windowDef.id === 'terminal',
  isMinimized: false,
  isFocused: windowDef.id === 'terminal',
  zIndex: 10 + index,
}))

export const useWindowStore = create((set, get) => ({
  windows: initialWindows,
  bootComplete: false,
  openWindow: (id) =>
    set((state) => {
      const topZ = Math.max(...state.windows.map((windowItem) => windowItem.zIndex), 10) + 1
      return {
        windows: state.windows.map((windowItem) => ({
          ...windowItem,
          isOpen: windowItem.id === id ? true : windowItem.isOpen,
          isMinimized: windowItem.id === id ? false : windowItem.isMinimized,
          isFocused: windowItem.id === id,
          zIndex: windowItem.id === id ? topZ : windowItem.zIndex,
        })),
      }
    }),
  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isOpen: windowItem.id === id ? false : windowItem.isOpen,
        isFocused: windowItem.id === id ? false : windowItem.isFocused,
      })),
    })),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isMinimized: windowItem.id === id ? true : windowItem.isMinimized,
        isFocused: windowItem.id === id ? false : windowItem.isFocused,
      })),
    })),
  focusWindow: (id) => {
    const topZ = Math.max(...get().windows.map((windowItem) => windowItem.zIndex), 10) + 1
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        isFocused: windowItem.id === id,
        isMinimized: windowItem.id === id ? false : windowItem.isMinimized,
        zIndex: windowItem.id === id ? topZ : windowItem.zIndex,
      })),
    }))
  },
  updateWindowGeometry: (id, geometry) =>
    set((state) => ({
      windows: state.windows.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, ...geometry } : windowItem,
      ),
    })),
  setBootComplete: (bootComplete) => set({ bootComplete }),
}))
