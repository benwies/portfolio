import { useEffect, useState } from 'react'

function ClockWidget() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const seconds = now.getSeconds() * 6
  const minutes = now.getMinutes() * 6 + seconds / 60
  const hours = (now.getHours() % 12) * 30 + minutes / 12
  const digital = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <div className="desktop-widget clock-widget" aria-label="Clock">
      <svg className="clock-face" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="42" />
        <path d="M50 15v7M50 78v7M15 50h7M78 50h7" />
        <line x1="50" y1="50" x2="50" y2="27" style={{ transform: `rotate(${hours}deg)` }} />
        <line x1="50" y1="50" x2="50" y2="20" style={{ transform: `rotate(${minutes}deg)` }} />
        <line className="clock-second" x1="50" y1="50" x2="50" y2="18" style={{ transform: `rotate(${seconds}deg)` }} />
      </svg>
      <div className="widget-value">{digital}</div>
    </div>
  )
}

export default ClockWidget
