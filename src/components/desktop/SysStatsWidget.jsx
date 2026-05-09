import { useEffect, useState } from 'react'

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const stepValue = (current, min, max) => clamp(current + randomBetween(-15, 15), min, max)

const renderBar = (value) => {
  const filled = Math.round((value / 100) * 12)
  return `[${'|'.repeat(filled)}${'-'.repeat(12 - filled)}]`
}

function SysStatsWidget() {
  const [stats, setStats] = useState({
    cpu: 62,
    ram: 58,
    net: 24,
    dsk: 18,
    proc: 142,
    load: '0.42',
  })

  useEffect(() => {
    const valuesTimer = window.setInterval(() => {
      setStats((current) => ({
        ...current,
        cpu: Math.random() > 0.88 ? 99 : stepValue(current.cpu, 15, 95),
        ram: stepValue(current.ram, 40, 75),
        net: stepValue(current.net, 5, 60),
        dsk: stepValue(current.dsk, 10, 25),
      }))
    }, 2000)
    const procTimer = window.setInterval(() => {
      setStats((current) => ({ ...current, proc: randomBetween(128, 156) }))
    }, 5000)
    const loadTimer = window.setInterval(() => {
      setStats((current) => ({
        ...current,
        load: (Math.round((Math.random() * 1.1 + 0.1) * 100) / 100).toFixed(2),
      }))
    }, 3000)

    return () => {
      window.clearInterval(valuesTimer)
      window.clearInterval(procTimer)
      window.clearInterval(loadTimer)
    }
  }, [])

  const rows = [
    ['CPU', stats.cpu, stats.cpu > 80 ? 'is-hot' : ''],
    ['RAM', stats.ram, stats.ram > 70 ? 'is-warm' : ''],
    ['NET', stats.net, ''],
    ['DSK', stats.dsk, ''],
  ]

  return (
    <div className="desktop-widget sysstats-widget" aria-label="System stats">
      <strong>SYSTEM STATS</strong>
      <span className="sysstats-rule">-------------</span>
      {rows.map(([label, value, className]) => (
        <div className="sysstats-row" key={label}>
          <span>{label}</span>
          <span>{renderBar(value)}</span>
          <span className={className}>{value}%</span>
        </div>
      ))}
      <span className="sysstats-rule">-------------</span>
      <div className="sysstats-meta">PROC: {stats.proc}</div>
      <div className="sysstats-meta">LOAD: {stats.load}</div>
    </div>
  )
}

export default SysStatsWidget
