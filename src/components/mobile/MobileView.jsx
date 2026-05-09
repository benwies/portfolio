import { useEffect, useState } from 'react'
import { portfolioData } from '../../data/portfolioData'
import { CdeIcon } from '../desktop/DesktopIcon'
import MobileAbout from './content/MobileAbout'
import MobileCerts from './content/MobileCerts'
import MobileProjects from './content/MobileProjects'
import MobileSkills from './content/MobileSkills'
import MobileSocials from './content/MobileSocials'
import MobileTerminal from './content/MobileTerminal'
import MobileWarningDialog from './MobileWarningDialog'
import MobileWindow from './MobileWindow'

const formatClock = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

const mobileApps = [
  { id: 'projects', title: portfolioData.mobile.sections.projects, Content: MobileProjects },
  { id: 'about', title: portfolioData.mobile.sections.about, Content: MobileAbout },
  { id: 'socials', title: portfolioData.mobile.sections.socials, Content: MobileSocials },
  { id: 'certs', title: portfolioData.mobile.sections.certs, Content: MobileCerts },
  { id: 'skills', title: portfolioData.mobile.sections.skills, Content: MobileSkills },
  { id: 'terminal', title: portfolioData.mobile.sections.terminal, Content: MobileTerminal },
]

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

function MobileTaskbar() {
  return (
    <footer className="mobile-taskbar">
      {portfolioData.mobile.workspaces.map((workspace) => (
        <span key={workspace}>{workspace}</span>
      ))}
    </footer>
  )
}

function MobileIconGrid({ onOpen }) {
  return (
    <nav className="mobile-icon-grid" aria-label="Mobile apps">
      {mobileApps.map((app) => {
        const icon = portfolioData.desktopIcons.find((item) => item.appId === app.id)
        return (
          <button key={app.id} type="button" className="mobile-app-icon" onClick={() => onOpen(app.id)}>
            <span className="mobile-app-icon__image">
              <CdeIcon type={icon.icon} label="" />
            </span>
            <span>{icon.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function MobileView({ onContinueWarning, showWarning }) {
  const [openAppId, setOpenAppId] = useState(null)
  const openApp = mobileApps.find((app) => app.id === openAppId)
  const Content = openApp?.Content

  return (
    <main className="mobile-view">
      <MobileTopBar />
      <MobileIconGrid onOpen={setOpenAppId} />
      <MobileTaskbar />
      {openApp && (
        <MobileWindow title={openApp.title} onClose={() => setOpenAppId(null)}>
          <Content />
        </MobileWindow>
      )}
      {showWarning && <MobileWarningDialog onContinue={onContinueWarning} />}
    </main>
  )
}

export default MobileView
