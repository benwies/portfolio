import trashFileIcon from '../../assets/cde-icons/trash_file.png'

function TrashWindow() {
  const items = Array.from({ length: 42 }, (_, index) => index)

  return (
    <section className="content-window trash-window">
      <div className="trash-file-grid" aria-label="Trash contents">
        {items.map((item) => (
          <img
            key={item}
            className="trash-file-icon"
            src={trashFileIcon}
            alt=""
            draggable="false"
          />
        ))}
      </div>
      <div className="trash-status">42 items</div>
    </section>
  )
}

export default TrashWindow
