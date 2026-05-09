import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import ClockWidget from './ClockWidget'
import CronNotification from './CronNotification'
import ContextMenu from './ContextMenu'
import DesktopIcon from './DesktopIcon'
import KernelPanicOverlay from './KernelPanicOverlay'
import ScreensaverOverlay from './ScreensaverOverlay'
import SysStatsWidget from './SysStatsWidget'
import Taskbar from './Taskbar'
import TrashIcon from './TrashIcon'
import UptimeWidget from './UptimeWidget'
import VisitorWidget from './VisitorWidget'
import { useWindowStore } from '../../store/windowStore'

const fakeTerminalTitles = ['bash', 'sh', 'root@0xbene', 'exploit.sh', 'payload.sh', 'dropper']
const fakeTerminalLines = [
  'rm -rf /home/benedikt',
  'encrypting files... done',
  'connecting to 192.168.0.1',
  'bypass firewall... OK',
  'downloading payload...',
  'root access granted',
  'deleting logs...',
  'spreading to network...',
  '0xDEADBEEF',
  'kernel module loaded',
  'process injected',
]

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const idleTimeout = 60000

function createFakeTerminal(index) {
  const width = randomBetween(260, 380)
  const height = randomBetween(160, 240)
  return {
    id: `fake-terminal-${Date.now()}-${index}`,
    title: fakeTerminalTitles[randomBetween(0, fakeTerminalTitles.length - 1)],
    width,
    height,
    x: randomBetween(0, Math.max(0, window.innerWidth - width)),
    y: randomBetween(0, Math.max(0, window.innerHeight - height - 64)),
  }
}

function DesktopShell({ children }) {
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const [panicState, setPanicState] = useState('idle')
  const [fakeTerminals, setFakeTerminals] = useState([])
  const [menu, setMenu] = useState(null)
  const [screensaverActive, setScreensaverActive] = useState(false)
  const desktopRef = useRef(null)
  const windowLayerRef = useRef(null)

  useEffect(() => {
    if (!bootComplete) return undefined
    let timer

    const resetTimer = () => {
      window.clearTimeout(timer)
      setScreensaverActive(false)
      timer = window.setTimeout(() => setScreensaverActive(true), idleTimeout)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('mousedown', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('touchstart', resetTimer)
    timer = window.setTimeout(() => setScreensaverActive(true), idleTimeout)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('mousedown', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
    }
  }, [bootComplete])

  useEffect(() => {
    if (panicState !== 'animating') return undefined
    const timers = []
    const count = randomBetween(12, 16)

    for (let index = 0; index < count; index += 1) {
      timers.push(window.setTimeout(() => {
        setFakeTerminals((current) => [...current, createFakeTerminal(index)])
      }, index * randomBetween(100, 150)))
    }

    timers.push(window.setTimeout(() => {
      setFakeTerminals([])
      setPanicState('panic')
    }, 2500))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [panicState])

  const triggerKernelPanic = () => {
    if (panicState !== 'idle') return
    setFakeTerminals([])
    setPanicState('animating')
  }

  const dismissPanic = () => {
    setFakeTerminals([])
    setPanicState('idle')
  }

  const handleContextMenu = (event) => {
    if (![desktopRef.current, windowLayerRef.current].includes(event.target)) return
    event.preventDefault()
    setMenu({ x: event.clientX, y: event.clientY })
  }

  const closeMenu = () => setMenu(null)

  return (
    <div className="desktop-shell">
      {bootComplete && (
        <>
          <main
            className="desktop-shell__body"
            ref={desktopRef}
            onClick={closeMenu}
            onContextMenu={handleContextMenu}
          >
            <nav className="desktop-icons" aria-label="Desktop icons">
              {portfolioData.desktopIcons.map((icon, index) => (
                <DesktopIcon
                  key={icon.id}
                  icon={icon}
                  index={index}
                  icons={portfolioData.desktopIcons}
                  onKernelPanic={triggerKernelPanic}
                />
              ))}
            </nav>

            <div className="desktop-widget-zone">
              <SysStatsWidget />
              <div className="widget-stack">
                <ClockWidget />
                <UptimeWidget />
                <VisitorWidget />
              </div>
            </div>
            <TrashIcon />
            <section className="desktop-windows" ref={windowLayerRef} aria-label="Open windows">
              {children}
            </section>
            {fakeTerminals.map((terminal) => (
              <FakeTerminal key={terminal.id} terminal={terminal} />
            ))}
            {menu ? <ContextMenu position={menu} onClose={closeMenu} /> : null}
          </main>

          <Taskbar />
          <CronNotification />
          {screensaverActive ? (
            <ScreensaverOverlay onDeactivate={() => setScreensaverActive(false)} />
          ) : null}
          {panicState === 'panic' && <KernelPanicOverlay onDismiss={dismissPanic} />}
        </>
      )}
    </div>
  )
}

function FakeTerminal({ terminal }) {
  const [output, setOutput] = useState([])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOutput((current) => [
        ...current.slice(-8),
        fakeTerminalLines[randomBetween(0, fakeTerminalLines.length - 1)],
      ])
    }, 80)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section
      className="fake-terminal"
      style={{
        width: terminal.width,
        height: terminal.height,
        transform: `translate(${terminal.x}px, ${terminal.y}px)`,
      }}
      aria-hidden="true"
    >
      <header>{terminal.title}</header>
      <pre>{output.join('\n')}</pre>
    </section>
  )
}

export default DesktopShell
