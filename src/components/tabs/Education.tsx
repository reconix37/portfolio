import type { ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"

export function Education(): ReactElement {
  return (
    <section className="relative" aria-labelledby="education-heading">
      <SectionLabel text="04 — EDUCATION" />
      <div className="wrap py-8 md:py-10">
        <h2 id="education-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          TRAINING HISTORY
          <SectionBadge text="// in progress" />
        </h2>
        <p className="mb-8 font-mono text-sm text-muted">
          {"// fvt tuke · presov"}
        </p>

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1 border-b-2 border-line pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="font-display text-lg font-extrabold">
                Ing. — Intelligent Technologies in Industry{" "}
                <span className="ml-2 inline-block border-2 border-accent px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
                  in progress
                </span>
              </div>
              <div className="mt-1 text-[13px] text-ink-soft">
                TUKE · FVT · Prešov — thesis: RAG + guardrails + loop eng.
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs tracking-[0.08em] text-muted">
              2025 — 2027
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b-2 border-line pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="font-display text-lg font-extrabold">
                Bc. — Computer Support of Production Technologies
              </div>
              <div className="mt-1 text-[13px] text-ink-soft">TUKE · FVT · Prešov</div>
            </div>
            <span className="shrink-0 font-mono text-xs tracking-[0.08em] text-muted">
              2022 — 2025
            </span>
          </div>
        </div>

        <p className="font-mono text-sm tracking-[0.04em] text-ink-soft">
          LANGUAGES :: UA (native) · RU (native) · SK (B2) · EN (B2)
        </p>
      </div>
    </section>
  )
}
