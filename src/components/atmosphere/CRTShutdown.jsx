import { useEffect, useState } from 'react'

const timings = {
  collapsing: 200,
  line: 150,
  dot: 100,
}

const nextPhase = {
  collapsing: 'line',
  line: 'dot',
  dot: 'done',
}

function CRTShutdown() {
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    const trigger = () => setPhase('collapsing')
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setPhase('idle')
        return
      }

      trigger()
    }

    window.addEventListener('beforeunload', trigger)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('beforeunload', trigger)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    if (!(phase in timings)) return undefined
    const timer = window.setTimeout(() => setPhase(nextPhase[phase]), timings[phase])
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'idle' || phase === 'done') return null

  return (
    <div className="crt-shutdown" aria-hidden="true">
      <div className={`crt-shutdown-${phase}`} />
    </div>
  )
}

export default CRTShutdown
