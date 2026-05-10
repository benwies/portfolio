import { portfolioData } from '../../data/portfolioData'

export const ctfUnlocked = () => (
  typeof localStorage !== 'undefined'
  && localStorage.getItem('ctf_unlocked') === 'true'
)

const motdLines = () => [
  ...portfolioData.motd.linesBefore,
  ...portfolioData.motd.links.map((link) => link.label),
  ...portfolioData.motd.linesAfter,
]

export const fileContents = {
  'README.md': () => motdLines().join('\n'),
  'welcome.txt': () => motdLines().join('\n'),
  'about.txt': () => portfolioData.about.lines.join('\n'),
  'socials.db': () => [
    portfolioData.socials.headers.join('    '),
    ...portfolioData.socials.rows.map((row) => `${row.port}    ${row.service}    ${row.link}`),
  ].join('\n'),
  'certs.csv': () => [
    portfolioData.certs.headers.join(','),
    ...portfolioData.certs.rows.map((row) => [
      row.name,
      row.issuer,
      portfolioData.certs.statusLabels[row.status] ?? row.status,
      row.link,
    ].join(',')),
  ].join('\n'),
  'skills.ini': () => portfolioData.skills.sections.flatMap((section) => [
    `[${section.name}]`,
    ...section.lines,
    '',
  ]).join('\n'),
  'ctf/README.txt': `Someone was here.
Find out who, when, and what they left behind.

Start with the logs.
Always start with the logs.`,
  'ctf/auth.log': `May 10 01:44:21 sshd[1337]: Failed password for root from 203.0.113.42
May 10 01:44:28 sshd[1337]: Failed password for root from 203.0.113.42
May 10 01:44:35 sshd[1337]: Failed password for root from 203.0.113.42
May 10 01:58:11 sshd[1337]: Failed password for admin from 198.51.100.7
May 10 02:01:03 sshd[1337]: Failed password for guest from 198.51.100.7
May 10 02:09:47 sshd[1337]: Failed password for h4cker from 10.13.37.1
May 10 02:09:51 sshd[1337]: Failed password for h4cker from 10.13.37.1
May 10 02:09:54 sshd[1337]: Accepted password for h4cker from 10.13.37.1
May 10 02:09:54 sshd[1337]: pam_unix(sshd:session): session opened for user h4cker
May 10 02:09:54 sshd[1337]: New session 31 for user h4cker
May 10 02:10:03 sudo[2001]: h4cker : TTY=pts/0 ; PWD=/home/h4cker ; USER=root
May 10 02:10:03 sudo[2001]: pam_unix(sudo:session): session opened for user root
May 10 02:19:44 sshd[1337]: session closed for user h4cker`,
  'ctf/passwd.bak': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
# === account added manually 2024-05-10 02:09:12 ===
# note: check shell history -- they always leave traces
h4cker:x:1337:1337:,,,:/home/h4cker:/bin/bash`,
  'ctf/.bash_history': `whoami
id
uname -a
cat /etc/passwd
cat /etc/shadow
sudo su -
cd /tmp
echo "FLAG{h4cker_w4s_here_1337}" > dropped.txt
chmod 777 dropped.txt
history -c
exit`,
  'tmp/dropped.txt': 'FLAG{h4cker_w4s_here_1337}',
}

export const normalizeDir = (path) => {
  if (!path || path === '~' || path === '/home/benedikt') return '/home/benedikt'
  if (path === '/tmp' || path === 'tmp') return '/tmp'
  if (path === 'ctf' || path === '~/ctf' || path === '/home/benedikt/ctf') return '/home/benedikt/ctf'
  if (path === 'projects' || path === '~/projects' || path === '/home/benedikt/projects') return '/home/benedikt/projects'
  return path
}

const toFileKey = (cwd, filename) => {
  if (!filename) return ''
  if (filename.startsWith('/tmp/')) return `tmp/${filename.replace('/tmp/', '')}`
  if (filename.startsWith('/home/benedikt/ctf/')) return `ctf/${filename.replace('/home/benedikt/ctf/', '')}`
  if (filename.startsWith('ctf/')) return filename
  if (filename.startsWith('tmp/')) return filename
  if (cwd === '/home/benedikt/ctf') return `ctf/${filename}`
  if (cwd === '/tmp') return `tmp/${filename}`
  return filename
}

export const getDirectoryContents = (path, showHidden = false) => {
  const normalized = normalizeDir(path)
  const dirs = {
    '/home/benedikt': {
      files: ctfUnlocked()
        ? [...portfolioData.terminal.files, 'ctf']
        : portfolioData.terminal.files,
      hidden: ['.bash_history', '.bashrc'],
    },
    '/home/benedikt/projects': {
      files: portfolioData.projects.items.map((project) => project.folder),
    },
    '/home/benedikt/ctf': {
      files: ['README.txt', 'auth.log', 'passwd.bak'],
      hidden: ['.bash_history'],
    },
    '/tmp': {
      files: ['dropped.txt'],
    },
  }

  if (normalized === '/home/benedikt/ctf' && !ctfUnlocked()) return null
  const entry = dirs[normalized]
  if (!entry) return null
  const visible = [...(entry.files ?? [])]
  if (!showHidden) return visible
  return [...visible, ...(entry.hidden ?? [])]
}

export const getDetailedListing = (path) => {
  const normalized = normalizeDir(path)
  const now = 'May 10'
  const listings = {
    '/home/benedikt/ctf': [
      'total 24',
      `drwxr-xr-x  2 benedikt benedikt 4096 ${now} 02:09 .`,
      `drwxr-xr-x 18 benedikt benedikt 4096 ${now} 09:43 ..`,
      `-rw-------  1 h4cker   h4cker    203 ${now} 02:19 .bash_history`,
      `-rw-r--r--  1 benedikt benedikt  128 ${now} 02:09 README.txt`,
      `-rw-r--r--  1 benedikt benedikt 1842 ${now} 02:19 auth.log`,
      `-rw-r--r--  1 benedikt benedikt  312 ${now} 02:09 passwd.bak`,
    ],
    '/tmp': [
      'total 12',
      `drwxrwxrwt  2 root     root     4096 ${now} 02:10 .`,
      `drwxr-xr-x 18 benedikt benedikt 4096 ${now} 09:43 ..`,
      `-rwxrwxrwx  1 h4cker   h4cker     28 ${now} 02:10 dropped.txt`,
    ],
    '/home/benedikt': [
      'total 48',
      `drwxr-xr-x 18 benedikt benedikt 4096 ${now} 09:43 .`,
      `drwxr-xr-x  3 root     root     4096 ${now} 00:01 ..`,
      `-rw-------  1 benedikt benedikt  220 ${now} 00:01 .bash_history`,
      `-rw-r--r--  1 benedikt benedikt 3526 ${now} 00:01 .bashrc`,
      ...(ctfUnlocked() ? [`drwxr-xr-x  2 benedikt benedikt 4096 ${now} 09:43 ctf`] : []),
      `drwxr-xr-x  2 benedikt benedikt 4096 ${now} 09:43 projects`,
    ],
  }
  return listings[normalized] ?? ['total 0']
}

export const fileSystem = {
  '/home/benedikt': {
    files: portfolioData.terminal.files,
  },
  '/home/benedikt/projects': {
    files: portfolioData.projects.items.map((project) => project.folder),
  },
}

export const readFile = (name, cwd = '/home/benedikt') => {
  const key = toFileKey(cwd, name)
  if (key.startsWith('ctf/') && !ctfUnlocked()) return [`cat: ${name}: No such file or directory`]
  const content = fileContents[key]
  if (typeof content === 'function') return content().split('\n')
  if (typeof content === 'string') return content.split('\n')
  return [`cat: ${name}: No such file or directory`]
}

export const readFileText = (name, cwd = '/home/benedikt') => {
  const key = toFileKey(cwd, name)
  if (key.startsWith('ctf/') && !ctfUnlocked()) return null
  const content = fileContents[key]
  if (typeof content === 'function') return content()
  if (typeof content === 'string') return content
  return null
}
