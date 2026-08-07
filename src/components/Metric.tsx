import { useEffect, useRef, useState, type ReactElement } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

interface MetricProps {
  value: number
  suffix?: string
  label: string
}

export function Metric({ value, suffix = "", label }: MetricProps): ReactElement {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(0)
  const reduced = usePrefersReducedMotion()
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      setShown(value)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return
        started.current = true
        const dur = 900
        const t0 = performance.now()
        const step = (now: number): void => {
          const p = Math.min((now - t0) / dur, 1)
          const eased = 1 - (1 - p) ** 3
          setShown(Math.round(value * eased))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        io.unobserve(el)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, reduced])

  return (
    <div className="border-2 border-line bg-bg px-3.5 py-2 shadow-[2px_2px_0_var(--line)]">
      <b
        ref={ref}
        className="font-display text-lg font-extrabold text-ok tabular-nums"
      >
        {shown}
        {suffix}
      </b>
      <span className="ml-1.5 text-[11px] tracking-[0.08em] text-muted uppercase">
        {label}
      </span>
    </div>
  )
}
