import { useCallback, useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { playBootAmbient, playBootSound, stopBootAmbient, unlockAudio } from '../../hooks/useSounds'
import { useWindowStore } from '../../store/windowStore'

const lineDelay = 260

export function BootSequence() {
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const setBootComplete = useWindowStore((state) => state.setBootComplete)
  const [shownLines, setShownLines] = useState(0)
  const { bootLines, ui } = portfolioData

  const finishBoot = useCallback((delay = 260) => {
    stopBootAmbient()
    playBootSound()
    setTimeout(() => setBootComplete(true), delay)
  }, [setBootComplete])

  useEffect(() => {
    playBootAmbient()
    return () => stopBootAmbient()
  }, [])

  useEffect(() => {
    if (bootComplete) return undefined
    if (shownLines >= bootLines.length) {
      const doneTimer = setTimeout(() => finishBoot(), 1100)
      return () => clearTimeout(doneTimer)
    }

    const timer = setTimeout(() => setShownLines((count) => count + 1), lineDelay)
    return () => clearTimeout(timer)
  }, [bootComplete, bootLines.length, finishBoot, shownLines])

  useEffect(() => {
    if (bootComplete) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        finishBoot()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bootComplete, finishBoot])

  if (bootComplete) return null

  return (
    <div className="boot-sequence">
      <div className="boot-sequence__header">
        <span>{ui.bootTitle}</span>
        <button
          type="button"
          className="boot-sequence__skip"
          onClick={() => {
            unlockAudio()
            finishBoot()
          }}
        >
          {ui.bootSkip}
        </button>
      </div>
      <div className="boot-sequence__lines" aria-live="polite">
        {bootLines.slice(0, shownLines).map((line, index) => (
          <div key={`${line}-${index}`}>
            {line}
            {index === bootLines.length - 1 && shownLines >= bootLines.length ? (
              <span className="boot-sequence__cursor">_</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BootSequence
