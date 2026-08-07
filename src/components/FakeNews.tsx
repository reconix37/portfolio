import { useEffect, useRef, type ReactElement } from "react"

const HEADLINES = [
  "HabitForge evals still at 95%+ structured parse — vibes rejected at CI",
  "4 products shipped · 0 slideware cleared code review",
  "SLE Terminal: 5+ years M5 data still feeding the gatekeeper",
  "DANIIL OS v1.0 online · Prešov timezone locked",
  "AI Chat: 44 personas · 2 local models · crypto billing not a joke",
  "Thesis 2027: RAG + guardrails — loop eng in progress",
  "111+ tests green · 68 migrations · 12 edge functions humming",
]

function TickerSet(): ReactElement {
  return (
    <div className="flex shrink-0 items-center">
      {HEADLINES.map((h, i) => (
        <span
          key={i}
          className="inline-flex shrink-0 items-center gap-4 px-4 py-1.5 text-[11px] tracking-[0.06em] text-[var(--term-ink)] uppercase whitespace-nowrap"
        >
          <span>{h}</span>
          <span className="text-accent" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  )
}

/** FAKE NEWS-style ticker (как у deploychan) — поверх sysbar. */
export function FakeNews(): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const set = setRef.current
    if (!track || !set) return

    const sync = (): void => {
      const w = set.getBoundingClientRect().width
      track.style.setProperty("--ticker-shift", `-${Math.round(w)}px`)
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(set)
    document.fonts?.ready.then(sync).catch(() => undefined)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className="flex items-stretch border-b-2 border-line bg-[var(--term-bg)]"
      aria-hidden="true"
    >
      <div className="flex shrink-0 items-center gap-1.5 border-r-2 border-line bg-accent px-3 font-mono text-[10px] font-bold tracking-[0.14em] text-bg uppercase dark:text-[#121110]">
        <span aria-hidden="true">■</span> FAKE NEWS
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          ref={trackRef}
          className="ticker-track flex w-max will-change-transform motion-safe:animate-tickermove hover:[animation-play-state:paused]"
        >
          <div ref={setRef}>
            <TickerSet />
          </div>
          <div aria-hidden="true">
            <TickerSet />
          </div>
        </div>
      </div>
    </div>
  )
}
