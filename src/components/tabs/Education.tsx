import { useEffect, useState, type ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

type LevelKind = "unlocked" | "progress" | "compiling"

type ProcessRow = {
  pid: string
  cmd: string
  detail: string
  level: string
  levelKind: LevelKind
  status: string
  uptime: string
  tooltip: string
  compiling?: boolean
}

const PROCESSES: ProcessRow[] = [
  {
    pid: "01",
    cmd: "ing.intelligent-tech",
    detail: "TUKE · FVT · Prešov — thesis: RAG + guardrails + loop eng.",
    level: "Ing. — IN PROGRESS",
    levelKind: "progress",
    status: "running",
    uptime: "2025 — 2027",
    tooltip: "PID 01 — 4 years of my life · CPU 100%",
  },
  {
    pid: "02",
    cmd: "bc.computer-support",
    detail: "TUKE · FVT · Prešov",
    level: "Bc. — UNLOCKED",
    levelKind: "unlocked",
    status: "exited 0",
    uptime: "2022 — 2025",
    tooltip: "PID 02 — diploma collected · exit 0",
  },
  {
    pid: "03",
    cmd: "thesis.rag-guardrails",
    detail: "Ing. thesis pipeline — not slideware",
    level: "Thesis — COMPILING",
    levelKind: "compiling",
    status: "compiling…",
    uptime: "→ 2027",
    tooltip: "PID 03 — still linking · ETA 2027",
    compiling: true,
  },
]

const TARGET_PCT = 68

export function Education(): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(reduced ? TARGET_PCT : 0)

  useEffect(() => {
    if (reduced) {
      setProgress(TARGET_PCT)
      return
    }
    setProgress(0)
    const t = window.setTimeout(() => setProgress(TARGET_PCT), 40)
    return () => window.clearTimeout(t)
  }, [reduced])

  return (
    <section className="relative" aria-labelledby="education-heading">
      <SectionLabel text="04 — EDUCATION" />
      <div className="wrap py-8 md:py-10">
        <h2 id="education-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          TRAINING HISTORY
          <SectionBadge text="// in progress" />
        </h2>
        <p className="mb-5 font-mono text-sm text-muted">
          {"// formal training, still compiling"}
        </p>

        <div className="mb-6 overflow-x-auto border-2 border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink text-bg dark:bg-[#E8E4DC] dark:text-[#121110]">
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  PID
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  CMD
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  STATUS
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  UPTIME
                </th>
              </tr>
            </thead>
            <tbody>
              {PROCESSES.map((row, i) => (
                <tr
                  key={row.pid}
                  className={cn(
                    "border-b-2 border-line last:border-b-0",
                    i % 2 === 1 ? "bg-surface" : "bg-transparent",
                  )}
                >
                  <td className="relative px-4 py-3.5 font-mono text-xs text-muted">
                    <span
                      className="peer cursor-help underline decoration-dotted decoration-muted underline-offset-2"
                      tabIndex={0}
                    >
                      {row.pid}
                    </span>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-2 z-10 mb-1 hidden whitespace-nowrap border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-ink normal-case shadow-[3px_3px_0_var(--line)] [@media(pointer:fine)]:peer-hover:block [@media(pointer:fine)]:peer-focus-visible:block"
                    >
                      {row.tooltip}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="mb-1.5">
                      <LevelBadge kind={row.levelKind} label={row.level} />
                    </div>
                    <div className="font-display text-base font-extrabold">
                      {row.cmd}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-ink-soft">
                      {row.detail}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] uppercase">
                    {row.compiling ? (
                      <div className="min-w-[9rem] max-w-[14rem]">
                        <div className="mb-1.5 text-accent-2">
                          COMPILING… {progress}%
                        </div>
                        <div
                          className="h-2 w-[68%] border-2 border-line bg-bg"
                          role="progressbar"
                          aria-valuenow={progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Thesis compile progress"
                        >
                          <div
                            className="h-full bg-accent-2 transition-[width] duration-[1200ms] ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span
                        className={cn(
                          row.levelKind === "unlocked" && "text-ok",
                          row.levelKind === "progress" && "text-accent",
                        )}
                      >
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] text-muted">
                    {row.uptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-2 border-dashed border-line bg-surface px-4 py-3">
          <p className="mb-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {"$ locale -a"}
          </p>
          <p className="font-mono text-sm tracking-[0.04em] text-ink-soft">
            UA (native) · RU (native) · SK (B2) · EN (B2)
          </p>
        </div>
      </div>
    </section>
  )
}

function LevelBadge({
  kind,
  label,
}: {
  kind: LevelKind
  label: string
}): ReactElement {
  return (
    <span
      className={cn(
        "inline-block border-2 border-line px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase",
        kind === "unlocked" && "bg-ok/15 text-ok",
        kind === "progress" && "bg-accent/15 text-accent",
        kind === "compiling" && "bg-accent-2/20 text-accent-2",
      )}
    >
      {label}
    </span>
  )
}
