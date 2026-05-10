import { useEffect, useState } from 'react'

const timings = {
  dot: 100,
  expanding: 150,
  full: 200,
  fading: 100,
}

const sequence = ['dot', 'expanding', 'full', 'fading', 'done']

function CRTStartup({ onComplete }) {
  const [phase, setPhase] = useState('dot')

  useEffect(() => {
    let index = 0
    let timer

    const next = () => {
      index += 1

      if (index >= sequence.length) {
        onComplete()
        return
      }

      const nextPhase = sequence[index]
      if (nextPhase === 'done') {
        onComplete()
        return
      }

      setPhase(nextPhase)

      timer = window.setTimeout(next, timings[nextPhase])
    }

    timer = window.setTimeout(next, timings.dot)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="crt-startup" aria-hidden="true">
      <div className={`crt-startup-${phase}`} />
    </div>
  )
}

export default CRTStartup
