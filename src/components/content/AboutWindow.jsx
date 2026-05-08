import { portfolioData } from '../../data/portfolioData'

const { about } = portfolioData

function AboutWindow() {
  return (
    <section className="content-window about-window">
      <div className="dtpad-document">
        <header className="dtpad-toolbar">
          {about.toolbar.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </header>
        <div className="dtpad-area">
          {[about.title, '', ...about.lines].join('\n')}
        </div>
      </div>
    </section>
  )
}

export default AboutWindow
