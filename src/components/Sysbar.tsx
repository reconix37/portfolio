import type { ReactElement } from "react"
import { useTheme } from "@/hooks/useTheme"
import { useClock } from "@/hooks/useClock"

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

export function Sysbar(): ReactElement {
  const { theme, toggleTheme } = useTheme()
  const clock = useClock()

  return (
    <nav
      className="sticky top-0 z-50 border-b-2 border-line bg-surface"
      aria-label="System bar"
    >
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-2.5 text-xs tracking-[0.1em] uppercase">
        <div className="shrink-0 font-bold text-ink">
          <span className="text-accent">DANIIL</span>
          <span className="text-ink">.OS</span>
          <span className="ml-1.5 text-ink-soft">v1.0</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <time className="hidden text-ink-soft tabular-nums sm:inline" dateTime={clock} aria-live="polite">
            {clock}
          </time>
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
    </nav>
  )
}
