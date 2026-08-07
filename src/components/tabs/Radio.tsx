import type { ReactElement } from "react"
import { useChipRadio } from "@/lib/chipRadio"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { cn } from "@/lib/utils"

export function Radio(): ReactElement {
  const {
    tracks,
    trackIdx,
    track,
    playing,
    volume,
    eq,
    setVolume,
    togglePlay,
    nextTrack,
    playTrack,
  } = useChipRadio()

  return (
    <section className="relative" aria-labelledby="radio-heading">
      <SectionLabel text="06 — RADIO" />
      <div className="wrap py-8 md:py-10">
        <h2 id="radio-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          CHIPRADIO
          <SectionBadge text="// webaudio" />
        </h2>
        <p className="mb-8 font-mono text-sm text-muted">
          {"// no files · square + triangle + noise · mini-player stays on"}
        </p>

        <div className="max-w-xl border-2 border-line bg-bg p-5 shadow-[var(--shadow)]">
          <div className="mb-5 flex h-16 items-end gap-1.5" aria-hidden="true">
            {eq.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full border-2 border-line bg-accent transition-[height] duration-100",
                  !playing && "opacity-40",
                )}
                style={{ height: `${Math.max(12, h * 100)}%` }}
              />
            ))}
          </div>

          <div className="mb-4 font-mono text-sm tracking-[0.08em] uppercase">
            <span className="text-muted">NOW :: </span>
            <span className="text-accent">{track.name}</span>
            <span className="ml-2 text-muted">{track.bpm} BPM</span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex min-h-11 min-w-14 items-center justify-center border-2 border-line bg-accent px-4 py-2 text-bg shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="min-h-11 border-2 border-line bg-surface px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              next
            </button>
            <label className="ml-auto flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase">
              VOL
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-2 w-28 cursor-pointer accent-[var(--accent)]"
                aria-label="Volume"
              />
            </label>
          </div>

          <ul className="flex flex-col gap-1.5">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => playTrack(i)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between border-2 border-line px-3 py-2 text-left font-mono text-xs tracking-[0.08em] uppercase transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    i === trackIdx
                      ? "bg-accent text-bg dark:text-[#121110]"
                      : "bg-transparent hover:bg-surface-2",
                  )}
                >
                  <span>{t.name}</span>
                  <span className="opacity-70">{t.bpm}bpm</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
