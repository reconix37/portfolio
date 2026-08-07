import type { ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"

const CATS: { label: string; tags: string }[] = [
  {
    label: "GEN AI / LLM:",
    tags: "Prompt Engineering · Structured Output · LLM Evals · Red-Teaming · Gemini API · RAG",
  },
  {
    label: "ML / DATA:",
    tags: "Python · Pandas / NumPy · XGBoost · Feature Engineering · ETL Pipelines · Backtesting",
  },
  {
    label: "BACKEND:",
    tags: "FastAPI · PostgreSQL · Redis · Docker · Supabase (Auth · RLS · Edge) · aiogram",
  },
  {
    label: "FRONTEND:",
    tags: "TypeScript · React · React Native · Next.js · Tailwind CSS",
  },
  {
    label: "QUALITY / OPS:",
    tags: "pytest · Jest · CI/CD · Sentry · Git / GitHub",
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
        <p className="mb-8 font-mono text-sm text-muted">
          {"// what i actually ship with"}
        </p>

        <div className="flex flex-col gap-4">
          {CATS.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col gap-1 border-b-2 border-dashed border-line pb-4 last:border-b-0 sm:flex-row sm:gap-4"
            >
              <span className="shrink-0 font-mono text-xs tracking-[0.12em] text-accent uppercase sm:w-40">
                {cat.label}
              </span>
              <span className="font-mono text-sm text-ink-soft">{cat.tags}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
