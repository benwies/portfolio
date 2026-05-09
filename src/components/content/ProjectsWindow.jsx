import { useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { CdeIcon } from '../desktop/DesktopIcon'

const { projects } = portfolioData

function ProjectDetail({ project, onClose }) {
  const statusLabel = projects.statusLabels[project.status] ?? project.status

  return (
    <article className="project-subwindow" aria-live="polite">
      <header className="project-subwindow__title">
        <span>{project.name}</span>
        <button type="button" onClick={onClose}>
          {projects.closeLabel}
        </button>
      </header>
      <div className="project-subwindow__body">
        <h2>{project.name}</h2>
        <pre>{project.description}</pre>
        <p>
          <strong>{projects.stackLabel}</strong> {project.tech.join(', ')}
        </p>
        <span className={`project-status project-status--${project.status}`}>
          {statusLabel}
        </span>
        <div className="project-links">
          {project.github && (
            <a className="cde-button" href={project.github} target="_blank" rel="noreferrer">
              {projects.githubLabel}
            </a>
          )}
          {project.link && (
            <a className="cde-button" href={project.link} target="_blank" rel="noreferrer">
              {projects.liveLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function ProjectsWindow() {
  const [detailId, setDetailId] = useState(null)
  const detailProject = projects.items.find((project) => project.id === detailId)

  return (
    <section className="content-window projects-window">
      <header className="content-toolbar">
        <span>{projects.title}</span>
        <span>
          {projects.items.length} {projects.countLabel}
        </span>
      </header>

      <div className="project-grid" role="list">
        {projects.items.map((project) => (
          <button
            className="project-tile"
            key={project.id}
            type="button"
            onDoubleClick={() => setDetailId(project.id)}
            role="listitem"
          >
            <span className="cde-file-icon" aria-hidden="true">
              <CdeIcon type="folder" />
            </span>
            <span className="cde-file-name">{project.name}</span>
          </button>
        ))}
      </div>

      {detailProject && (
        <ProjectDetail project={detailProject} onClose={() => setDetailId(null)} />
      )}
    </section>
  )
}

export default ProjectsWindow
