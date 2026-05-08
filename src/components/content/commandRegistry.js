import { portfolioData } from '../../data/portfolioData'
import { fileSystem, readFile } from './fileSystem'
import { useWindowStore } from '../../store/windowStore'

const promptPath = (cwd) => cwd.replace('/home/benedikt', '~')

export const runCommand = ({ command, cwd, setCwd }) => {
  const trimmed = command.trim()
  const [base, ...args] = trimmed.split(/\s+/)

  if (!trimmed) return { lines: [] }
  if (trimmed === 'sudo rm -rf /') {
    return { lines: ['permission denied: workstation self-preservation module engaged'] }
  }
  if (base === 'clear') return { clear: true }
  if (base === 'whoami') return { lines: [portfolioData.identity.user.toLowerCase()] }
  if (base === 'pwd') return { lines: [cwd] }
  if (base === 'help') return { lines: portfolioData.commands.help }
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
        '       /\\        benedikt@portfolio',
        '      /  \\       -------------------',
        `     /____\\      OS: ${portfolioData.system.os}`,
        `    /      \\     Role: ${portfolioData.identity.role}`,
        `   /   ,,   \\    Focus: ${portfolioData.system.focus}`,
        `  /___|  |___\\   Shell: ${portfolioData.system.shell}`,
      ],
    }
  }
  if (base === 'nmap' && args[0] === 'contacts') {
    return {
      lines: [
        'PORT     STATE  SERVICE   DETAIL',
        ...portfolioData.contact.map(
          (entry) =>
            `${entry.port.padEnd(8)} ${entry.state.padEnd(6)} ${entry.service.padEnd(9)} ${entry.detail}`,
        ),
      ],
    }
  }
  if (base === 'skills' && args[0] === '--verbose') {
    return {
      lines: portfolioData.skills.feed.map(
        (skill) => `[${skill.level}] ${skill.name.padEnd(24, '.')} ${skill.status}`,
      ),
    }
  }
  if (base === 'open') {
    const app = args[0]
    const match = portfolioData.desktopIcons.find(
      (icon) => icon.appId === app || icon.label.replace(/\/|\.sh|\.pdf/g, '') === app,
    )
    if (!match) return { lines: [`open: unknown app: ${app}`] }
    useWindowStore.getState().openWindow(match.appId)
    return { lines: [`opening ${match.label}`] }
  }
  if (base === 'matrix') {
    useWindowStore.getState().setMatrixMode(true)
    window.setTimeout(() => useWindowStore.getState().setMatrixMode(false), 12000)
    return { lines: ['matrix rain overlay enabled'] }
  }
  if (base === 'hack') {
    return {
      lines: [
        'trace route initialized...',
        'spoofing dramatic terminal output...',
        'uplink refused by ethics module',
        'status: contained',
      ],
    }
  }

  return { lines: [`${base}: command not found. Try help from ${promptPath(cwd)}.`] }
}
