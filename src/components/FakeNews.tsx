import { useEffect, useRef, type ReactElement } from "react"

const HEADLINES = [
  "Scientists baffled: new primate species discovered — vibe coders from Prešov",
  "OpenAI buys Dota 2, community asks why",
  "New Gemini model finally learns basic arithmetic",
  "Morrowind gets DLC in August 2026, fans cry tears of joy",
  "YouTube comments officially declared the least toxic place on the internet",
  "Vibe coders outnumber real coders, nobody notices the difference",
  "Statistics show: writing fake news uses 90% of brain resources",
  "Developer found sleeping under desk, code review passed anyway",
  "Coffee officially declared a required dependency for production",
  "LGTM approved 47 PRs in one minute, quality unchanged",
  "GitHub outage blamed on too many merge requests",
  "Bug survived 5 code reviews, promoted to feature",
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
