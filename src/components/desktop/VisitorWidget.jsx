import { useEffect, useState } from 'react'

function VisitorWidget() {
  const [count, setCount] = useState('??????')

  useEffect(() => {
    fetch('https://api.countapi.xyz/hit/0xbene.dev/visits')
      .then((response) => response.json())
      .then((data) => setCount(String(data.value).padStart(6, '0')))
      .catch(() => setCount('??????'))
  }, [])

  return (
    <div className="desktop-widget compact-widget visitor-widget">
      <span className="widget-label">VISITORS</span>
      <span className="widget-value">{count}</span>
    </div>
  )
}

export default VisitorWidget
