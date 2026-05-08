import { useWindowStore } from './windowStore'

export const openWindow = (id) => useWindowStore.getState().openWindow(id)
export const closeWindow = (id) => useWindowStore.getState().closeWindow(id)
export const minimizeWindow = (id) => useWindowStore.getState().minimizeWindow(id)
export const focusWindow = (id) => useWindowStore.getState().focusWindow(id)
