import { useEffect, useState } from 'react'

function VisitorWidget() {
  const [count, setCount] = useState('......')

  useEffect(() => {
    fetch('/api/visitors')
      .then((response) => response.json())
      .then((data) => {
        if (data.value !== null && data.value !== undefined) {
          setCount(String(data.value).padStart(6, '0'))
        } else {
          setCount('??????')
        }
      })
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
