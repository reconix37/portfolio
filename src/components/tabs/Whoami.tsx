import { forwardRef, type ReactElement } from "react"
import { Mascot, MASCOT_SIZE_HERO, type Mood } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"
import { Band } from "@/components/Band"
import { SectionLabel } from "@/components/SectionLabel"

const STATS = [
  { value: "4", label: "SHIPPED MODULES" },
  { value: "111+", label: "TEST SUITES" },
  { value: "44", label: "CHAT PERSONAS" },
  { value: "18K+", label: "LOC · SLE" },
]

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

        <div className="relative mb-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="relative z-10 min-w-0 flex-1">
            <Terminal />
            <p className="mt-3 font-mono text-xs tracking-[0.06em] text-muted">
              {">> 4 products shipped · 0 slideware"}
            </p>
            <p className="handwrite mt-2 text-accent" aria-hidden="true">
              ↗ type help in the terminal
            </p>
          </div>

          {/* полароид-рамка маскота */}
          <div className="relative mx-auto w-fit shrink-0 md:mx-0">
            <div className="rotate-[3deg] border-2 border-line bg-bg p-2.5 pb-8 shadow-[5px_5px_0_var(--line)] transition-transform hover:rotate-[1deg]">
              <div className="relative border-2 border-line bg-accent-2">
                <Mascot
                  mood={mood}
                  size={MASCOT_SIZE_HERO}
                  interactive
                  onMoodBurst={onMood}
                />
                <span className="absolute -top-0.5 -right-0.5 border-2 border-line bg-ink px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-bg uppercase dark:bg-[#E8E4DC] dark:text-[#121110]">
                  OS-TAN
                </span>
              </div>
            </div>
            <p className="handwrite absolute -right-2 -bottom-1 rotate-[6deg] text-accent md:-right-8">
              ↗ site mascot
            </p>
            <span className="absolute top-6 -left-4 hidden rotate-[-10deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              HABITFORGE
            </span>
            <span className="absolute top-1/3 -right-6 hidden rotate-[8deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              RAG
            </span>
            <span className="absolute bottom-16 left-2 hidden rotate-[-5deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              EVALS
            </span>
          </div>
        </div>

        {/* stats strip */}
        <div className="mb-2 grid grid-cols-2 border-2 border-line md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-4 ${i % 2 === 1 ? "border-l-2 border-line" : ""} md:border-l-2 md:border-line md:first:border-l-0`}
            >
              <div className="font-display text-[clamp(22px,3vw,28px)] font-extrabold text-accent">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Band />
    </section>
  )
})
