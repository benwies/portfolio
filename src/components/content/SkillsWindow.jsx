import { portfolioData } from '../../data/portfolioData'

const { skills } = portfolioData

function SkillsWindow() {
  return (
    <section className="content-window skills-window">
      <div className="terminal-feed">
        {skills.feed.map((entry) => (
          <div className="feed-line" key={`${entry.level}-${entry.name}`}>
            <span>[{entry.level}]</span>
            <span>{entry.name}</span>
            <strong>{entry.status}</strong>
          </div>
        ))}
      </div>

      <div className="skill-categories">
        {skills.categories.map((category) => (
          <section className="skill-category" key={category.name}>
            <h3>{category.name}</h3>
            <ul>
              {category.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

export default SkillsWindow
