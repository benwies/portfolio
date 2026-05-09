import { useWindowStore } from '../../store/windowStore'
import { TrashSvg } from './DesktopIcon'

function TrashIcon() {
  const openWindow = useWindowStore((state) => state.openWindow)

  return (
    <button
      type="button"
      className="trash-icon"
      onDoubleClick={() => openWindow('trash')}
      aria-label="Open trash"
    >
      <span className="trash-icon__glyph">
        <TrashSvg />
      </span>
      <span className="trash-icon__label">trash</span>
    </button>
  )
}

export default TrashIcon
