import { useEffect, useState } from 'react'
import { playBootSound } from '../../hooks/useSounds'

const correctFlag = 'FLAG{h4cker_w4s_here_1337}'

const successArt = `
  ██████╗ ████████╗███████╗
  ██╔══██╗╚══██╔══╝██╔════╝
  ██████╔╝   ██║   █████╗
  ██╔══██╗   ██║   ██╔══╝
  ██║  ██║   ██║   ██║
  ╚═╝  ╚═╝   ╚═╝   ╚═╝
`

function CTFWindow() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('waiting')

  useEffect(() => {
    localStorage.setItem('ctf_unlocked', 'true')
  }, [])

  const handleSubmit = () => {
    if (status === 'success') return
    if (input.trim() === correctFlag) {
      setStatus('success')
      playBootSound()
      return
    }

    setStatus('denied')
    window.setTimeout(() => setStatus('waiting'), 2500)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSubmit()
  }

  const statusColor = {
    waiting: '#888888',
    denied: '#cc0000',
    success: '#00aa00',
  }

  const statusText = {
    waiting: '> Waiting for input...',
    denied: '> ACCESS DENIED. Wrong flag. Try again.',
    success: '> FLAG ACCEPTED. Well done, analyst.',
  }

  return (
    <div className="ctf-window">
      <div className="ctf-terminal">
        {status === 'success' ? (
          <>
            <pre className="ctf-success-art">{successArt}</pre>
            <span>Flag accepted. Incident analysis complete.</span>
            <br />
            <span className="ctf-muted">Intruder: h4cker @ 10.13.37.1</span>
            <br />
            <span className="ctf-muted">Session: 02:09:54 - 02:19:44 (9m 50s)</span>
            <br />
            <br />
            <span className="ctf-warning">You think like a blue teamer.</span>
          </>
        ) : (
          <>
            <span className="ctf-warning">CAPTURE THE FLAG -- INCIDENT INVESTIGATION</span>
            <br />
            {'='.repeat(46)}
            <br />
            <br />
            Someone breached this system.
            <br />
            Your mission: find out who, when,
            <br />
            and what they left behind.
            <br />
            <br />
            <span className="ctf-cyan">Start investigating:</span>
            <br />
            {'  $ open terminal'}
            <br />
            {'  $ cd ctf'}
            <br />
            {'  $ follow the trail...'}
            <br />
            <br />
            Available in ctf/:
            <br />
            {'  README.txt  auth.log  passwd.bak'}
            <br />
            <br />
            <span className="ctf-muted">Hint: not all files are visible by default.</span>
            <br />
            <span className="ctf-muted">Use the right commands to see everything.</span>
          </>
        )}
      </div>

      {status !== 'success' && (
        <div className="ctf-submit">
          <label htmlFor="ctf-flag-input">Enter flag when found:</label>
          <div className="ctf-submit__row">
            <input
              id="ctf-flag-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="FLAG{...}"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}

      <div className="ctf-status" style={{ color: statusColor[status] }}>
        {statusText[status]}
      </div>
    </div>
  )
}

export default CTFWindow
