import type { ReactElement } from "react"

const ENTRIES = [
  {
    ver: "v1.0",
    date: "2026-08",
    items: [
      "Tabbed DANIIL OS shell (no scroll-landing)",
      "WHOAMI polaroid · stats · terminal · chipradio",
      "PROJECTS catalog — filter, sort, poke at numbers",
      "FAKE NEWS ticker (nothing here is true, obviously) · boot modal · mascot moods",
    ],
  },
  {
    ver: "v1.1",
    date: "2026-08",
    items: [
      "RadioDock — real lofi now, your ears can rest",
      "Hand callouts · quote block · CTAs",
      "Changelog · filesystem map · man page",
      "Project detail drawer · UI sfx",
    ],
  },
]

interface ChangelogModalProps {
  open: boolean
  onClose: () => void
}

/** Changelog по клику на v1.0 — сайт-роль как у lynnandtonic. */
export function ChangelogModal({ open, onClose }: ChangelogModalProps): ReactElement | null {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(80vh,560px)] w-full max-w-lg overflow-y-auto border-2 border-line bg-surface shadow-[var(--shadow-hover)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b-2 border-line bg-surface-2 px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase">
          <span>
            <span className="text-accent">CHANGELOG.md</span> · daniil-os
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center border-2 border-line bg-bg hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            aria-label="Close changelog"
          >
            ×
          </button>
        </div>
        <div className="p-5">
          <h2 id="changelog-title" className="mb-4 text-[clamp(22px,3vw,28px)]">
            VERSION HISTORY
          </h2>
          <ul className="flex flex-col gap-5">
            {ENTRIES.map((e) => (
              <li key={e.ver} className="border-b-2 border-dashed border-line pb-4 last:border-0">
                <div className="mb-2 flex items-baseline gap-2 font-mono text-xs tracking-[0.1em] uppercase">
                  <span className="bg-accent px-1.5 py-0.5 text-bg dark:text-[#121110]">{e.ver}</span>
                  <span className="text-muted">{e.date}</span>
                </div>
                <ul className="flex flex-col gap-1.5 font-mono text-sm text-ink-soft">
                  {e.items.map((item) => (
                    <li key={item}>
                      <span className="text-accent">→</span> {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
