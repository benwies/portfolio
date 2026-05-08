import { portfolioData } from '../../data/portfolioData'

function NeofetchWindow() {
  const { ascii, rows } = portfolioData.neofetch

  return (
    <section className="neofetch-window" aria-label={portfolioData.neofetch.title}>
      <div className="neofetch-grid">
        <pre className="neofetch-ascii">{ascii.join('\n')}</pre>
        <div className="neofetch-info">
          <div className="neofetch-user">benedikt@0xbene</div>
          <div className="neofetch-rule">───────────────────────────</div>
          {rows.map(([key, value]) => (
            <div className="neofetch-row" key={key}>
              <span className="neofetch-key">{key}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="neofetch-prompt">
        #<span className="neofetch-cursor">_</span>
      </div>
    </section>
  )
}

export default NeofetchWindow
