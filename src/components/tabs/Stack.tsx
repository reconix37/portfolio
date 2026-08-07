import { useEffect, useState, type ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
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

const ROW_DELAY_MS = 150

/** Первый boot за сессию — повторный заход на вкладку без реплея. */
let stackBootDone = false

export function Stack(): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(() =>
    reduced || stackBootDone ? MODULES.length : 0,
  )

  useEffect(() => {
    if (reduced || stackBootDone) {
      setVisible(MODULES.length)
      stackBootDone = true
      return
    }

    let count = 0
    const id = window.setInterval(() => {
      count += 1
      setVisible(count)
      if (count >= MODULES.length) {
        window.clearInterval(id)
        stackBootDone = true
      }
    }, ROW_DELAY_MS)

    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <section className="relative" aria-labelledby="stack-heading">
      <SectionLabel text="03 — STACK" />
      <div className="wrap py-8 md:py-10">
        <h2 id="stack-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          LOADED KERNEL
          <SectionBadge text="// loaded" />
        </h2>
        <p className="mb-5 font-mono text-sm text-muted">
          {"// what's actually installed on this machine"}
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
              {MODULES.map((row, i) =>
                i < visible ? (
                  <BootRow key={row.module} row={row} index={i} animate={!reduced} />
                ) : null,
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function BootRow({
  row,
  index,
  animate,
}: {
  row: ModuleRow
  index: number
  animate: boolean
}): ReactElement {
  const [on, setOn] = useState(!animate)

  useEffect(() => {
    if (!animate) {
      setOn(true)
      return
    }
    const id = window.requestAnimationFrame(() => setOn(true))
    return () => window.cancelAnimationFrame(id)
  }, [animate])

  return (
    <tr
      className={cn(
        "border-b-2 border-line last:border-b-0 transition-[opacity,transform] duration-300 ease-out",
        index % 2 === 1 ? "bg-surface" : "bg-transparent",
        on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
      )}
    >
      <td className="px-4 py-3.5 font-display text-base font-extrabold">
        {row.module}
      </td>
      <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] uppercase">
        <span className="text-ok">[OK]</span>{" "}
        <span className="text-accent">{row.status}</span>
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
        {row.exports}
      </td>
    </tr>
  )
}
