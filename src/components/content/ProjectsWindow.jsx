import { useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { CdeIcon } from '../desktop/DesktopIcon'

const { projects } = portfolioData

function ProjectsWindow() {
  const [selectedId, setSelectedId] = useState(projects.items[0]?.id)
  const selectedProject = projects.items.find((project) => project.id === selectedId)

  return (
    <section className="content-window projects-window">
      <header className="content-toolbar">
        <span>{projects.title}</span>
        <span>
          {projects.items.length} {projects.countLabel}
        </span>
      </header>

      <div className="content-grid">
        <div className="project-grid" role="list">
          {projects.items.map((project) => (
            <button
              className="project-tile"
              key={project.id}
              type="button"
              onClick={() => setSelectedId(project.id)}
              role="listitem"
              aria-pressed={project.id === selectedId}
            >
              <span className="cde-file-icon" aria-hidden="true">
                <CdeIcon type="folder" />
              </span>
              <span className="cde-file-name">{project.name}</span>
              <span className="cde-file-summary">{project.summary ?? project.id}</span>
            </button>
          ))}
        </div>

        <article className="project-detail" aria-live="polite">
          {selectedProject ? (
            <>
              <h2>{selectedProject.name}</h2>
              {(selectedProject.readme ?? selectedProject.lines ?? []).map((line, index) => (
                <p key={`${selectedProject.id}-${index}`}>{line}</p>
              ))}
              {selectedProject.github && (
                <a className="cde-button" href={selectedProject.github} target="_blank" rel="noreferrer">
                  {projects.githubLabel}
                </a>
              )}
            </>
          ) : (
            <p>{projects.emptyText}</p>
          )}
        </article>
      </div>
    </section>
  )
}

export default ProjectsWindow
