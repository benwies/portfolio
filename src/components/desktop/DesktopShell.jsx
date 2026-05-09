import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import ClockWidget from './ClockWidget'
import DesktopIcon from './DesktopIcon'
import KernelPanicOverlay from './KernelPanicOverlay'
import SysStatsWidget from './SysStatsWidget'
import Taskbar from './Taskbar'
import TrashIcon from './TrashIcon'
import UptimeWidget from './UptimeWidget'
import VisitorWidget from './VisitorWidget'

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
  const [panicState, setPanicState] = useState('idle')
  const [fakeTerminals, setFakeTerminals] = useState([])

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

  return (
    <div className="desktop-shell">
      <main className="desktop-shell__body">
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

        <div className="widget-stack">
          <SysStatsWidget />
          <ClockWidget />
          <UptimeWidget />
          <VisitorWidget />
        </div>
        <TrashIcon />
        <section className="desktop-windows" aria-label="Open windows">
          {children}
        </section>
        {fakeTerminals.map((terminal) => (
          <FakeTerminal key={terminal.id} terminal={terminal} />
        ))}
      </main>

      <Taskbar />
      {panicState === 'panic' && <KernelPanicOverlay onDismiss={dismissPanic} />}
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
