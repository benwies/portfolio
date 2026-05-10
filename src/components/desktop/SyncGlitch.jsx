import { useEffect } from 'react'

function SyncGlitch({ wrapperRef }) {
  useEffect(() => {
    const node = wrapperRef?.current
    let returnTimer
    let nextTimer

    const scheduleNext = () => {
      const delay = 180000 + Math.random() * 120000
      nextTimer = window.setTimeout(() => {
        if (!wrapperRef?.current) {
          scheduleNext()
          return
        }

        wrapperRef.current.style.setProperty('--sync-shift', '4px')
        returnTimer = window.setTimeout(() => {
          wrapperRef.current?.style.setProperty('--sync-shift', '0px')
          scheduleNext()
        }, 30)
      }, delay)
    }

    scheduleNext()

    return () => {
      window.clearTimeout(nextTimer)
      window.clearTimeout(returnTimer)
      node?.style.setProperty('--sync-shift', '0px')
    }
  }, [wrapperRef])

  return null
}

export default SyncGlitch
