import { useEffect, useState, type ReactElement } from "react"
import { useChipRadio } from "@/lib/chipRadio"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "daniil-os-radio-open"

interface RadioDockProps {
  /** контролируемый open снаружи (опционально) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Плеер в потоке страницы (как MOCP у deploychan) — не fixed overlay.
 * Можно закрыть; reopen — компактная кнопка.
 */
export function RadioDock({ open: openProp, onOpenChange }: RadioDockProps): ReactElement {
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
    stop,
  } = useChipRadio()
  const [progress, setProgress] = useState(0)
  const [internalOpen, setInternalOpen] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v === null ? true : v === "1"
    } catch {
      return true
    }
  })

  const open = openProp ?? internalOpen

  const setOpen = (next: boolean): void => {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    } catch {
      /* ignore */
    }
    if (!next) stop()
  }

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1.2))
    }, 200)
    return () => window.clearInterval(id)
  }, [playing, track.id])

  useEffect(() => {
    setProgress(0)
  }, [track.id])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center justify-between gap-3 border-2 border-line bg-surface px-4 py-3 text-left shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          {"// MOCP · closed"}
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
          open radio
        </span>
      </button>
    )
  }

  return (
    <div className="border-2 border-line bg-surface shadow-[var(--shadow)]">
      <div className="flex items-center justify-between border-b-2 border-line bg-surface-2 px-3 py-2">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
          {"// MOCP"}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-[10px] tracking-[0.12em] uppercase",
              playing ? "text-ok" : "text-muted",
            )}
          >
            {playing ? "ON AIR" : "PAUSED"}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close radio"
            className="flex size-9 items-center justify-center border-2 border-line bg-bg text-ink hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
          >
            ×
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="mb-2 truncate font-mono text-xs tracking-[0.06em] text-ink uppercase">
            <span className="text-muted">~/music/</span>
            <span className="text-accent">{track.name}</span>
            <span className="ml-2 text-muted">{track.bpm}bpm</span>
            {track.vibe === "lofi" && (
              <span className="ml-2 border border-line px-1 text-[9px] text-muted">lofi</span>
            )}
          </div>

          <div
            className="mb-3 h-2 w-full border-2 border-line bg-bg"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Track progress"
          >
            <div
              className={cn(
                "h-full bg-accent transition-[width] duration-200",
                !playing && "opacity-40",
              )}
              style={{ width: `${playing ? progress : 0}%` }}
            />
          </div>

          <div className="mb-3 flex h-8 items-end gap-1" aria-hidden="true">
            {eq.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full border border-line bg-accent transition-[height] duration-100",
                  !playing && "opacity-40",
                )}
                style={{ height: `${Math.max(12, h * 100)}%` }}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex min-h-11 min-w-12 items-center justify-center border-2 border-line bg-accent px-3 text-bg shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="flex min-h-11 items-center justify-center border-2 border-line bg-bg px-3 font-mono text-[11px] tracking-[0.1em] uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              next
            </button>
            <label className="ml-auto flex min-h-11 items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase">
              VOL
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1.5 w-24 cursor-pointer accent-[var(--accent)]"
                aria-label="Volume"
              />
            </label>
          </div>
        </div>

        <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto md:max-h-none">
          {tracks.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => playTrack(i)}
                className={cn(
                  "flex min-h-10 w-full items-center justify-between border-2 border-line px-2.5 py-1.5 text-left font-mono text-[10px] tracking-[0.08em] uppercase transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  i === trackIdx
                    ? "bg-accent text-bg dark:text-[#121110]"
                    : "bg-bg hover:bg-surface-2",
                )}
              >
                <span className="truncate">{t.name}</span>
                <span className="ml-2 shrink-0 opacity-70">
                  {t.vibe === "lofi" ? "lofi" : `${t.bpm}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
