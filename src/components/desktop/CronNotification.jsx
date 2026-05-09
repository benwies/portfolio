import { useEffect, useRef, useState } from 'react'
import { useWindowStore } from '../../store/windowStore'

const cronMessages = [
  'cron: backup complete',
  'cron: system check passed',
  'cron: log rotation done',
  'cron: network scan finished',
  'cron: /home/benedikt synced',
  'cron: firewall rules updated',
  'cron: IDS signatures refreshed',
  'cron: disk usage check OK',
  'cron: auth.log archived',
  'cron: certificate valid - 364d remaining',
  'cron: splunk forwarder alive',
  'cron: snapshot created OK',
]

const randomBetween = (min, max) => min + Math.random() * (max - min)
const pickMessage = () => cronMessages[Math.floor(Math.random() * cronMessages.length)]
const formatTime = (date) => date.toLocaleTimeString('en-GB', { hour12: false })

function CronNotification() {
  const bootComplete = useWindowStore((state) => state.bootComplete)
  const [notification, setNotification] = useState(null)
  const [visible, setVisible] = useState(false)
  const scheduleTimer = useRef(null)
  const autoDismissTimer = useRef(null)
  const clearTimer = useRef(null)
  const dismissRef = useRef(null)

  useEffect(() => {
    if (!bootComplete) return undefined

    const clearTimers = () => {
      window.clearTimeout(scheduleTimer.current)
      window.clearTimeout(autoDismissTimer.current)
      window.clearTimeout(clearTimer.current)
    }

    const dismiss = (scheduleNext) => {
      window.clearTimeout(autoDismissTimer.current)
      setVisible(false)
      clearTimer.current = window.setTimeout(() => {
        setNotification(null)
        if (scheduleNext) {
          schedule(false)
        }
      }, 300)
    }

    const showNotification = () => {
      setNotification({
        message: pickMessage(),
        time: formatTime(new Date()),
      })
      setVisible(true)
      autoDismissTimer.current = window.setTimeout(() => dismiss(true), 3000)
    }

    function schedule(isFirst) {
      const delay = isFirst ? randomBetween(90000, 120000) : randomBetween(120000, 240000)
      scheduleTimer.current = window.setTimeout(showNotification, delay)
    }

    dismissRef.current = () => dismiss(true)
    schedule(true)
    return () => {
      dismissRef.current = null
      clearTimers()
    }
  }, [bootComplete])

  const dismissNow = () => {
    dismissRef.current?.()
  }

  if (!notification) return null

  return (
    <aside className={visible ? 'cron-notification is-visible' : 'cron-notification'} aria-live="polite">
      <header className="cron-notification__title">
        <span>System Notification</span>
        <button type="button" aria-label="Close notification" onClick={dismissNow}>X</button>
      </header>
      <div className="cron-notification__body">
        <span className="cron-notification__time">[cron] {notification.time}</span>
        <span>{notification.message}</span>
      </div>
    </aside>
  )
}

export default CronNotification
