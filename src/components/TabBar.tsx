import type { ReactElement } from "react"
import { cn } from "@/lib/utils"

export type TabId = "whoami" | "projects" | "stack" | "education" | "contact"

export const TABS: { id: TabId; label: string }[] = [
  { id: "whoami", label: "01 — WHOAMI" },
  { id: "projects", label: "02 — PROJECTS" },
  { id: "stack", label: "03 — STACK" },
  { id: "education", label: "04 — EDUCATION" },
  { id: "contact", label: "05 — CONTACT" },
]

interface TabBarProps {
  active: TabId
  onChange: (id: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps): ReactElement {
  return (
    <div
      role="tablist"
      aria-label="DANIIL OS sections"
      className="flex gap-1.5 overflow-x-auto border-b-2 border-line bg-surface px-2 py-2 md:px-3"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 border-2 border-line px-3.5 py-2.5 font-mono text-[12px] tracking-[0.1em] uppercase transition-colors md:text-[13px]",
              "min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              isActive
                ? "bg-accent text-bg dark:text-[#121110]"
                : "bg-transparent text-ink hover:bg-surface-2",
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
