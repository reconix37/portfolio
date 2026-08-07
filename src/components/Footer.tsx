import type { ReactElement } from "react"
import { useClock } from "@/hooks/useClock"
import { useTheme } from "@/hooks/useTheme"
import { useSfx } from "@/hooks/useSfx"

function SunIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" className="size-4">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  )
}

function MoonIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" className="size-4">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

interface FooterProps {
  onOpenChangelog?: () => void
}

/** Нижняя sysbar: метаданные + SFX/тема (верхняя шапка убрана). */
export function Footer({ onOpenChangelog }: FooterProps): ReactElement {
  const clock = useClock()
  const { theme, toggleTheme } = useTheme()
  const { muted, toggleMute } = useSfx()

  return (
    <footer className="border-t-2 border-line bg-surface">
      <div className="wrap flex flex-wrap items-center justify-between gap-3 py-3 text-xs tracking-[0.1em] text-ink-soft uppercase">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <b className="font-bold text-ok">DANIIL OS</b>
          {onOpenChangelog ? (
            <button
              type="button"
              onClick={onOpenChangelog}
              className="underline-offset-2 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              v1.0
            </button>
          ) : (
            <span>v1.0</span>
          )}
          <span aria-hidden="true">·</span>
          <span>PREŠOV</span>
          <span aria-hidden="true">·</span>
          <time className="text-ink tabular-nums" dateTime={clock} aria-live="polite">
            {clock}
          </time>
          <span aria-hidden="true">·</span>
          <span>
            STATUS:{" "}
            <b className="font-bold text-ok">OPEN TO WORK · 24/7 ON THE JOB</b>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-ink-soft sm:inline">© 2026 · made with too many tokens</span>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute UI sounds" : "Mute UI sounds"}
            title={muted ? "sfx off" : "sfx on"}
            className="flex size-11 items-center justify-center border-2 border-line bg-bg font-mono text-[10px] tracking-[0.08em] text-ink shadow-[2px_2px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {muted ? "SFX∅" : "SFX"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title="theme"
            className="flex size-11 items-center justify-center border-2 border-line bg-bg text-ink shadow-[2px_2px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </footer>
  )
}
