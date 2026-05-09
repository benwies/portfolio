import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'

const { about } = portfolioData
const fullText = [about.title, '', ...about.lines].join('\n')

function AboutWindow() {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(true)
  const bodyRef = useRef(null)

  useEffect(() => {
    let index = 0
    let cursorTimer

    const interval = window.setInterval(() => {
      setDisplayed(fullText.slice(0, index))
      index += 1
      if (index > fullText.length) {
        window.clearInterval(interval)
        setIsTyping(false)
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
    <section className="content-window about-window">
      <div className="dtpad-document">
        <header className="dtpad-toolbar">
          {about.toolbar.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </header>
        <div ref={bodyRef} className={isTyping ? 'dtpad-area about-typing is-typing' : 'dtpad-area about-typing'}>
          <pre>
            {displayed}
            {showCursor && <span className="about-cursor">|</span>}
          </pre>
        </div>
      </div>
    </section>
  )
}

export default AboutWindow
