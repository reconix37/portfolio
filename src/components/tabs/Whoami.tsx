import { forwardRef, type ReactElement } from "react"
import { Mascot, MASCOT_SIZE_HERO, type Mood } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"
import { Band } from "@/components/Band"
import { SectionLabel } from "@/components/SectionLabel"

interface WhoamiProps {
  mood?: Mood
  onMood?: (mood: Mood) => void
}

export const Whoami = forwardRef<HTMLElement, WhoamiProps>(function Whoami(
  { mood = "idle", onMood },
  ref,
): ReactElement {
  return (
    <section ref={ref} className="relative" aria-labelledby="whoami-heading">
      <SectionLabel text="01 — WHOAMI" />
      <div className="wrap py-8 md:py-10">
        <p className="mb-5 font-mono text-[13px] tracking-[0.14em] text-muted uppercase">
          {"// system online — ai/ml engineer · presov"}
        </p>

        <h1
          id="whoami-heading"
          className="mb-4 text-[clamp(28px,4.5vw,48px)] leading-[1.15]"
        >
          I BUILD{" "}
          <span className="inline-block bg-accent px-1.5 py-0.5 text-bg dark:text-[#121110]">
            AI PRODUCTS
          </span>{" "}
          THAT{" "}
          <span className="inline-block bg-accent px-1.5 py-0.5 text-bg dark:text-[#121110]">
            SURVIVE PRODUCTION
          </span>
        </h1>

        <p className="mb-8 max-w-[640px] text-sm tracking-[0.04em] text-ink-soft">
          Generative pipelines.{" "}
          <b className="font-bold text-accent">Structured LLM output</b>. Evals
          that catch regressions before users do.
        </p>

        <div className="relative mb-8 flex flex-col gap-8 md:flex-row md:items-start">
          <div className="relative z-10 min-w-0 flex-1">
            <Terminal />
            <p className="mt-3 font-mono text-xs tracking-[0.06em] text-muted">
              {">> 4 products shipped · 0 slideware"}
            </p>
          </div>

          <div className="relative mx-auto shrink-0 md:mx-0">
            <Mascot
              mood={mood}
              size={MASCOT_SIZE_HERO}
              interactive
              onMoodBurst={onMood}
            />
            <span className="absolute top-4 -left-3 hidden rotate-[-8deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              HABITFORGE
            </span>
            <span className="absolute top-1/3 -right-2 hidden rotate-[7deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              RAG
            </span>
            <span className="absolute bottom-10 left-0 hidden rotate-[-4deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              EVALS
            </span>
          </div>
        </div>
      </div>
      <Band />
    </section>
  )
})
