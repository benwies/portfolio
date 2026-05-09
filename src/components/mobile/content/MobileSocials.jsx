import { portfolioData } from '../../../data/portfolioData'
import { displayUrl } from './mobileUtils'

function MobileSocials() {
  return (
    <div className="mobile-socials" role="table">
      <div className="mobile-socials__row mobile-socials__head" role="row">
        {portfolioData.socials.headers.map((header) => (
          <span key={header} role="columnheader">
            {header}
          </span>
        ))}
      </div>
      {portfolioData.socials.rows.map((row) => (
        <a
          className="mobile-socials__row"
          href={row.link}
          key={row.link}
          target="_blank"
          rel="noreferrer"
          role="row"
        >
          <span role="cell">{row.port}</span>
          <span role="cell">{row.service}</span>
          <span role="cell">{displayUrl(row.link)}</span>
        </a>
      ))}
    </div>
  )
}

export default MobileSocials
