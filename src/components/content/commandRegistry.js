import { portfolioData } from '../../data/portfolioData'
import {
  getDetailedListing,
  getDirectoryContents,
  normalizeDir,
  readFile,
  readFileText,
} from './fileSystem'
import { useWindowStore } from '../../store/windowStore'
import { playWindowClose } from '../../hooks/useSounds'

const promptPath = (cwd) => cwd.replace('/home/benedikt', '~')

const displayPath = (cwd) => {
  if (cwd === '/home/benedikt') return '~'
  if (cwd === '/tmp') return '/tmp'
  if (cwd.startsWith('/home/benedikt/')) return `~/${cwd.replace('/home/benedikt/', '')}`
  return cwd
}

const formatNeofetch = () => {
  const { ascii, rows } = portfolioData.neofetch
  const header = [
    'benedikt@0xbene',
    '---------------------------',
    ...rows.map(([key, value]) => `${key}:`.padEnd(8, ' ') + value),
  ]
  const width = Math.max(...ascii.map((line) => line.length)) + 5
  const length = Math.max(ascii.length, header.length)

  return Array.from({ length }, (_, index) => {
    const left = ascii[index] ?? ''
    const right = header[index] ?? ''
    return left.padEnd(width, ' ') + right
  })
}

export const runCommand = ({ command, cwd, setCwd }) => {
  const trimmed = command.trim()
  const [base, ...args] = trimmed.split(/\s+/)

  if (!trimmed) return { lines: [] }
  if (base === 'clear') return { clear: true }
  if (base === 'exit' || base === 'quit') {
    playWindowClose()
    useWindowStore.getState().closeWindow('terminal')
    return null
  }
  if (base === 'reset' && args[0] === 'desktop') {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('icon_grid_') || key.startsWith('icon_pos_'))
      .forEach((key) => localStorage.removeItem(key))
    window.location.reload()
    return { lines: ['desktop icon positions reset'] }
  }
  if (base === 'whoami') return { lines: [portfolioData.identity.user] }
  if (base === 'pwd') return { lines: [cwd] }
  if (base === 'help') return { lines: portfolioData.terminal.help }
  if (base === 'ls') {
    const showHidden = args.includes('-la') || args.includes('-a') || args.includes('-al')
    const contents = getDirectoryContents(cwd, showHidden)
    if (!contents) return { lines: [`ls: cannot access '${displayPath(cwd)}': No such directory`] }
    if (showHidden) return { lines: getDetailedListing(cwd) }
    return { lines: [contents.join('  ')] }
  }
  if (base === 'cat') {
    const filename = args[0]
    if (!filename) return { lines: ['Usage: cat [file]'] }
    return { lines: readFile(filename, cwd) }
  }
  if (base === 'grep') {
    const [pattern, filename] = args
    if (!pattern) return { lines: ['Usage: grep pattern [file]'] }
    if (!filename) return { lines: ['Usage: grep pattern file'] }
    const content = readFileText(filename, cwd)
    if (!content) return { lines: [`grep: ${filename}: No such file or directory`] }
    return {
      lines: content
        .split('\n')
        .filter((line) => line.toLowerCase().includes(pattern.toLowerCase())),
    }
  }
  if (base === 'cd') {
    const target = args[0] ?? '/home/benedikt'
    if (!target || target === '~' || target === '/home/benedikt') {
      setCwd('/home/benedikt')
      return { lines: [] }
    }
    if (target === '..') {
      setCwd('/home/benedikt')
      return { lines: [] }
    }

    const next = normalizeDir(
      target.startsWith('/')
        ? target
        : cwd === '/home/benedikt'
          ? target.replace(/\/$/, '')
          : `${cwd}/${target.replace(/\/$/, '')}`,
    )
    if (!getDirectoryContents(next)) return { lines: [`cd: ${target}: No such file or directory`] }
    setCwd(next)
    return { lines: [] }
  }
  if (base === 'neofetch') {
    return {
      lines: [...formatNeofetch(), '', '#'],
    }
  }
  if (base === 'nmap' && args[0] === 'contacts') {
    return {
      lines: [
        portfolioData.socials.headers.join('    '),
        ...portfolioData.socials.rows.map((row) =>
          Array.isArray(row) ? row.join('    ') : `${row.port}    ${row.service}    ${row.link}`,
        ),
      ],
    }
  }
  if (base === 'skills' && args[0] === '--verbose') {
    return {
      lines: portfolioData.skills.sections.flatMap((section) => [
        `[${section.name}]`,
        ...section.lines,
      ]),
    }
  }
  if (base === 'open') {
    const app = args[0]
    const match = portfolioData.desktopIcons.find(
      (icon) =>
        icon.appId === app ||
        icon.label === app ||
        icon.label.replace(/\/|\.(txt|db|csv|ini|pdf)$/g, '') === app,
    )
    if (!match) return { lines: [`open: unknown app: ${app}`] }
    if (!match.appId) return { lines: [`open: ${match.label} is not a windowed app`] }
    useWindowStore.getState().openWindow(match.appId)
    return { lines: [`opening ${match.label}`] }
  }
  return { lines: [`${base}: command not found. Try help from ${promptPath(cwd)}.`] }
}
