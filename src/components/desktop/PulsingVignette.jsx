import { useEffect, useState } from 'react'

function PulsingVignette() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    let restoreTimer
    const pulse = () => {
      setOpacity(0.7)
      restoreTimer = window.setTimeout(() => setOpacity(1), 4000)
    }

    const interval = window.setInterval(pulse, 8000)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(restoreTimer)
    }
  }, [])

  return (
    <div
      className="vignette-overlay"
      style={{ opacity }}
    />
  )
}

export default PulsingVignette
