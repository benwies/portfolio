export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  return localStorage.getItem('sound_enabled') !== 'false'
}

export const toggleSound = () => {
  const next = !isSoundEnabled()
  localStorage.setItem('sound_enabled', String(next))
  return next
}

export const isAmbientEnabled = () => {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  return localStorage.getItem('ambient_enabled') !== 'false'
}

export const toggleAmbient = () => {
  const next = !isAmbientEnabled()
  localStorage.setItem('ambient_enabled', String(next))
  return next
}
