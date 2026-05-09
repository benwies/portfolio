import { useEffect, useState } from 'react'

function ClockWidget() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const digital = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <div className="desktop-widget clock-widget" aria-label="Clock">
      <span className="widget-label">CLOCK</span>
      <span className="widget-value">{digital}</span>
    </div>
  )
}

export default ClockWidget
