import { portfolioData } from '../../../data/portfolioData'

function MobileCerts() {
  const { certLabels } = portfolioData.mobile

  return (
    <div className="mobile-certs">
      {portfolioData.certs.rows.map((cert) => (
        <article className="mobile-cert" key={cert.name}>
          <h2>{cert.name}</h2>
          <p>
            {certLabels.issuer} {cert.issuer}
          </p>
          <p className={`mobile-status mobile-status--${cert.status}`}>
            {certLabels.status} {certLabels[cert.status]}
          </p>
          <a href={cert.link} target="_blank" rel="noreferrer">
            {cert.status === 'completed' ? certLabels.viewCertificate : certLabels.viewCourse}
          </a>
        </article>
      ))}
    </div>
  )
}

export default MobileCerts
