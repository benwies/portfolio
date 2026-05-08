import { portfolioData } from '../../data/portfolioData'

const { skills } = portfolioData

function SkillsWindow() {
  return (
    <section className="content-window skills-window">
      <pre className="ini-text">
        {skills.sections.map((section) => (
          <span key={section.name}>
            <span className="ini-section">[{section.name}]</span>
            {'\n'}
            {section.lines.join('\n')}
            {'\n\n'}
          </span>
        ))}
      </pre>
    </section>
  )
}

export default SkillsWindow
