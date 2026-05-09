function TrashFileIcon() {
  return (
    <svg className="trash-file-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 3h15l7 7v19H5z" fill="#f0ede0" stroke="#000000" strokeWidth="2" />
      <path d="M20 3v8h7" fill="#c8b8a8" stroke="#000000" strokeWidth="2" />
      <path d="M9 15h13M9 20h13M9 25h10" stroke="#777777" strokeWidth="2" />
    </svg>
  )
}

function TrashWindow() {
  const items = Array.from({ length: 42 }, (_, index) => index)

  return (
    <section className="content-window trash-window">
      <div className="trash-file-grid" aria-label="Trash contents">
        {items.map((item) => (
          <TrashFileIcon key={item} />
        ))}
      </div>
      <div className="trash-status">42 items</div>
    </section>
  )
}

export default TrashWindow
