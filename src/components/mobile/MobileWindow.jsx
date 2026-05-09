import { portfolioData } from '../../data/portfolioData'

function MobileWindow({ children, onClose, title }) {
  return (
    <section className="mobile-window" aria-label={title}>
      <header className="mobile-window__title">
        <span>{portfolioData.mobile.windowMenuButton}</span>
        <strong>{title}</strong>
        <button type="button" onClick={onClose} aria-label={portfolioData.ui.closeLabel}>
          {portfolioData.mobile.closeButton}
        </button>
      </header>
      <nav className="mobile-window__menu" aria-hidden="true">
        {portfolioData.mobile.menuItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </nav>
      <div className="mobile-window__body">{children}</div>
    </section>
  )
}

export default MobileWindow
