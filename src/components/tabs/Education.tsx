import type { ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { cn } from "@/lib/utils"

type ProcessRow = {
  pid: string
  cmd: string
  detail: string
  status: string
  uptime: string
  active?: boolean
}

const PROCESSES: ProcessRow[] = [
  {
    pid: "01",
    cmd: "ing.intelligent-tech",
    detail: "TUKE · FVT · Prešov — thesis: RAG + guardrails + loop eng.",
    status: "running",
    uptime: "2025 — 2027",
    active: true,
  },
  {
    pid: "02",
    cmd: "bc.computer-support",
    detail: "TUKE · FVT · Prešov",
    status: "exited 0",
    uptime: "2022 — 2025",
  },
  {
    pid: "03",
    cmd: "thesis.rag-guardrails",
    detail: "Ing. thesis pipeline — not slideware",
    status: "compiling…",
    uptime: "→ 2027",
    active: true,
  },
]

export function Education(): ReactElement {
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
                  <td className="px-4 py-3.5 font-mono text-xs text-muted">
                    {row.pid}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-display text-base font-extrabold">
                      {row.cmd}
                    </div>
                    <div className="mt-0.5 font-mono text-xs text-ink-soft">
                      {row.detail}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3.5 font-mono text-xs tracking-[0.08em] uppercase",
                      row.active ? "text-accent" : "text-ink-soft",
                    )}
                  >
                    {row.status}
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
