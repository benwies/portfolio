import { portfolioData } from '../../data/portfolioData'

export const fileSystem = {
  '/home/benedikt': {
    files: portfolioData.commands.files,
  },
  '/home/benedikt/projects': {
    files: portfolioData.projects.map((project) => `${project.name}/`),
  },
  '/home/benedikt/writeups': {
    files: portfolioData.writeups.map((writeup) => `${writeup.title}.md`),
  },
}

export const readFile = (name) => {
  const readers = {
    'about.txt': [
      `${portfolioData.identity.fullName}`,
      `${portfolioData.identity.role}`,
      `${portfolioData.system.focus}`,
    ],
    'skills.txt': portfolioData.skills.categories.map(
      (category) => `${category.name}: ${category.items.join(', ')}`,
    ),
    contacts: portfolioData.contact.map(
      (contact) => `${contact.port} ${contact.service} ${contact.detail}`,
    ),
  }

  return readers[name] ?? [`cat: ${name}: No such file or directory`]
}
