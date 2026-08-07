import type { ReactElement } from "react"

interface ManModalProps {
  open: boolean
  onClose: () => void
}

const SECTIONS: { h: string; body: string }[] = [
  {
    h: "NAME",
    body: "daniil-os — a portfolio pretending to be an OS. Everything here is real, except the window buttons.",
  },
  {
    h: "TABS",
    body: "01 WHOAMI · 02 PROJECTS · 03 STACK · 04 EDUCATION · 05 CONTACT",
  },
  {
    h: "TERMINAL",
    body: "help · projects · contact · theme · clear · sudo hire · cat secret.txt · arrows = history",
  },
  {
    h: "RADIO",
    body: "lofi radio under WHOAMI — real tracks now (was: chiptune synth, god rest its soul).",
  },
  {
    h: "HOTKEYS",
    body: "? = this man page · click v1.0 = changelog · titlebar MAP = filesystem",
  },
  {
    h: "MASCOT",
    body: "follows cursor, blinks, judges your code. Click her — she's been waiting.",
  },
]

/** man daniil-os — оверлей справки (?). */
export function ManModal({ open, onClose }: ManModalProps): ReactElement | null {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="man-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(80vh,560px)] w-full max-w-lg overflow-y-auto border-2 border-line bg-surface shadow-[var(--shadow-hover)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b-2 border-line bg-surface-2 px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase">
          <span>
            <span className="text-accent">MAN</span> daniil-os(1)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center border-2 border-line bg-bg hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            aria-label="Close man page"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 p-5 font-mono text-sm">
          <h2 id="man-title" className="font-display text-[clamp(22px,3vw,28px)] tracking-normal">
            DANIIL OS — MANUAL
          </h2>
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h3 className="mb-1 text-[11px] tracking-[0.14em] text-accent uppercase">{s.h}</h3>
              <p className="leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
          <p className="pt-2 text-[11px] tracking-[0.08em] text-muted uppercase">
            press ? or esc to close
          </p>
        </div>
      </div>
    </div>
  )
}
