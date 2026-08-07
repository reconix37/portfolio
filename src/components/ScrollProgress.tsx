import { useEffect, useState, type ReactElement } from "react"

/** Тонкая полоска прогресса скролла (2px, accent). */
export function ScrollProgress(): ReactElement {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = (): void => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setP(max > 0 ? doc.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent transition-[width] duration-75 ease-out motion-reduce:transition-none"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  )
}
