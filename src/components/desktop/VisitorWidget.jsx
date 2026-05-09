import { useEffect, useState } from 'react'

function VisitorWidget() {
  const [count, setCount] = useState('000001')

  useEffect(() => {
    const fallbackCount = () => {
      const stored = Number.parseInt(localStorage.getItem('visit_count') || '0', 10) + 1
      localStorage.setItem('visit_count', String(stored))
      setCount(String(stored).padStart(6, '0'))
    }

    fetch('/api/visitors')
      .then((response) => {
        if (!response.ok) throw new Error('Visitor API unavailable')
        return response.json()
      })
      .then((data) => {
        if (!Number.isFinite(Number(data.value))) {
          fallbackCount()
          return
        }
        setCount(String(data.value).padStart(6, '0'))
      })
      .catch(fallbackCount)
  }, [])

  return (
    <div className="desktop-widget compact-widget visitor-widget">
      <span className="widget-label">VISITORS</span>
      <span className="widget-value">{count}</span>
    </div>
  )
}

export default VisitorWidget
