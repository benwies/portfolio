import { useWindowStore } from '../../store/windowStore'
import { useState } from 'react'

function FolderIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M9 24h54v35H9z" fill="#c79028" stroke="#111" strokeWidth="2" />
      <path d="M9 18h20l6 6h28v10H9z" fill="#e8b84b" stroke="#111" strokeWidth="2" />
      <path d="M12 28h48v27H12z" fill="#e8b84b" />
      <path d="M14 31h44" stroke="#ffe58a" strokeWidth="3" />
      <path d="M61 35v23H18" stroke="#76551a" strokeWidth="4" fill="none" />
    </svg>
  )
}

function TextIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M17 8h31l8 8v48H17z" fill="#fff" stroke="#111" strokeWidth="2" />
      <path d="M48 8v10h10" fill="#c8d8e0" stroke="#111" strokeWidth="2" />
      <path d="M24 24h25M24 31h27M24 38h25M24 45h21M24 52h27" stroke="#286fb0" strokeWidth="3" />
      <path d="M20 11h25" stroke="#ddeeff" strokeWidth="3" />
    </svg>
  )
}

function SocialsIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <ellipse cx="36" cy="16" rx="22" ry="8" fill="#1e5f45" stroke="#111" strokeWidth="2" />
      <path d="M14 16v34c0 5 10 9 22 9s22-4 22-9V16" fill="#2f7658" stroke="#111" strokeWidth="2" />
      <ellipse cx="36" cy="50" rx="22" ry="9" fill="#245f48" stroke="#111" strokeWidth="2" />
      <path d="M15 27c4 5 37 5 42 0M15 39c4 5 37 5 42 0" stroke="#9fbfcf" strokeWidth="3" fill="none" />
      <rect x="26" y="31" width="20" height="13" fill="#ddeeff" stroke="#111" strokeWidth="2" />
      <text x="36" y="41" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#111">DB</text>
    </svg>
  )
}

function CertsIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <rect x="10" y="12" width="52" height="48" fill="#fff" stroke="#111" strokeWidth="2" />
      <rect x="10" y="12" width="52" height="11" fill="#2d77bf" stroke="#111" strokeWidth="2" />
      <path d="M10 35h52M10 47h52M23 23v37M39 23v37" stroke="#3a6070" strokeWidth="2" />
      <path d="M15 17h10M30 17h10M45 17h11" stroke="#ddeeff" strokeWidth="2" />
    </svg>
  )
}

function SkillsIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <path
        d="M36 8l5 9 10-2 3 10 9 5-5 9 5 9-9 5-3 10-10-2-5 9-5-9-10 2-3-10-9-5 5-9-5-9 9-5 3-10 10 2z"
        fill="#9fbfcf"
        stroke="#111"
        strokeWidth="2"
      />
      <circle cx="36" cy="36" r="17" fill="#c8d8e0" stroke="#3a6070" strokeWidth="3" />
      <circle cx="36" cy="36" r="7" fill="#5f8fa0" stroke="#111" strokeWidth="2" />
      <path d="M24 36h24M36 24v24" stroke="#ddeeff" strokeWidth="2" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M17 8h31l8 8v48H17z" fill="#fff" stroke="#111" strokeWidth="2" />
      <path d="M48 8v10h10" fill="#c8d8e0" stroke="#111" strokeWidth="2" />
      <path d="M24 28h24M24 36h20M24 44h24M24 52h15" stroke="#3a6070" strokeWidth="3" />
      <rect x="39" y="14" width="22" height="15" fill="#c51616" stroke="#111" strokeWidth="2" />
      <text x="50" y="25" textAnchor="middle" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#fff">PDF</text>
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <rect x="10" y="12" width="52" height="42" fill="#111" stroke="#3a6070" strokeWidth="5" />
      <rect x="14" y="16" width="44" height="34" fill="#000" stroke="#ddeeff" strokeWidth="2" />
      <path d="M22 27l8 6-8 6M34 41h13" stroke="#40ff40" strokeWidth="4" fill="none" />
      <rect x="48" y="38" width="7" height="4" fill="#40ff40" />
      <path d="M10 56h52" stroke="#111" strokeWidth="3" />
    </svg>
  )
}

export function CdeIcon({ type }) {
  const iconType = {
    script: 'skills',
    logs: 'text',
    network: 'socials',
  }[type] ?? type

  const icons = {
    folder: FolderIcon,
    text: TextIcon,
    socials: SocialsIcon,
    certs: CertsIcon,
    skills: SkillsIcon,
    pdf: PdfIcon,
    terminal: TerminalIcon,
  }
  const Icon = icons[iconType] ?? TextIcon
  return <Icon />
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
        <CdeIcon type={icon.icon} />
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>
  )
}

export default DesktopIcon
