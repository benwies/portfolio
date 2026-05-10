let ctx = null
let interacted = false
let pendingActions = []
let ambientNodes = null
let ambientWanted = false
let ambientNoiseNodes = null
let ambientNoiseWanted = false
let ambientNoiseTickTimer = null
let screensaverNodes = null
let screensaverWanted = false
const ambientNoiseVolume = 0.024

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

export const playTypeClick = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const pitchVariation = 0.85 + Math.random() * 0.3
  const bodyBuffer = ac.createBuffer(1, ac.sampleRate * 0.045, ac.sampleRate)
  const bodyData = bodyBuffer.getChannelData(0)
  for (let index = 0; index < bodyData.length; index += 1) {
    const time = index / ac.sampleRate
    bodyData[index] = (
      Math.sin(2 * Math.PI * 130 * pitchVariation * time)
      * Math.exp(-time * 70)
      * 0.35
    )
  }

  const tickBuffer = ac.createBuffer(1, ac.sampleRate * 0.012, ac.sampleRate)
  const tickData = tickBuffer.getChannelData(0)
  for (let index = 0; index < tickData.length; index += 1) {
    const time = index / ac.sampleRate
    tickData[index] = (Math.random() * 2 - 1) * Math.exp(-time * 500) * 0.6
  }

  const bodySource = ac.createBufferSource()
  const bodyFilter = ac.createBiquadFilter()
  const bodyGain = ac.createGain()
  bodySource.buffer = bodyBuffer
  bodyFilter.type = 'lowpass'
  bodyFilter.frequency.value = 900
  bodyFilter.Q.value = 0.4
  bodyGain.gain.setValueAtTime(0.13, ac.currentTime)
  bodyGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.045)

  const tickSource = ac.createBufferSource()
  const tickFilter = ac.createBiquadFilter()
  const tickGain = ac.createGain()
  tickSource.buffer = tickBuffer
  tickFilter.type = 'bandpass'
  tickFilter.frequency.value = 2500 * pitchVariation
  tickFilter.Q.value = 1.2
  tickGain.gain.setValueAtTime(0.07, ac.currentTime)
  tickGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.012)

  bodySource.connect(bodyFilter)
  bodyFilter.connect(bodyGain)
  bodyGain.connect(ac.destination)
  tickSource.connect(tickFilter)
  tickFilter.connect(tickGain)
  tickGain.connect(ac.destination)
  bodySource.start()
  tickSource.start()
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

