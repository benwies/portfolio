import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const { motd, ui } = portfolioData

function MOTDWindow() {
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const openWindow = useWindowStore((state) => state.openWindow)

  const closeMotd = () => {
    closeWindow('motd')
  }

  const downloadResume = (href) => {
    const link = document.createElement('a')
    link.href = href
    link.download = 'resume.pdf'
    link.click()
  }

  const activateLink = (link) => {
    if (link.download) {
      downloadResume(link.download)
      return
    }
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
        {motd.links.map((link) => (
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
