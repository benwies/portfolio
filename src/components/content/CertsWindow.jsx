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
          {certs.rows.map((row, index) => {
            const cells = Array.isArray(row) ? row : [row.name, row.issuer, row.date, row.link]
            const href = row.href ?? row.link
            return (
              <tr key={`cert-${index}`}>
                {cells.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>
                    {cellIndex === cells.length - 1 && href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        {cell}
                      </a>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default CertsWindow
