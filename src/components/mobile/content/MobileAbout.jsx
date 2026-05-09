import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../../data/portfolioData'

const fullText = [portfolioData.about.title, '', ...portfolioData.about.lines].join('\n')

function MobileAbout() {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const bodyRef = useRef(null)

  useEffect(() => {
    let index = 0
    let cursorTimer
    const interval = window.setInterval(() => {
      setDisplayed(fullText.slice(0, index))
      index += 1
      if (index > fullText.length) {
        window.clearInterval(interval)
        cursorTimer = window.setTimeout(() => setShowCursor(false), 2000)
      }
    }, 1)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(cursorTimer)
    }
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [displayed])

  return (
    <pre ref={bodyRef} className="mobile-pre mobile-about-text">
      {displayed}
      {showCursor && <span className="about-cursor">|</span>}
    </pre>
  )
}

export default MobileAbout
