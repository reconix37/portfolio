import type { ReactElement } from "react"
import { useClock } from "@/hooks/useClock"

export function Footer(): ReactElement {
  const clock = useClock()

  return (
    <footer className="border-t-2 border-line bg-surface">
      <div className="wrap flex flex-wrap items-center justify-between gap-2.5 py-[18px] text-xs tracking-[0.1em] text-ink-soft uppercase">
        <div>
          <b className="font-bold text-ok">DANIIL OS</b> v1.0 · PREŠOV ·{" "}
          <time className="text-ink tabular-nums" dateTime={clock}>
            {clock}
          </time>{" "}
          · STATUS: <b className="font-bold text-ok">OPEN TO WORK</b>
        </div>
        <div className="flex gap-[18px]">
          <span>© 2026</span>
          <span>built by hand</span>
        </div>
      </div>
    </footer>
  )
}
