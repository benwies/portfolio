export const portfolioData = {
  identity: {
    user: 'benedikt',
    host: '0xbene',
    prompt: 'benedikt@0xbene:~$',
  },
  ui: {
    clockLabel: 'Clock',
    workspaceLabel: 'Workspaces',
    motdOk: 'OK',
    menuButton: '-',
    minimizeButton: '_',
    maximizeButton: '□',
    closeButton: 'X',
    windowMenuLabel: 'Window menu',
    minimizeLabel: 'Minimize',
    maximizeLabel: 'Maximize',
    closeLabel: 'Close',
    terminalCommandLabel: 'Terminal command',
    bootTitle: 'CDE boot',
    bootSkip: 'Skip',
    launcherLabel: 'Front Panel Launchers',
  },
  motd: {
    title: 'Message of the Day',
    body: '// TODO: Add welcome message',
  },
  about: {
    title: 'about.txt',
    toolbar: ['File', 'Edit', 'Help'],
    lines: [
      '// TODO: Replace with bio text',
      'Name:',
      'Role:',
      'Location:',
      'About:',
    ],
  },
  socials: {
    title: 'socials.db',
    headers: ['PORT', 'SERVICE', 'LINK'],
    rows: [
      // TODO: Add social links
    ],
  },
  certs: {
    title: 'certs.csv',
    headers: ['Name', 'Issuer', 'Date', 'Link'],
    rows: [
      // TODO: Add certifications
    ],
  },
  projects: {
    title: 'projects/',
    emptyText: '// TODO: Add projects',
    countLabel: 'folders',
    githubLabel: 'GitHub',
    items: [
      // TODO: Add projects
    ],
  },
  skills: {
    title: 'skills.ini',
    sections: [
      { name: 'Defensive Security', lines: ['; TODO: Add skills'] },
      { name: 'Linux', lines: ['; TODO: Add skills'] },
      { name: 'Tools', lines: ['; TODO: Add skills'] },
    ],
  },
  terminal: {
    title: 'terminal',
    banner: 'CDE xterm - 0xbene',
    hint: 'Type help for available commands.',
    help: ['whoami', 'ls', 'cat [file]', 'cd', 'help', 'clear', 'neofetch', 'nmap contacts', 'skills --verbose', 'open [app]'],
    files: ['README.md', 'about.txt', 'socials.db', 'certs.csv', 'projects/', 'skills.ini'],
  },
  desktopIcons: [
    { id: 'projects', label: 'projects/', appId: 'projects', icon: 'folder' },
    { id: 'about', label: 'about.txt', appId: 'about', icon: 'text' },
    { id: 'socials', label: 'socials.db', appId: 'socials', icon: 'socials' },
    { id: 'certs', label: 'certs.csv', appId: 'certs', icon: 'certs' },
    { id: 'skills', label: 'skills.ini', appId: 'skills', icon: 'skills' },
    { id: 'resume', label: 'resume.pdf', appId: 'about', icon: 'pdf' },
    { id: 'terminal', label: 'terminal', appId: 'terminal', icon: 'terminal' },
  ],
  bootLines: [
    'SunOS Release 5.8 Version Generic_108528-29 64-bit',
    'Copyright 1983-1999 Sun Microsystems, Inc.',
    'configuring network interfaces: hme0.',
    'starting rpc services: rpcbind keyserv done.',
    'starting desktop login service: dtlogin.',
    'mounting /home/benedikt',
    'Common Desktop Environment ready.',
    'benedikt@0xbene:~$',
  ],
}

export const windowDefinitions = [
  {
    id: 'motd',
    title: 'Message of the Day',
    component: 'motd',
    position: { x: 360, y: 180 },
    size: { width: 420, height: 220 },
  },
  {
    id: 'about',
    title: 'dtpad - about.txt',
    component: 'about',
    position: { x: 150, y: 74 },
    size: { width: 600, height: 420 },
  },
  {
    id: 'socials',
    title: 'Address Manager - socials.db',
    component: 'socials',
    position: { x: 210, y: 110 },
    size: { width: 620, height: 360 },
  },
  {
    id: 'certs',
    title: 'File Manager - certs.csv',
    component: 'certs',
    position: { x: 260, y: 120 },
    size: { width: 700, height: 420 },
  },
  {
    id: 'projects',
    title: 'File Manager - projects/',
    component: 'projects',
    position: { x: 210, y: 86 },
    size: { width: 720, height: 480 },
  },
  {
    id: 'skills',
    title: 'dtpad - skills.ini',
    component: 'skills',
    position: { x: 300, y: 100 },
    size: { width: 560, height: 430 },
  },
  {
    id: 'terminal',
    title: 'xterm',
    component: 'terminal',
    position: { x: 130, y: 130 },
    size: { width: 720, height: 420 },
  },
]
