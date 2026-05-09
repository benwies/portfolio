import { portfolioData } from '../../data/portfolioData'

const { certs } = portfolioData

function CertsWindow() {
  return (
    <section className="content-window certs-window">
      <header className="content-toolbar">
        <span>{certs.title}</span>
      </header>
      <table className="data-table">
        <thead>
          <tr>
            {certs.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {certs.rows.map((row) => {
            const statusLabel = certs.statusLabels[row.status] ?? row.status
            return (
              <tr key={row.name} className={row.status === 'in_progress' ? 'cert-row is-in-progress' : 'cert-row'}>
                <td>{row.name}</td>
                <td>{row.issuer}</td>
                <td>
                  <span className={`cert-status cert-status--${row.status}`}>
                    {statusLabel}
                  </span>
                </td>
                <td>
                  <a href={row.link} target="_blank" rel="noreferrer">
                    {certs.viewLabel}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default CertsWindow
