import { portfolioData } from '../../../data/portfolioData'

function MobileSkills() {
  return (
    <div className="mobile-ini">
      {portfolioData.skills.sections.map((section) => (
        <div className="mobile-ini__block" key={section.name}>
          <div className="mobile-ini__section">[{section.name}]</div>
          {section.lines.map((line) => (
            <div key={`${section.name}-${line}`}>{`  ${line}`}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MobileSkills
