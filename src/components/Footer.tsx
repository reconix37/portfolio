import type { ReactElement } from "react"
import { useClock } from "@/hooks/useClock"

interface FooterProps {
  onOpenChangelog?: () => void
}

export function Footer({ onOpenChangelog }: FooterProps): ReactElement {
  const clock = useClock()

  return (
    <footer className="border-t-2 border-line bg-surface">
      <div className="wrap flex flex-wrap items-center justify-between gap-2.5 py-[18px] text-xs tracking-[0.1em] text-ink-soft uppercase">
        <div>
          <b className="font-bold text-ok">DANIIL OS</b>{" "}
          {onOpenChangelog ? (
            <button
              type="button"
              onClick={onOpenChangelog}
              className="underline-offset-2 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              v1.0
            </button>
          ) : (
            "v1.0"
          )}{" "}
          · PREŠOV ·{" "}
          <time className="text-ink tabular-nums" dateTime={clock}>
            {clock}
          </time>{" "}
          · STATUS:{" "}
          <b className="font-bold text-ok">OPEN TO WORK · 24/7 ON THE JOB</b>
        </div>
        <div className="flex gap-[18px]">
          <span>© 2026</span>
          <span>made with too much coffee</span>
        </div>
      </div>
    </footer>
  )
}
