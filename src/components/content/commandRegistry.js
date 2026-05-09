import { portfolioData } from '../../data/portfolioData'
import { fileSystem, readFile } from './fileSystem'
import { useWindowStore } from '../../store/windowStore'

const promptPath = (cwd) => cwd.replace('/home/benedikt', '~')

export const runCommand = ({ command, cwd, setCwd }) => {
  const trimmed = command.trim()
  const [base, ...args] = trimmed.split(/\s+/)

  if (!trimmed) return { lines: [] }
  if (base === 'clear') return { clear: true }
  if (base === 'reset' && args[0] === 'desktop') {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('icon_pos_'))
      .forEach((key) => localStorage.removeItem(key))
    window.location.reload()
    return { lines: ['desktop icon positions reset'] }
  }
  if (base === 'whoami') return { lines: [portfolioData.identity.user] }
  if (base === 'pwd') return { lines: [cwd] }
  if (base === 'help') return { lines: portfolioData.terminal.help }
  if (base === 'ls') return { lines: fileSystem[cwd]?.files ?? [] }
  if (base === 'cat') return { lines: readFile(args[0]) }
  if (base === 'cd') {
    const target = args[0] ?? '/home/benedikt'
    const next =
      target === '..'
        ? '/home/benedikt'
        : target.startsWith('/')
          ? target
          : `/home/benedikt/${target.replace(/\/$/, '')}`
    if (!fileSystem[next]) return { lines: [`cd: no such directory: ${target}`] }
    setCwd(next)
    return { lines: [] }
  }
  if (base === 'neofetch') {
    return {
      lines: [
        '        .          benedikt@0xbene',
        '       / \\         ---------------',
        '      /___\\        OS: SunOS 5.11 (Solaris)',
        '     /     \\       WM: dtwm',
        '    /_______\\      Shell: /bin/ksh',
      ],
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
    useWindowStore.getState().openWindow(match.appId)
    return { lines: [`opening ${match.label}`] }
  }
  return { lines: [`${base}: command not found. Try help from ${promptPath(cwd)}.`] }
}
