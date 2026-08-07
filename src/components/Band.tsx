import { useEffect, useRef, type ReactElement, type ReactNode } from "react"

const ITEMS: ReactNode[] = [
  <>
    AI/ML <b className="font-bold text-accent">ENGINEER</b>
  </>,
  <>GENERATIVE AI</>,
  <>
    STRUCTURED <b className="font-bold text-accent">LLM OUTPUT</b>
  </>,
  <>EVALS</>,
  <>
    RAG · <b className="font-bold text-accent">GUARDRAILS</b>
  </>,
  <>FASTAPI</>,
  <>REACT NATIVE</>,
  <>XGBOOST</>,
  <>SUPABASE</>,
  <>RED TEAMING</>,
]

function BandSet(): ReactElement {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="inline-flex shrink-0 items-center gap-[26px] py-3 pr-[26px] pl-[26px] text-xs tracking-[0.14em] text-ink-soft uppercase whitespace-nowrap"
        >
          <span>{item}</span>
          <span className="text-accent-2" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * Бесконечный marquee: две одинаковые ленты, сдвиг ровно на ширину первой
 * (в px, не -50%) — без вспышки «склеенного» текста на стыке цикла.
 */
export function Band(): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const set = setRef.current
    if (!track || !set) return

    const sync = (): void => {
      const w = set.getBoundingClientRect().width
      track.style.setProperty("--band-shift", `-${Math.round(w)}px`)
    }

    sync()
    // шрифты/ресайз меняют ширину — пересчитываем
    const ro = new ResizeObserver(sync)
    ro.observe(set)
    document.fonts?.ready.then(sync).catch(() => undefined)

    return () => ro.disconnect()
  }, [])

  return (
    <div className="overflow-hidden border-y-2 border-line bg-surface" aria-hidden="true">
      <div
        ref={trackRef}
        className="band-track flex w-max will-change-transform motion-safe:animate-bandmove hover:[animation-play-state:paused]"
      >
        <div ref={setRef}>
          <BandSet />
        </div>
        <div aria-hidden="true">
          <BandSet />
        </div>
      </div>
    </div>
  )
}
