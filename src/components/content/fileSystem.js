import { portfolioData } from '../../data/portfolioData'

export const fileSystem = {
  '/home/benedikt': {
    files: portfolioData.terminal.files,
  },
  '/home/benedikt/projects': {
    files: portfolioData.projects.items.map((project) => `${project.name}/`),
  },
}

export const readFile = (name) => {
  const readers = {
    'README.md': [portfolioData.motd.body],
    'about.txt': portfolioData.about.lines,
    'socials.db': [
      '// TODO: Add social links',
      portfolioData.socials.headers.join('    '),
      ...portfolioData.socials.rows.map((row) =>
        Array.isArray(row) ? row.join('    ') : `${row.port}    ${row.service}    ${row.link}`,
      ),
    ],
    'certs.csv': [
      '// TODO: Add certifications',
      portfolioData.certs.headers.join(','),
      ...portfolioData.certs.rows.map((row) =>
        Array.isArray(row) ? row.join(',') : [row.name, row.issuer, row.date, row.link].join(','),
      ),
    ],
    'skills.ini': portfolioData.skills.sections.flatMap((section) => [
      `[${section.name}]`,
      ...section.lines,
      '',
    ]),
  }

  return readers[name] ?? [`cat: ${name}: No such file or directory`]
}
