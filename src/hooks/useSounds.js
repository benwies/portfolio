let ctx = null
let interacted = false
let pendingActions = []
let ambientNodes = null
let ambientWanted = false

const getCtx = () => {
  if (typeof window === 'undefined') return null
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  if (!ctx) ctx = new AudioContext()
  return ctx
}

const soundEnabled = () => {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  return localStorage.getItem('sound_enabled') !== 'false'
}

export const unlockAudio = () => {
  if (interacted) return
  interacted = true

  const ac = getCtx()
  if (!ac) return

  const drainQueue = () => {
    pendingActions.forEach((action) => action())
    pendingActions = []
  }

  if (ac.state === 'suspended') {
    ac.resume().then(drainQueue)
    return
  }

  drainQueue()
}

const play = (soundFactory) => {
  if (!soundEnabled()) return
  if (!interacted) {
    pendingActions.push(soundFactory)
    return
  }

  soundFactory()
}

export const playKeyClick = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const bodyBuffer = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate)
  const bodyData = bodyBuffer.getChannelData(0)
  for (let index = 0; index < bodyData.length; index += 1) {
    const time = index / ac.sampleRate
    bodyData[index] = Math.sin(2 * Math.PI * 150 * time) * Math.exp(-time * 60) * 0.5
  }

  const clickBuffer = ac.createBuffer(1, ac.sampleRate * 0.015, ac.sampleRate)
  const clickData = clickBuffer.getChannelData(0)
  for (let index = 0; index < clickData.length; index += 1) {
    const time = index / ac.sampleRate
    clickData[index] = (Math.random() * 2 - 1) * Math.exp(-time * 400) * 0.8
  }

  const bodySource = ac.createBufferSource()
  const bodyGain = ac.createGain()
  bodySource.buffer = bodyBuffer
  bodyGain.gain.setValueAtTime(0.20, ac.currentTime)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05)

  const clickSource = ac.createBufferSource()
  const clickFilter = ac.createBiquadFilter()
  const clickGain = ac.createGain()
  clickSource.buffer = clickBuffer
  clickFilter.type = 'bandpass'
  clickFilter.frequency.value = 3000
  clickFilter.Q.value = 1.5
  clickGain.gain.setValueAtTime(0.12, ac.currentTime)
  clickGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.015)

  bodySource.connect(bodyGain)
  bodyGain.connect(ac.destination)
  clickSource.connect(clickFilter)
  clickFilter.connect(clickGain)
  clickGain.connect(ac.destination)
  bodySource.start()
  clickSource.start()
})

export const playWindowOpen = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const oscillator = ac.createOscillator()
  const filter = ac.createBiquadFilter()
  const gain = ac.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(100, ac.currentTime)
  oscillator.frequency.linearRampToValueAtTime(200, ac.currentTime + 0.15)
  filter.type = 'lowpass'
  filter.frequency.value = 600
  gain.gain.setValueAtTime(0, ac.currentTime)
  gain.gain.linearRampToValueAtTime(0.10, ac.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18)
  oscillator.connect(filter)
  filter.connect(gain)
  gain.connect(ac.destination)
  oscillator.start()
  oscillator.stop(ac.currentTime + 0.18)
})

export const playWindowClose = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const oscillator = ac.createOscillator()
  const filter = ac.createBiquadFilter()
  const gain = ac.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(180, ac.currentTime)
  oscillator.frequency.linearRampToValueAtTime(80, ac.currentTime + 0.12)
  filter.type = 'lowpass'
  filter.frequency.value = 500
  gain.gain.setValueAtTime(0.08, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.14)
  oscillator.connect(filter)
  filter.connect(gain)
  gain.connect(ac.destination)
  oscillator.start()
  oscillator.stop(ac.currentTime + 0.14)
})

export const playMouseClick = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const buffer = ac.createBuffer(1, ac.sampleRate * 0.025, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) {
    const time = index / ac.sampleRate
    data[index] = (Math.random() * 2 - 1) * Math.exp(-time * 220) * 0.35
  }

  const source = ac.createBufferSource()
  const filter = ac.createBiquadFilter()
  const gain = ac.createGain()
  source.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = 1800
  filter.Q.value = 1
  gain.gain.setValueAtTime(0.055, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.025)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ac.destination)
  source.start()
})

export const playBootSound = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const notes = [
    { freq: 261, time: 0 },
    { freq: 329, time: 0.15 },
    { freq: 392, time: 0.30 },
    { freq: 523, time: 0.45 },
  ]

  notes.forEach(({ freq, time }) => {
    const oscillator = ac.createOscillator()
    const filter = ac.createBiquadFilter()
    const gain = ac.createGain()
    const startTime = ac.currentTime + time
    oscillator.type = 'sine'
    oscillator.frequency.value = freq
    filter.type = 'lowpass'
    filter.frequency.value = 2000
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.07, startTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)
    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.5)
  })
})

export const playBootAmbient = () => {
  if (!soundEnabled()) return
  ambientWanted = true

  const startAmbient = () => {
    if (!ambientWanted || ambientNodes) return
    const ac = getCtx()
    if (!ac) return

    const osc1 = ac.createOscillator()
    const osc2 = ac.createOscillator()
    const filter = ac.createBiquadFilter()
    const gain = ac.createGain()

    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(40, ac.currentTime)
    osc1.frequency.linearRampToValueAtTime(60, ac.currentTime + 2)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(80, ac.currentTime)
    osc2.frequency.linearRampToValueAtTime(120, ac.currentTime + 2)
    filter.type = 'lowpass'
    filter.frequency.value = 200
    filter.Q.value = 2
    gain.gain.setValueAtTime(0, ac.currentTime)
    gain.gain.linearRampToValueAtTime(0.06, ac.currentTime + 1.5)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ac.destination)
    osc1.start()
    osc2.start()
    ambientNodes = { gain, osc1, osc2 }
  }

  if (!interacted) {
    pendingActions.push(startAmbient)
    return
  }

  startAmbient()
}

export const stopBootAmbient = () => {
  ambientWanted = false
  if (!ambientNodes) return
  const ac = getCtx()
  if (!ac) return

  const { gain, osc1, osc2 } = ambientNodes
  gain.gain.setValueAtTime(gain.gain.value, ac.currentTime)
  gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8)
  window.setTimeout(() => {
    try {
      osc1.stop()
      osc2.stop()
    } catch {
      // Nodes may already be stopped by the browser if the page is unloading.
    }
    ambientNodes = null
  }, 900)
}
