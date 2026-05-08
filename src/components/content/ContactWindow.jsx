import { portfolioData } from '../../data/portfolioData'

const { contact } = portfolioData

function ContactWindow() {
  return (
    <section className="content-window contact-window">
      <table className="contact-table">
        <thead>
          <tr>
            <th>Port</th>
            <th>State</th>
            <th>Service</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {contact.map((entry) => (
            <tr key={`${entry.port}-${entry.service}`}>
              <td>{entry.port}</td>
              <td>{entry.state}</td>
              <td>{entry.service}</td>
              <td>
                <a href={entry.href} target="_blank" rel="noreferrer">
                  {entry.detail}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ContactWindow
