import { portfolioData } from '../../data/portfolioData'

const { skills } = portfolioData

function SkillsWindow() {
  return (
    <section className="content-window skills-window">
      <div className="ini-text">
        {skills.sections.map((section) => (
          <div className="ini-block" key={section.name}>
            <div className="ini-section">[{section.name}]</div>
            {section.lines.map((line) => (
              <div
                className={line.trim().startsWith(';') ? 'ini-comment' : 'ini-item'}
                key={`${section.name}-${line}`}
              >
                {line.trim().startsWith(';') ? line : `  ${line}`}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsWindow
