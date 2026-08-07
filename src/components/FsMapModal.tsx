import type { ReactElement } from "react"
import { TABS, type TabId } from "@/components/TabBar"
import { cn } from "@/lib/utils"

const TREE: { path: string; id: TabId; hint: string }[] = [
  { path: "/whoami", id: "whoami", hint: "hero · polaroid · radio · terminal" },
  { path: "/projects", id: "projects", hint: "shipped modules catalog" },
  { path: "/stack", id: "stack", hint: "loaded kernel tags" },
  { path: "/education", id: "education", hint: "training history" },
  { path: "/contact", id: "contact", hint: "establish connection" },
]

interface FsMapModalProps {
  open: boolean
  active: TabId
  onClose: () => void
  onNavigate: (id: TabId) => void
}

/** Карта filesystem — клик = смена таба. */
export function FsMapModal({
  open,
  active,
  onClose,
  onNavigate,
}: FsMapModalProps): ReactElement | null {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fsmap-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-2 border-line bg-surface shadow-[var(--shadow-hover)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-line bg-surface-2 px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase">
          <span>
            <span className="text-accent">LS</span> /daniil-os
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center border-2 border-line bg-bg hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            aria-label="Close filesystem map"
          >
            ×
          </button>
        </div>
        <div className="p-5">
          <h2 id="fsmap-title" className="mb-1 text-[clamp(22px,3vw,28px)]">
            FILESYSTEM
          </h2>
          <p className="mb-5 font-mono text-xs text-muted">{"// click a path to cd"}</p>
          <ul className="flex flex-col gap-2 font-mono text-sm">
            {TREE.map((node) => {
              const label = TABS.find((t) => t.id === node.id)?.label ?? node.id
              const on = active === node.id
              return (
                <li key={node.path}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(node.id)
                      onClose()
                    }}
                    className={cn(
                      "flex min-h-11 w-full flex-col items-start gap-0.5 border-2 border-line px-3 py-2 text-left transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      on
                        ? "bg-accent text-bg dark:text-[#121110]"
                        : "bg-bg hover:bg-surface-2",
                    )}
                  >
                    <span className="tracking-[0.06em]">
                      <span className={on ? "opacity-80" : "text-accent"}>drwx</span>{" "}
                      {node.path}
                    </span>
                    <span className={cn("text-[11px] tracking-[0.04em]", on ? "opacity-80" : "text-muted")}>
                      {label} · {node.hint}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
