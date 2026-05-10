const corners = [
  'top-right',
  'bottom-left',
  'bottom-right',
]

function CRTBezel() {
  return (
    <>
      <div className="crt-bezel" aria-hidden="true" />
      {corners.map((corner) => (
        <div key={corner} className={`crt-corner crt-corner--${corner}`} aria-hidden="true" />
      ))}
    </>
  )
}

export default CRTBezel
