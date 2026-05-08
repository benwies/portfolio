import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

const { motd, ui } = portfolioData

function MOTDWindow() {
  const windowStore = useWindowStore()
  const closeMotd = () => {
    localStorage.setItem('motd-dismissed', 'true')
    windowStore.closeWindow('motd')
  }

  return (
    <section className="content-window motd-window" role="dialog" aria-labelledby="motd-title">
      <h2 id="motd-title">{motd.title}</h2>
      <div className="motd-body">{motd.body}</div>
      <footer className="content-toolbar">
        <button type="button" className="cde-button" onClick={closeMotd}>
          {ui.motdOk}
        </button>
      </footer>
    </section>
  )
}

export default MOTDWindow
