import { useState, type ReactElement } from "react"
import { useChipRadio, type PlaylistId } from "@/lib/chipRadio"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "daniil-os-radio-open"
const PLAYLISTS: { id: PlaylistId; label: string; path: string }[] = [
  { id: "all", label: "ALL", path: "~/music" },
  { id: "chip", label: "CHIP", path: "~/music/chip" },
  { id: "lofi", label: "LOFI", path: "~/music/lofi" },
]

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

interface RadioDockProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Плеер в потоке — progress + time + playlist switcher. */
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
    playTrack,
    stop,
  } = useChipRadio()

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
  const path = PLAYLISTS.find((p) => p.id === playlist)?.path ?? "~/music"

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
    const i = PLAYLISTS.findIndex((p) => p.id === playlist)
    setPlaylist(PLAYLISTS[(i + 1) % PLAYLISTS.length].id)
  }

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
          <button
            type="button"
            onClick={cyclePlaylist}
            title="Switch playlist"
            className="mb-2 truncate font-mono text-xs tracking-[0.06em] text-ink uppercase hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-muted">{path}/</span>
            <span className="text-accent">{track.name}</span>
            <span className="ml-2 text-muted">{track.bpm}bpm</span>
            {track.vibe === "lofi" && (
              <span className="ml-2 border border-line px-1 text-[9px] text-muted">lofi</span>
            )}
          </button>

          <div
            className="mb-1.5 h-2 w-full border-2 border-line bg-bg"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Track progress"
          >
            <div
              className={cn(
                "h-full bg-accent transition-[width] duration-150",
                !playing && "opacity-40",
              )}
              style={{ width: `${playing ? progress : 0}%` }}
            />
          </div>
          <div className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.08em] text-muted tabular-nums">
            <span>{fmt(elapsed)}</span>
            <span>
              {String(trackIdx + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
            </span>
            <span>{fmt(duration)}</span>
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

          <div className="mb-3 flex flex-wrap gap-1.5">
            {PLAYLISTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlaylist(p.id)}
                className={cn(
                  "min-h-9 border-2 border-line px-2.5 font-mono text-[10px] tracking-[0.1em] uppercase",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  playlist === p.id
                    ? "bg-accent text-bg dark:text-[#121110]"
                    : "bg-bg hover:bg-surface-2",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
              className="flex min-h-11 items-center justify-center border-2 border-line bg-bg px-3 font-mono text-[11px] tracking-[0.1em] uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              prev
            </button>
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
