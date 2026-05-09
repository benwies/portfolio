import { useEffect, useState } from 'react'

function VisitorWidget() {
  const [count, setCount] = useState('??????')

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/visitors')
        const data = await response.json()
        if (data.value !== null) {
          setCount(String(data.value).padStart(6, '0'))
        } else {
          setCount('??????')
        }
      } catch {
        setCount('??????')
      }
    }

    fetchCount()
  }, [])

  return (
    <div className="desktop-widget compact-widget visitor-widget">
      <span className="widget-label">VISITORS</span>
      <span className="widget-value">{count}</span>
    </div>
  )
}

export default VisitorWidget
