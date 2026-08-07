import { useMemo, useState, type ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { cn } from "@/lib/utils"
import type { Mood } from "@/components/hero/Mascot"

type Filter = "ALL" | "MOBILE" | "AI" | "BACKEND" | "THESIS"
type Sort = "RECOMMENDED" | "NEW" | "NAME"

type ProjectRow = {
  name: string
  stack: string
  metrics: string
  status: string
  types: Filter[]
  mood: Mood
  year: number
  order: number
}

const FILTERS: Filter[] = ["ALL", "MOBILE", "AI", "BACKEND", "THESIS"]
const SORTS: Sort[] = ["RECOMMENDED", "NEW", "NAME"]

const PROJECTS: ProjectRow[] = [
  {
    name: "HabitForge",
    stack: "React Native · Supabase · Gemini",
    metrics: "111+ tests · 68 migrations · 12 edge fn",
    status: "shipped",
    types: ["MOBILE", "AI"],
    mood: "happy",
    year: 2025,
    order: 1,
  },
  {
    name: "AI Chat Platform",
    stack: "FastAPI · PostgreSQL · Redis",
    metrics: "44 personas · 3 tiers · 2 local models",
    status: "shipped",
    types: ["AI", "BACKEND"],
    mood: "surprised",
    year: 2024,
    order: 2,
  },
  {
    name: "SLE Terminal",
    stack: "FastAPI · XGBoost · Next.js",
    metrics: "18K+ LOC · 11 routers · 5+ yr data",
    status: "shipped",
    types: ["BACKEND", "AI"],
    mood: "skeptical",
    year: 2023,
    order: 3,
  },
  {
    name: "MSc Thesis — RAG",
    stack: "RAG · Guardrails · Loop Eng",
    metrics: "in progress",
    status: "2027",
    types: ["THESIS", "AI"],
    mood: "idle",
    year: 2027,
    order: 4,
  },
]

interface ProjectsProps {
  onMood: (mood: Mood) => void
}

export function Projects({ onMood }: ProjectsProps): ReactElement {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [sort, setSort] = useState<Sort>("RECOMMENDED")

  const rows = useMemo(() => {
    let list =
      filter === "ALL"
        ? [...PROJECTS]
        : PROJECTS.filter((p) => p.types.includes(filter))

    if (sort === "NAME") {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "NEW") {
      list.sort((a, b) => b.year - a.year)
    } else {
      list.sort((a, b) => a.order - b.order)
    }
    return list
  }, [filter, sort])

  return (
    <section className="relative" aria-labelledby="projects-heading">
      <SectionLabel text="02 — PROJECTS" />
      <div className="wrap py-8 md:py-10">
        <h2 id="projects-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          SHIPPED MODULES
          <SectionBadge text="// 4 items" />
        </h2>
        <p className="mb-6 font-mono text-sm text-muted">
          {"// real products, real numbers — filter and sort"}
        </p>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              TYPE:
            </span>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "min-h-11 border-2 border-line px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  filter === f
                    ? "bg-accent text-bg dark:text-[#121110]"
                    : "bg-transparent text-ink hover:bg-surface-2",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              SORT:
            </span>
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={cn(
                  "min-h-11 border-2 border-line px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  sort === s
                    ? "bg-accent text-bg dark:text-[#121110]"
                    : "bg-transparent text-ink hover:bg-surface-2",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink text-bg dark:bg-[#E8E4DC] dark:text-[#121110]">
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  NAME
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  STACK
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  METRICS
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.name}
                  tabIndex={0}
                  className={cn(
                    "cursor-pointer border-b-2 border-line last:border-b-0 transition-colors",
                    "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                    i % 2 === 1 ? "bg-surface" : "bg-transparent",
                  )}
                  onMouseEnter={() => onMood(row.mood)}
                  onMouseLeave={() => onMood("idle")}
                  onFocus={() => onMood(row.mood)}
                  onBlur={() => onMood("idle")}
                >
                  <td className="px-4 py-3.5 font-display text-base font-extrabold">
                    {row.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {row.stack}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {row.metrics}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] text-accent uppercase">
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