export const playDiskActivity = () => play(() => {
  const ac = getCtx()
  if (!ac) return

  const seekCount = 2 + Math.floor(Math.random() * 3)
  for (let seekIndex = 0; seekIndex < seekCount; seekIndex += 1) {
    const offset = seekIndex * 0.018
    const buffer = ac.createBuffer(1, ac.sampleRate * 0.012, ac.sampleRate)
    const data = buffer.getChannelData(0)

    for (let index = 0; index < data.length; index += 1) {
      const time = index / ac.sampleRate
      data[index] = (
        (Math.random() * 2 - 1)
        * Math.exp(-time * 300)
        * (0.6 + Math.random() * 0.4)
      )
    }

    const source = ac.createBufferSource()
    const filter = ac.createBiquadFilter()
    const shelf = ac.createBiquadFilter()
    const gain = ac.createGain()
    source.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.value = 900 + Math.random() * 600
    filter.Q.value = 2
    shelf.type = 'lowshelf'
    shelf.frequency.value = 400
    shelf.gain.value = 6
    gain.gain.setValueAtTime(0.09, ac.currentTime + offset)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + offset + 0.012)

    source.connect(filter)
    filter.connect(shelf)
    shelf.connect(gain)
    gain.connect(ac.destination)
    source.start(ac.currentTime + offset)
  }
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

export const startAmbientNoise = () => {
  if (!soundEnabled()) return
  if (ambientNoiseNodes) return
  ambientNoiseWanted = true

  const startNoise = () => {
    if (!ambientNoiseWanted || ambientNoiseNodes || !soundEnabled()) return
    const ac = getCtx()
    if (!ac) return

    const hum50 = ac.createOscillator()
    const hum100 = ac.createOscillator()
    const hum150 = ac.createOscillator()
    hum50.type = 'sine'
    hum100.type = 'sine'
    hum150.type = 'sine'
    hum50.frequency.value = 50
    hum100.frequency.value = 100
    hum150.frequency.value = 150

    const humGain50 = ac.createGain()
    const humGain100 = ac.createGain()
    const humGain150 = ac.createGain()
    humGain50.gain.value = 0.5
    humGain100.gain.value = 0.2
    humGain150.gain.value = 0.08

    const sampleRate = ac.sampleRate
    const fanBufferSize = sampleRate * 8
    const fanBuffer = ac.createBuffer(1, fanBufferSize, sampleRate)
    const fanData = fanBuffer.getChannelData(0)
    let lastOut = 0
    for (let index = 0; index < fanBufferSize; index += 1) {
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + 0.02 * white) / 1.02
      fanData[index] = lastOut * 3.5
    }

    let maxValue = 0
    for (let index = 0; index < fanBufferSize; index += 1) {
      maxValue = Math.max(maxValue, Math.abs(fanData[index]))
    }
    if (maxValue > 0) {
      for (let index = 0; index < fanBufferSize; index += 1) {
        fanData[index] = (fanData[index] / maxValue) * 0.8
      }
    }

    const fanSource = ac.createBufferSource()
    fanSource.buffer = fanBuffer
    fanSource.loop = true

    const fanFilter1 = ac.createBiquadFilter()
    const fanFilter2 = ac.createBiquadFilter()
    fanFilter1.type = 'lowpass'
    fanFilter1.frequency.value = 250
    fanFilter1.Q.value = 0.3
    fanFilter2.type = 'lowpass'
    fanFilter2.frequency.value = 180
    fanFilter2.Q.value = 0.2

    const fanGain = ac.createGain()
    fanGain.gain.value = 0.5

    const masterGain = ac.createGain()
    masterGain.gain.setValueAtTime(0, ac.currentTime)
    masterGain.gain.linearRampToValueAtTime(ambientNoiseVolume, ac.currentTime + 4)

    const scheduleHDDTick = () => {
      const tickDelay = 2000 + Math.random() * 3000
      ambientNoiseTickTimer = window.setTimeout(() => {
        if (!ambientNoiseNodes || !ambientNoiseWanted) return

        const tickBuffer = ac.createBuffer(1, sampleRate * 0.025, sampleRate)
        const tickData = tickBuffer.getChannelData(0)
        for (let index = 0; index < tickData.length; index += 1) {
          const time = index / sampleRate
          tickData[index] = (Math.random() * 2 - 1) * Math.exp(-time * 300) * 0.3
        }

        const tickSource = ac.createBufferSource()
        const tickFilter = ac.createBiquadFilter()
        const tickGain = ac.createGain()
        tickSource.buffer = tickBuffer
        tickFilter.type = 'bandpass'
        tickFilter.frequency.value = 800
        tickFilter.Q.value = 1.5
        tickGain.gain.value = 0.045
        tickSource.connect(tickFilter)
        tickFilter.connect(tickGain)
        tickGain.connect(ac.destination)
        tickSource.start()
        scheduleHDDTick()
      }, tickDelay)
    }

    hum50.connect(humGain50)
    humGain50.connect(masterGain)
    hum100.connect(humGain100)
    humGain100.connect(masterGain)
    hum150.connect(humGain150)
    humGain150.connect(masterGain)
    fanSource.connect(fanFilter1)
    fanFilter1.connect(fanFilter2)
    fanFilter2.connect(fanGain)
    fanGain.connect(masterGain)
    masterGain.connect(ac.destination)

    hum50.start()
    hum100.start()
    hum150.start()
    fanSource.start()
    ambientNoiseNodes = {
      masterGain,
      noiseSource: fanSource,
      osc1: hum50,
      osc2: hum100,
      osc3: hum150,
    }
    scheduleHDDTick()
  }

  if (!interacted) {
    pendingActions.push(startNoise)
    return
  }

  startNoise()
}

