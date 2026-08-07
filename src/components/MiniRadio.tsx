import type { ReactElement } from "react"
import { useChipRadio } from "@/lib/chipRadio"
import { cn } from "@/lib/utils"

/** Компактный MOCP-виджет — всегда на экране (как у deploychan). */
export function MiniRadio(): ReactElement {
  const { track, playing, volume, eq, setVolume, togglePlay, nextTrack } = useChipRadio()

  return (
    <div className="fixed bottom-16 left-3 z-40 hidden w-[240px] border-2 border-line bg-surface p-2.5 shadow-[4px_4px_0_var(--line)] md:block">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
        <span>{"// MOCP"}</span>
        <span className={playing ? "text-ok" : ""}>{playing ? "ON AIR" : "IDLE"}</span>
      </div>

      <div className="mb-2 flex h-6 items-end gap-0.5" aria-hidden="true">
        {eq.slice(0, 5).map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-full border border-line bg-accent transition-[height] duration-100",
              !playing && "opacity-40",
            )}
            style={{ height: `${Math.max(15, h * 100)}%` }}
          />
        ))}
      </div>

      <div className="mb-2 truncate font-mono text-[10px] tracking-[0.06em] text-ink uppercase">
        <span className="text-muted">~/music/</span>
        <span className="text-accent">{track.name}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-9 items-center justify-center border-2 border-line bg-accent text-bg hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
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
          className="flex size-9 items-center justify-center border-2 border-line bg-bg text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
            <path d="M6 6v12l8-6zM16 6v12h2V6z" />
          </svg>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="ml-1 h-1.5 min-w-0 flex-1 cursor-pointer accent-[var(--accent)]"
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
