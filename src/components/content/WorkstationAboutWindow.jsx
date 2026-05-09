import { portfolioData } from '../../data/portfolioData'
import { useWindowStore } from '../../store/windowStore'

function WorkstationAboutWindow() {
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const { lines, ok } = portfolioData.ui.workstationAbout

  return (
    <section className="workstation-about-window">
      <div className="workstation-about-window__content">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line || '\u00a0'}</p>
        ))}
      </div>
      <button type="button" className="cde-button" onClick={() => closeWindow('workstationAbout')}>
        {ok}
      </button>
    </section>
  )
}

export default WorkstationAboutWindow
