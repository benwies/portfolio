import { useState } from 'react'
import { useWindowStore } from '../../store/windowStore'
import addressbookIcon from '../../assets/cde-icons/netscape_addressbook.png'
import folderIcon from '../../assets/cde-icons/folder.png'
import settingsIcon from '../../assets/cde-icons/settings.png'
import spreadsheetIcon from '../../assets/cde-icons/oo_spreadsheet.png'
import terminalIcon from '../../assets/cde-icons/terminal.png'
import textIcon from '../../assets/cde-icons/text.png'

const iconFiles = {
  certs: spreadsheetIcon,
  folder: folderIcon,
  skills: settingsIcon,
  socials: addressbookIcon,
  terminal: terminalIcon,
  text: textIcon,
}

export function CdeIcon({ label, type }) {
  const src = iconFiles[type] ?? textIcon

  return <img className="cde-theme-icon" src={src} alt={label ?? ''} draggable="false" />
}

function DesktopIcon({ icon }) {
  const [selected, setSelected] = useState(false)
  const openWindow = useWindowStore((state) => state.openWindow)

  return (
    <button
      type="button"
      className={selected ? 'desktop-icon is-selected' : 'desktop-icon'}
      onClick={() => setSelected(true)}
      onDoubleClick={() => openWindow(icon.appId)}
      aria-label={`Open ${icon.label}`}
    >
      <span className="desktop-icon__glyph">
        <CdeIcon type={icon.icon} label="" />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
