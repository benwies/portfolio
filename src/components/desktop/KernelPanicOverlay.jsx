import { useEffect } from 'react'

function KernelPanicOverlay({ onDismiss }) {
  useEffect(() => {
    window.addEventListener('keydown', onDismiss)
    window.addEventListener('mousedown', onDismiss)
    return () => {
      window.removeEventListener('keydown', onDismiss)
      window.removeEventListener('mousedown', onDismiss)
    }
  }, [onDismiss])

  return (
    <section className="kernel-panic-overlay" aria-label="Kernel panic">
      <pre>{`    --
  |o_o|
  |:_/ |
 //   \\ \\
(|     | )
/'\\_   _/\`\\
\\___)=(___/     !
                |
               (_)`}</pre>
      <strong>KERNEL PANIC!</strong>
      <p>Please reboot your computer.</p>
      <p>VPS: Unable to mount root fs on unknown-block(0,0)</p>
    </section>
  )
}

export default KernelPanicOverlay
