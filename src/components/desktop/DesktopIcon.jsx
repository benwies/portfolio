import { useWindowStore } from '../../store/windowStore'

const iconGlyphs = {
  folder: '[DIR]',
  script: '>_',
  pdf: 'PDF',
  terminal: '$',
  network: 'NET',
  logs: 'LOG',
}

function DesktopIcon({ icon }) {
  const openWindow = useWindowStore((state) => state.openWindow)
  const glyph = iconGlyphs[icon.icon] ?? 'APP'

  return (
    <button
      type="button"
      className="desktop-icon"
      onClick={() => openWindow(icon.appId)}
      onDoubleClick={() => openWindow(icon.appId)}
      aria-label={`Open ${icon.label}`}
    >
      <span className={`desktop-icon__glyph desktop-icon__glyph--${icon.icon}`}>
        {glyph}
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
