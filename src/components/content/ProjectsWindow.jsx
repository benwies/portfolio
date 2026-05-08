import { useState } from 'react'
import { portfolioData } from '../../data/portfolioData'

const { projects } = portfolioData

function ProjectsWindow() {
  const [selectedId, setSelectedId] = useState(null)
  const selectedProject = projects.find((project) => project.id === selectedId)

  if (selectedProject) {
    return (
      <section className="content-window projects-window">
        <header className="content-toolbar">
          <button type="button" onClick={() => setSelectedId(null)}>
            ..
          </button>
          <a href={selectedProject.github} target="_blank" rel="noreferrer">
            {portfolioData.ui.githubLabel}
          </a>
        </header>

        <article className="readme-view">
          {selectedProject.readme.map((line, index) => {
            if (line.startsWith('# ')) {
              return <h2 key={line}>{line.replace('# ', '')}</h2>
            }

            if (line.startsWith('- ')) {
              return <p key={`${line}-${index}`}>{line}</p>
            }

            return <p key={`${line}-${index}`}>{line}</p>
          })}
        </article>
      </section>
    )
  }

  return (
    <section className="content-window projects-window">
      <header className="content-toolbar">
        <span>{portfolioData.ui.projectFolder}</span>
        <span>{projects.length}</span>
      </header>

      <div className="cde-file-grid" role="list">
        {projects.map((project) => (
          <button
            className="cde-file"
            key={project.id}
            type="button"
            onClick={() => setSelectedId(project.id)}
            role="listitem"
          >
            <span className="cde-file-icon" aria-hidden="true">
              {project.type === 'folder' ? '[]' : '--'}
            </span>
            <span className="cde-file-name">{project.name}</span>
            <span className="cde-file-summary">{project.summary}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ProjectsWindow
