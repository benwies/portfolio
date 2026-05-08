import { portfolioData } from '../../data/portfolioData'

const { identity, system, ticker } = portfolioData

function ClassifiedWindow() {
  const dossier = [
    ['subject', identity.fullName],
    ['role', identity.role],
    ['status', identity.status],
    ['focus', system.focus],
  ]

  return (
    <section className="content-window classified-window">
      <dl className="content-list">
        {dossier.map(([label, value]) => (
          <div className="content-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="classified-feed">
        {ticker.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}

export default ClassifiedWindow
