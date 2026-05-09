import { portfolioData } from '../../data/portfolioData'

export const fileSystem = {
  '/home/benedikt': {
    files: portfolioData.terminal.files,
  },
  '/home/benedikt/projects': {
    files: portfolioData.projects.items.map((project) => project.folder),
  },
}

export const readFile = (name) => {
  const readers = {
    'README.md': [
      ...portfolioData.motd.linesBefore,
      ...portfolioData.motd.links.map((link) => link.label),
      ...portfolioData.motd.linesAfter,
    ],
    'welcome.txt': [
      ...portfolioData.motd.linesBefore,
      ...portfolioData.motd.links.map((link) => link.label),
      ...portfolioData.motd.linesAfter,
    ],
    'about.txt': portfolioData.about.lines,
    'socials.db': [
      portfolioData.socials.headers.join('    '),
      ...portfolioData.socials.rows.map((row) =>
        Array.isArray(row) ? row.join('    ') : `${row.port}    ${row.service}    ${row.link}`,
      ),
    ],
    'certs.csv': [
      portfolioData.certs.headers.join(','),
      ...portfolioData.certs.rows.map((row) => [
        row.name,
        row.issuer,
        portfolioData.certs.statusLabels[row.status] ?? row.status,
        row.link,
      ].join(',')),
    ],
    'skills.ini': portfolioData.skills.sections.flatMap((section) => [
      `[${section.name}]`,
      ...section.lines,
      '',
    ]),
  }

  return readers[name] ?? [`cat: ${name}: No such file or directory`]
}