export const stopAmbientNoise = () => {
  ambientNoiseWanted = false
  if (ambientNoiseTickTimer) {
    window.clearTimeout(ambientNoiseTickTimer)
    ambientNoiseTickTimer = null
  }
  if (!ambientNoiseNodes) return
  const ac = getCtx()
  if (!ac) return

  const {
    masterGain,
    noiseSource,
    osc1,
    osc2,
    osc3,
  } = ambientNoiseNodes
  masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime)
  masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8)
  window.setTimeout(() => {
    try {
      osc1.stop()
      osc2.stop()
      osc3.stop()
      noiseSource.stop()
    } catch {
      // Nodes may already be stopped by the browser.
    }
    ambientNoiseNodes = null
  }, 900)
}

export const startScreensaverSound = () => {
  if (!soundEnabled() || screensaverNodes) return
  screensaverWanted = true

  const startSound = () => {
    if (!screensaverWanted || screensaverNodes || !soundEnabled()) return
    const ac = getCtx()
    if (!ac) return

    const osc1 = ac.createOscillator()
    const osc2 = ac.createOscillator()
    const osc3 = ac.createOscillator()
    const gain1 = ac.createGain()
    const gain2 = ac.createGain()
    const gain3 = ac.createGain()
    const masterGain = ac.createGain()

    osc1.type = 'sine'
    osc2.type = 'sine'
    osc3.type = 'triangle'
    osc1.frequency.value = 38
    osc2.frequency.value = 42
    osc3.frequency.value = 76
    gain1.gain.value = 0.5
    gain2.gain.value = 0.4
    gain3.gain.value = 0.2
    masterGain.gain.setValueAtTime(0, ac.currentTime)
    masterGain.gain.linearRampToValueAtTime(0.035, ac.currentTime + 2)

    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc3.connect(gain3)
    gain3.connect(masterGain)
    masterGain.connect(ac.destination)

    osc1.start()
    osc2.start()
    osc3.start()
    screensaverNodes = {
      masterGain,
      osc1,
      osc2,
      osc3,
    }
  }

  if (!interacted) {
    pendingActions.push(startSound)
    return
  }

  startSound()
}

export const stopScreensaverSound = () => {
  screensaverWanted = false
  if (!screensaverNodes) return
  const ac = getCtx()
  if (!ac) return

  const {
    masterGain,
    osc1,
    osc2,
    osc3,
  } = screensaverNodes
  masterGain.gain.cancelScheduledValues(ac.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime)
  masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + 1.5)
  window.setTimeout(() => {
    try {
      osc1.stop()
      osc2.stop()
      osc3.stop()
    } catch {
      // Nodes may already be stopped by the browser.
    }
    screensaverNodes = null
  }, 1600)
}

export const pauseAmbientNoise = () => {
  if (!ambientNoiseNodes) return
  const ac = getCtx()
  if (!ac) return

  const { masterGain } = ambientNoiseNodes
  masterGain.gain.cancelScheduledValues(ac.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime)
  masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3)
}

export const resumeAmbientNoise = () => {
  if (!ambientNoiseNodes || !ambientNoiseWanted || !soundEnabled()) return
  const ac = getCtx()
  if (!ac) return

  const { masterGain } = ambientNoiseNodes
  masterGain.gain.cancelScheduledValues(ac.currentTime)
  masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime)
  masterGain.gain.linearRampToValueAtTime(ambientNoiseVolume, ac.currentTime + 0.5)
}

export const isAmbientNoiseRunning = () => ambientNoiseNodes !== null
