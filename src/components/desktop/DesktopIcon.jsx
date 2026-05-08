import { useWindowStore } from '../../store/windowStore'

export function CdeIcon({ type }) {
  const iconType = {
    script: 'skills',
    logs: 'text',
    network: 'socials',
  }[type] ?? type

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" fill="#bdbdbd" stroke="#111" />
      <path d="M5 5h38M5 5v38" stroke="#fff" />
      <path d="M5 43h38V5" stroke="#555" />
      {iconType === 'folder' && (
        <>
          <path d="M8 18h32v20H8z" fill="#d7a021" stroke="#111" />
          <path d="M8 14h13l4 4h15v5H8z" fill="#f2cc5c" stroke="#111" />
          <path d="M10 22h28v3H10z" fill="#fff4a0" />
        </>
      )}
      {iconType === 'text' && (
        <>
          <path d="M13 8h19l5 5v27H13z" fill="#fff" stroke="#111" />
          <path d="M32 8v6h6" fill="#d8d8d8" stroke="#111" />
          <path d="M17 18h16M17 23h16M17 28h13M17 33h15" stroke="#111" />
        </>
      )}
      {iconType === 'socials' && (
        <>
          <rect x="10" y="11" width="13" height="11" fill="#72c7d0" stroke="#111" />
          <rect x="25" y="11" width="13" height="11" fill="#6f93c8" stroke="#111" />
          <path d="M17 23v6h14v-6M24 29v7" stroke="#111" strokeWidth="2" fill="none" />
          <rect x="18" y="36" width="12" height="4" fill="#555" stroke="#111" />
        </>
      )}
      {iconType === 'certs' && (
        <>
          <path d="M24 8l13 5v10c0 8-5 13-13 17-8-4-13-9-13-17V13z" fill="#8795a1" stroke="#111" />
          <path d="M24 12l9 3v8c0 5-3 9-9 12z" fill="#2d77bf" />
          <path d="M24 12l-9 3v8c0 5 3 9 9 12z" fill="#ddd" />
        </>
      )}
      {iconType === 'skills' && (
        <>
          <rect x="11" y="10" width="26" height="28" fill="#222" stroke="#111" />
          <path d="M15 17l5 4-5 4M22 27h11" stroke="#40ff40" strokeWidth="3" fill="none" />
          <rect x="13" y="12" width="22" height="3" fill="#777" />
        </>
      )}
      {iconType === 'pdf' && (
        <>
          <path d="M13 8h19l5 5v27H13z" fill="#fff" stroke="#111" />
          <path d="M32 8v6h6" fill="#d8d8d8" stroke="#111" />
          <rect x="16" y="27" width="19" height="8" fill="#c51616" />
          <path d="M18 33v-4h3M24 33v-4h3v4M31 33v-4h4" stroke="#fff" fill="none" />
        </>
      )}
      {iconType === 'terminal' && (
        <>
          <rect x="9" y="10" width="30" height="27" fill="#111" stroke="#eee" />
          <path d="M14 18l5 4-5 4M22 29h10" stroke="#ddd" strokeWidth="3" fill="none" />
        </>
      )}
    </svg>
  )
}

function DesktopIcon({ icon }) {
  const openWindow = useWindowStore((state) => state.openWindow)

  return (
    <button
      type="button"
      className="desktop-icon"
      onDoubleClick={() => openWindow(icon.appId)}
      aria-label={`Open ${icon.label}`}
    >
      <span className="desktop-icon__glyph">
        <CdeIcon type={icon.icon} />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
