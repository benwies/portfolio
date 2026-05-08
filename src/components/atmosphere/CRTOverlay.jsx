import { useWindowStore } from '../../store/windowStore'

export function CRTOverlay() {
  const crtEnabled = useWindowStore((state) => state.crtEnabled)

  if (!crtEnabled) return null

  return (
    <div aria-hidden="true" style={styles.overlay}>
      <div style={styles.scanlines} />
      <div style={styles.vignette} />
      <div style={styles.flicker} />
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 900,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)',
    opacity: 0.45,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, transparent 48%, rgba(0,0,0,0.46) 100%)',
  },
  flicker: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(115, 255, 148, 0.035)',
  },
}

export default CRTOverlay
