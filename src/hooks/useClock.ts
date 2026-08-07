import { useEffect, useState } from "react"

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const tick = (): void => setTime(formatTime(new Date()))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])

  return time
}
