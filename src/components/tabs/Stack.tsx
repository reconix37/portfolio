import type { ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { cn } from "@/lib/utils"

type ModuleRow = {
  module: string
  status: string
  exports: string
}

const MODULES: ModuleRow[] = [
  {
    module: "gen.ai.llm",
    status: "loaded",
    exports:
      "Prompt Engineering · Structured Output · LLM Evals · Red-Teaming · Gemini API · RAG",
  },
  {
    module: "ml.data",
    status: "loaded",
    exports:
      "Python · Pandas / NumPy · XGBoost · Feature Engineering · ETL Pipelines · Backtesting",
  },
  {
    module: "backend",
    status: "loaded",
    exports:
      "FastAPI · PostgreSQL · Redis · Docker · Supabase (Auth · RLS · Edge) · aiogram",
  },
  {
    module: "frontend",
    status: "loaded",
    exports: "TypeScript · React · React Native · Next.js · Tailwind CSS",
  },
  {
    module: "quality.ops",
    status: "loaded",
    exports: "pytest · Jest · CI/CD · Sentry · Git / GitHub",
  },
]

export function Stack(): ReactElement {
  return (
    <section className="relative" aria-labelledby="stack-heading">
      <SectionLabel text="03 — STACK" />
      <div className="wrap py-8 md:py-10">
        <h2 id="stack-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          LOADED KERNEL
          <SectionBadge text="// loaded" />
        </h2>
        <p className="mb-5 font-mono text-sm text-muted">
          {"// $ lsmod | grep daniil"}
        </p>

        <div className="overflow-x-auto border-2 border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink text-bg dark:bg-[#E8E4DC] dark:text-[#121110]">
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  MODULE
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  STATUS
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  EXPORTS
                </th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map((row, i) => (
                <tr
                  key={row.module}
                  className={cn(
                    "border-b-2 border-line last:border-b-0",
                    i % 2 === 1 ? "bg-surface" : "bg-transparent",
                  )}
                >
                  <td className="px-4 py-3.5 font-display text-base font-extrabold">
                    {row.module}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] text-accent uppercase">
                    {row.status}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {row.exports}
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
