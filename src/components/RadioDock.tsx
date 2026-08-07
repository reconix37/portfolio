import { useState, type ReactElement } from "react"
import { useChipRadio, type PlaylistId } from "@/lib/chipRadio"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "daniil-os-radio-open"

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

function prettyName(name: string): string {
  return name.replace(/-/g, " ")
}

interface RadioDockProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Карточка-плеер в духе NCMPCPP у KISA: визуализатор + тайтл + прогресс + << ▶ >>.
 * Треклист убран с лица — листаем prev/next.
 */
export function RadioDock({ open: openProp, onOpenChange }: RadioDockProps): ReactElement {
  const {
    tracks,
    trackIdx,
    track,
    playing,
    volume,
    eq,
    playlist,
    elapsed,
    duration,
    setVolume,
    setPlaylist,
    togglePlay,
    nextTrack,
    prevTrack,
    stop,
  } = useChipRadio()

  const reduced = usePrefersReducedMotion()
  const [internalOpen, setInternalOpen] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v === null ? true : v === "1"
    } catch {
      return true
    }
  })

  const open = openProp ?? internalOpen
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0

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

  const cyclePlaylist = (): void => {
    const order: PlaylistId[] = ["all", "chip", "lofi"]
    const i = order.indexOf(playlist)
    setPlaylist(order[(i + 1) % order.length]!)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center justify-between gap-3 border-2 border-line bg-surface px-4 py-3 text-left shadow-[4px_4px_0_var(--line)]"
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

  const bars = reduced ? [0.35, 0.55, 0.4, 0.65, 0.3] : eq

  return (
    <div className="relative h-full">
      {/* ярлык как NCMPCPP у KISA */}
      <span className="absolute -top-3 right-4 z-[1] border-2 border-line bg-surface px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-ink uppercase shadow-[2px_2px_0_var(--line)]">
        MOCP
      </span>

      <div className="flex h-full min-h-[220px] flex-col border-2 border-line bg-surface p-4 shadow-[5px_5px_0_var(--line)] md:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 border-2 border-line px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase",
              playing ? "border-ok text-ok" : "text-muted",
            )}
          >
            {playing ? "▶ on air" : "|| paused"}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={cyclePlaylist}
              title="Switch playlist"
              className="truncate font-mono text-[10px] tracking-[0.06em] text-muted uppercase hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ~/music/{track.name}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close radio"
              className="flex size-7 shrink-0 items-center justify-center border-2 border-line bg-bg text-ink hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mb-4 flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-end justify-center gap-0.5 border-2 border-line bg-bg p-1.5"
            aria-hidden="true"
          >
            {bars.slice(0, 5).map((h, i) => (
              <div
                key={i}
                className={cn("w-1.5 bg-ink transition-[height] duration-100", !playing && "opacity-40")}
                style={{ height: `${Math.max(18, h * 100)}%` }}
              />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[clamp(16px,2vw,20px)] leading-tight font-extrabold tracking-tight text-ink">
              {prettyName(track.name)}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
              {track.vibe} · {track.bpm} bpm · {playlist}
            </p>
          </div>
        </div>

        <div
          className="mb-1.5 h-2 w-full bg-line/30"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Track progress"
        >
          <div
            className="h-full bg-ink transition-[width] duration-150"
            style={{ width: `${playing ? progress : 0}%` }}
          />
        </div>
        <div className="mb-4 flex justify-between font-mono text-[10px] tracking-[0.08em] text-muted tabular-nums">
          <span>{fmt(elapsed)}</span>
          <span>{fmt(duration)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted tabular-nums">
            {String(trackIdx + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
              className="flex size-9 items-center justify-center border-2 border-line bg-bg font-mono text-xs hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {"<<"}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-9 items-center justify-center border-2 border-line bg-accent text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="flex size-9 items-center justify-center border-2 border-line bg-bg font-mono text-xs hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {">>"}
            </button>
          </div>
        </div>

        <label className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          VOL
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-full max-w-[140px] cursor-pointer accent-[var(--accent)]"
            aria-label="Volume"
          />
        </label>
      </div>
    </div>
  )
}
