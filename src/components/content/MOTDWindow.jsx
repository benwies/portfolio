import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const { motd, ui } = portfolioData

const motdLinks = [
  { label: '  > About Me       -> click to open about.txt', appId: 'about' },
  { label: '  > Projects       -> click to open projects/', appId: 'projects' },
  { label: '  > Certifications -> click to open certs.csv', appId: 'certs' },
  { label: '  > Skills         -> click to open skills.ini', appId: 'skills' },
  { label: '  > Socials        -> click to open socials.db', appId: 'socials' },
  { label: '  > Terminal       -> click to open terminal', appId: 'terminal' },
]

function MOTDWindow() {
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const openWindow = useWindowStore((state) => state.openWindow)

  const closeMotd = () => {
    closeWindow('motd')
  }

  const activateLink = (link) => {
    openWindow(link.appId)
  }

  return (
    <section className="content-window motd-window">
      <header className="dtpad-toolbar">
        {motd.toolbar.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </header>
      <div className="motd-body" aria-label={motd.title}>
        {motd.linesBefore.map((line, index) => (
          <div key={`before-${index}`}>{line || '\u00a0'}</div>
        ))}
        {motdLinks.map((link) => (
          <button
            type="button"
            className="motd-link"
            key={link.label}
            onClick={() => activateLink(link)}
          >
            {link.label}
          </button>
        ))}
        {motd.linesAfter.map((line, index) => (
          <div key={`after-${index}`}>{line || '\u00a0'}</div>
        ))}
      </div>
      <footer className="motd-actions">
        <button type="button" className="cde-button" onClick={closeMotd}>
          {ui.motdOk}
        </button>
      </footer>
    </section>
  )
}

export default MOTDWindow
