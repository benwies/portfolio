import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import MobileWarningDialog from './MobileWarningDialog'

const formatClock = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

const displayUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

function MobileSection({ title, children }) {
  return (
    <section className="mobile-section">
      <header className="mobile-section__title">{title}</header>
      <div className="mobile-section__body">{children}</div>
    </section>
  )
}

function MobileTopBar() {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <header className="mobile-topbar">
      <strong>{portfolioData.mobile.topBarLabel}</strong>
      <time>{clock}</time>
    </header>
  )
}

function MobileAbout() {
  return (
    <MobileSection title={portfolioData.mobile.sections.about}>
      <pre className="mobile-pre">{portfolioData.about.lines.join('\n')}</pre>
    </MobileSection>
  )
}

function MobileSkills() {
  return (
    <MobileSection title={portfolioData.mobile.sections.skills}>
      <div className="mobile-ini">
        {portfolioData.skills.sections.map((section) => (
          <div className="mobile-ini__block" key={section.name}>
            <div className="mobile-ini__section">[{section.name}]</div>
            <div>{`  ${section.lines.join(', ')}`}</div>
          </div>
        ))}
      </div>
    </MobileSection>
  )
}

function MobileProjects() {
  const { projectLabels } = portfolioData.mobile

  return (
    <MobileSection title={portfolioData.mobile.sections.projects}>
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
            {!project.link && !project.github && <p>{projectLabels.noLink}</p>}
          </article>
        ))}
      </div>
    </MobileSection>
  )
}

function MobileCerts() {
  const { certLabels } = portfolioData.mobile

  return (
    <MobileSection title={portfolioData.mobile.sections.certs}>
      <div className="mobile-certs">
        {portfolioData.certs.rows.map((cert) => (
          <article className="mobile-cert" key={cert.name}>
            <h2>{cert.name}</h2>
            <p>
              {certLabels.issuer} {cert.issuer}
            </p>
            <p className={`mobile-status mobile-status--${cert.status}`}>
              {certLabels.status} {certLabels[cert.status]}
            </p>
            <a href={cert.link} target="_blank" rel="noreferrer">
              {cert.status === 'completed' ? certLabels.viewCertificate : certLabels.viewCourse}
            </a>
          </article>
        ))}
      </div>
    </MobileSection>
  )
}

function MobileSocials() {
  return (
    <MobileSection title={portfolioData.mobile.sections.socials}>
      <div className="mobile-socials" role="table">
        <div className="mobile-socials__row mobile-socials__head" role="row">
          {portfolioData.socials.headers.map((header) => (
            <span key={header} role="columnheader">
              {header}
            </span>
          ))}
        </div>
        {portfolioData.socials.rows.map((row) => (
          <a
            className="mobile-socials__row"
            href={row.link}
            key={row.link}
            target="_blank"
            rel="noreferrer"
            role="row"
          >
            <span role="cell">{row.port}</span>
            <span role="cell">{row.service}</span>
            <span role="cell">{displayUrl(row.link)}</span>
          </a>
        ))}
      </div>
    </MobileSection>
  )
}

function MobileView() {
  const [showWarning, setShowWarning] = useState(() => (
    localStorage.getItem(portfolioData.mobile.warning.storageKey) !== 'true'
  ))

  const dismissWarning = () => {
    localStorage.setItem(portfolioData.mobile.warning.storageKey, 'true')
    setShowWarning(false)
  }

  return (
    <main className="mobile-view">
      <MobileTopBar />
      <div className="mobile-scroll">
        <MobileAbout />
        <MobileSkills />
        <MobileProjects />
        <MobileCerts />
        <MobileSocials />
        <footer className="mobile-footer">
          {portfolioData.identity.prompt}
          <span className="mobile-cursor">_</span>
        </footer>
      </div>
      {showWarning && <MobileWarningDialog onContinue={dismissWarning} />}
    </main>
  )
}

export default MobileView
