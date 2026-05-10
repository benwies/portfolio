import { isSoundEnabled } from '../store/soundStore'

let ctx = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  if (!ctx) ctx = new AudioContext()
  return ctx
}

const shouldPlay = () => isSoundEnabled()

export const resumeAudioContext = () => {
  if (!ctx || ctx.state !== 'suspended') return
  ctx.resume()
}

export const playKeyClick = () => {
  if (!shouldPlay()) return
  const ac = getAudioContext()
  if (!ac) return

  const buffer = ac.createBuffer(1, ac.sampleRate * 0.04, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / data.length) ** 8
  }

  const source = ac.createBufferSource()
  const gain = ac.createGain()
  source.buffer = buffer
  gain.gain.setValueAtTime(0.15, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04)
  source.connect(gain)
  gain.connect(ac.destination)
  source.start()
}

export const playWindowOpen = () => {
  if (!shouldPlay()) return
  const ac = getAudioContext()
  if (!ac) return

  const oscillator = ac.createOscillator()
  const gain = ac.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(180, ac.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.08)
  gain.gain.setValueAtTime(0.12, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12)
  oscillator.connect(gain)
  gain.connect(ac.destination)
  oscillator.start()
  oscillator.stop(ac.currentTime + 0.12)
}

export const playWindowClose = () => {
  if (!shouldPlay()) return
  const ac = getAudioContext()
  if (!ac) return

  const oscillator = ac.createOscillator()
  const gain = ac.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(220, ac.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(100, ac.currentTime + 0.06)
  gain.gain.setValueAtTime(0.10, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
  oscillator.connect(gain)
  gain.connect(ac.destination)
  oscillator.start()
  oscillator.stop(ac.currentTime + 0.08)
}

export const playBootSound = () => {
  if (!shouldPlay()) return
  const ac = getAudioContext()
  if (!ac) return

  const notes = [523, 659, 784]
  notes.forEach((frequency, index) => {
    const oscillator = ac.createOscillator()
    const gain = ac.createGain()
    const startTime = ac.currentTime + index * 0.12

    oscillator.type = 'square'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25)
    oscillator.connect(gain)
    gain.connect(ac.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.25)
  })
}
