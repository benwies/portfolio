import { portfolioData } from '../../data/portfolioData'

function MobileWarningDialog({ onContinue }) {
  const { warning } = portfolioData.mobile

  return (
    <div className="mobile-warning-overlay" role="presentation">
      <section className="mobile-warning" role="dialog" aria-label={warning.title}>
        <header className="mobile-warning__title">
          <span>{portfolioData.ui.menuButton}</span>
          <strong>{warning.title}</strong>
        </header>
        <div className="mobile-warning__body">
          <div className="mobile-warning__text">
            {warning.lines.map((line, index) => (
              <p key={`${line}-${index}`}>{line || '\u00a0'}</p>
            ))}
          </div>
          <button type="button" className="mobile-cde-button" onClick={onContinue}>
            {warning.continueLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default MobileWarningDialog
