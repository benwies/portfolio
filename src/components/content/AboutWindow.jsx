import { portfolioData } from '../../data/portfolioData'

const { identity, system } = portfolioData

function AboutWindow() {
  const profileRows = [
    ['user', `${identity.user}@${identity.host}`],
    ['name', identity.fullName],
    ['role', identity.role],
    ['status', identity.status],
    ['location', identity.location],
  ]

  const systemRows = [
    ['os', system.os],
    ['focus', system.focus],
    ['shell', system.shell],
    ['uptime', system.uptime],
    ['packages', system.packages],
  ]

  return (
    <section className="content-window about-window">
      <header className="content-header">
        <p className="content-kicker">{identity.user}</p>
        <h2>{identity.fullName}</h2>
        <p>{identity.role}</p>
      </header>

      <div className="content-grid">
        <dl className="content-list">
          {profileRows.map(([label, value]) => (
            <div className="content-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <dl className="content-list">
          {systemRows.map(([label, value]) => (
            <div className="content-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default AboutWindow
