import { portfolioData } from '../../data/portfolioData'

const { writeups } = portfolioData

function WriteupsWindow() {
  return (
    <section className="content-window writeups-window">
      <ol className="writeup-list">
        {writeups.map((writeup) => (
          <li className="writeup-entry" key={`${writeup.date}-${writeup.title}`}>
            <article>
              <header>
                <time>{writeup.date}</time>
                <h3>{writeup.title}</h3>
              </header>
              <p>{writeup.summary}</p>
              <ul className="tag-list">
                {writeup.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default WriteupsWindow
