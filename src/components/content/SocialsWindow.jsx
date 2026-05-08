import { portfolioData } from '../../data/portfolioData'

const { socials } = portfolioData

function SocialsWindow() {
  return (
    <section className="content-window socials-window">
      <header className="content-toolbar">
        <span>{socials.title}</span>
      </header>
      <table className="data-table">
        <thead>
          <tr>
            {socials.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {socials.rows.map((row, index) => {
            const cells = Array.isArray(row) ? row : [row.port, row.service, row.link]
            const href = row.href ?? row.link
            return (
              <tr key={`social-${index}`}>
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

export default SocialsWindow
