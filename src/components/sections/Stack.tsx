import type { ReactElement } from "react"
import { Window } from "@/components/Window"
import { Reveal } from "@/components/Reveal"
import { cn } from "@/lib/utils"

type Tag = { label: string; hot?: boolean }

const CATS: { head: ReactElement; tags: Tag[] }[] = [
  {
    head: (
      <>
        <b className="font-bold text-accent">GEN AI</b> · LLM
      </>
    ),
    tags: [
      { label: "Prompt Engineering ▲", hot: true },
      { label: "Structured Output ▲", hot: true },
      { label: "LLM Evals" },
      { label: "Red-Teaming" },
      { label: "Gemini API" },
      { label: "RAG" },
    ],
  },
  {
    head: (
      <>
        <b className="font-bold text-accent">ML</b> · DATA
      </>
    ),
    tags: [
      { label: "Python ▲", hot: true },
      { label: "Pandas / NumPy" },
      { label: "XGBoost" },
      { label: "Feature Engineering" },
      { label: "ETL Pipelines" },
      { label: "Backtesting" },
    ],
  },
  {
    head: (
      <>
        <b className="font-bold text-accent">BACKEND</b>
      </>
    ),
    tags: [
      { label: "FastAPI ▲", hot: true },
      { label: "PostgreSQL" },
      { label: "Redis" },
      { label: "Docker" },
      { label: "Supabase (Auth · RLS · Edge)" },
      { label: "aiogram" },
    ],
  },
  {
    head: (
      <>
        <b className="font-bold text-accent">FRONTEND</b>
      </>
    ),
    tags: [
      { label: "TypeScript ▲", hot: true },
      { label: "React" },
      { label: "React Native" },
      { label: "Next.js" },
      { label: "Tailwind CSS" },
    ],
  },
  {
    head: (
      <>
        <b className="font-bold text-accent">QUALITY</b> · OPS
      </>
    ),
    tags: [
      { label: "pytest ▲", hot: true },
      { label: "Jest" },
      { label: "CI/CD" },
      { label: "Sentry" },
      { label: "Git / GitHub" },
    ],
  },
]

export function Stack(): ReactElement {
  return (
    <section id="stack" className="border-b-2 border-line">
      <div className="wrap py-14 md:py-[72px]">
        <Reveal>
          <Window num="02" title="STACK">
            <h2 className="mb-5 text-[clamp(26px,4vw,40px)]">
              Toolkit <span className="text-accent">{"//"}</span>
            </h2>
            <p className="mb-9 max-w-[620px] text-ink-soft">
              The layers I actually use in production.{" "}
              <span className="text-accent">▲ = daily driver</span>
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATS.map((cat, i) => (
                <div key={i} className="border-2 border-line bg-bg">
                  <div className="border-b-2 border-line bg-surface-2 px-4 py-3 text-xs tracking-[0.12em] uppercase">
                    {cat.head}
                  </div>
                  <div className="p-4">
                    {cat.tags.map((t) => (
                      <span
                        key={t.label}
                        className={cn(
                          "mb-1.5 mr-1.5 inline-block border-2 border-line px-2.5 py-1 text-xs shadow-[2px_2px_0_var(--line)] transition-[transform,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--line)]",
                          t.hot && "border-accent text-accent",
                        )}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  )
}
