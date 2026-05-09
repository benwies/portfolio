function TrashWindow() {
  const items = Array.from({ length: 42 }, (_, index) => index)

  return (
    <section className="content-window trash-window">
      <div className="trash-file-grid" aria-label="Trash contents">
        {items.map((item) => (
          <span key={item} className="trash-file-icon" aria-hidden="true">
            <span />
          </span>
        ))}
      </div>
      <div className="trash-status">42 items</div>
    </section>
  )
}

export default TrashWindow
