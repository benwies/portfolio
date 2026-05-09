import { create } from 'zustand'
import { windowDefinitions } from '../data/portfolioData'

const initialWindows = windowDefinitions.map((windowDef, index) => ({
  ...windowDef,
  workspace: windowDef.workspace ?? 1,
  isOpen: false,
  isMinimized: false,
  isFocused: false,
  animation: null,
  zIndex: 10 + index,
}))

export const WORKSPACES = {
  1: { name: 'One', label: 'HOME', defaultWindows: ['neofetch', 'motd'] },
  2: { name: 'Two', label: 'WORK', defaultWindows: ['about', 'skills'] },
  3: { name: 'Three', label: 'PORT', defaultWindows: ['projects', 'certs'] },
  4: { name: 'Four', label: 'FUN', defaultWindows: ['snake', 'paint'] },
}

const defaultWindowLayouts = {
  neofetch: { position: { x: 0.52, y: 0.13 }, size: { width: 430, height: 310 } },
  motd: { position: { x: 0.3, y: 0.37 }, size: { width: 370, height: 340 } },
  about: { position: { x: 0.15, y: 0.15 }, size: { width: 420, height: 380 } },
  skills: { position: { x: 0.45, y: 0.2 }, size: { width: 420, height: 400 } },
  projects: { position: { x: 0.15, y: 0.15 }, size: { width: 480, height: 400 } },
  certs: { position: { x: 0.5, y: 0.25 }, size: { width: 400, height: 320 } },
  snake: { position: { x: 0.2, y: 0.15 }, size: { width: 560, height: 560 } },
  paint: { position: { x: 0.55, y: 0.1 }, size: { width: 500, height: 440 } },
}

const taskbarHeight = 52

const resolveWorkspaceLayout = (id) => {
  const layout = defaultWindowLayouts[id]
  if (!layout || typeof window === 'undefined') return null
  const usableHeight = window.innerHeight - taskbarHeight
  return {
    position: {
      x: Math.round(window.innerWidth * layout.position.x),
      y: Math.round(usableHeight * layout.position.y),
    },
    size: layout.size,
  }
}

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
  activeWorkspace: 1,
  visitedWorkspaces: new Set(),
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
      const targetWorkspace = config.workspace ?? state.activeWorkspace
      const shouldFocusTarget = targetWorkspace === state.activeWorkspace
      const topZ = Math.max(...state.windows.map((windowItem) => windowItem.zIndex), 10) + 1
      return {
        windows: state.windows.map((windowItem) => {
          if (windowItem.id !== id) {
            return {
              ...windowItem,
              isFocused: shouldFocusTarget ? false : windowItem.isFocused,
            }
          }

          const nextSize = configuredSize ?? windowItem.size
          return {
            ...windowItem,
            isOpen: true,
            isMinimized: false,
            isFocused: shouldFocusTarget,
            animation: windowItem.isOpen && windowItem.isMinimized ? 'restoring' : null,
            workspace: targetWorkspace,
            position: config.position ?? centeredPosition({ ...windowItem, size: nextSize }),
            size: nextSize,
            zIndex: config.zIndex ?? topZ,
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
  clearWindowAnimation: (id) =>
    set((state) => ({
      windows: state.windows.map((windowItem) => ({
        ...windowItem,
        animation: windowItem.id === id ? null : windowItem.animation,
      })),
    })),
  switchWorkspace: (workspaceNumber) => {
    const state = get()
    const workspace = WORKSPACES[workspaceNumber]
    if (!workspace) return

    const alreadyVisited = state.visitedWorkspaces.has(workspaceNumber)
    set((current) => ({
      activeWorkspace: workspaceNumber,
      visitedWorkspaces: new Set([...current.visitedWorkspaces, workspaceNumber]),
      windows: current.windows.map((windowItem) => ({
        ...windowItem,
        isFocused: windowItem.workspace === workspaceNumber ? windowItem.isFocused : false,
      })),
    }))

    if (alreadyVisited) return

    workspace.defaultWindows.forEach((id, index) => {
      window.setTimeout(() => {
        const layout = resolveWorkspaceLayout(id)
        get().openWindow({
          id,
          workspace: workspaceNumber,
          position: layout?.position,
          size: layout?.size,
          zIndex: 10 + index,
        })
      }, 300 * (index + 1))
    })
  },
  updateWindowGeometry: (id, geometry) =>
    set((state) => ({
      windows: state.windows.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, ...geometry } : windowItem,
      ),
    })),
  setBootComplete: (bootComplete) => set({ bootComplete }),
}))
