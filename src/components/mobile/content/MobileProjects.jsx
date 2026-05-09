import { portfolioData } from '../../../data/portfolioData'
import { displayUrl } from './mobileUtils'

function MobileProjects() {
  const { projectLabels } = portfolioData.mobile

  return (
    <div className="mobile-projects">
      {portfolioData.projects.items.map((project) => (
        <article className="mobile-project" key={project.id}>
          <h2>
            <span aria-hidden="true">{projectLabels.folderPrefix}</span> {project.name}
          </h2>
          <pre>{project.description}</pre>
          <p>
            <strong>{portfolioData.projects.stackLabel}</strong> {project.tech.join(', ')}
          </p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer">
              {projectLabels.live} {displayUrl(project.link)}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              {projectLabels.github} {displayUrl(project.github)}
            </a>
          )}
          {!project.link && !project.github && <p className="mobile-muted">{projectLabels.noLink}</p>}
        </article>
      ))}
    </div>
  )
}

export default MobileProjects
