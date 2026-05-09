import { useWindowStore } from '../../store/windowStore'
import trashcanFullIcon from '../../assets/cde-icons/trashcan_full.png'

function TrashIcon() {
  const openWindow = useWindowStore((state) => state.openWindow)

  return (
    <button
      type="button"
      className="trash-icon"
      onDoubleClick={() => openWindow('trash')}
      aria-label="Open trash"
      onDragStart={(event) => event.preventDefault()}
    >
      <span className="trash-icon__glyph">
        <img className="cde-theme-icon" src={trashcanFullIcon} alt="" draggable="false" />
      </span>
      <span className="trash-icon__label">trash</span>
    </button>
  )
}

export default TrashIcon
