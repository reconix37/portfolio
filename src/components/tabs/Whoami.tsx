import { forwardRef, type ReactElement } from "react"
import { Mascot, type Mood } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"
import { Band } from "@/components/Band"
import { SectionLabel } from "@/components/SectionLabel"
import { HandCallout } from "@/components/HandCallout"
import { RadioDock } from "@/components/RadioDock"
import { cn } from "@/lib/utils"

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

/** WHOAMI — композиция как у deploychan: текст слева, полароид справа, терминал ниже. */
export const Whoami = forwardRef<HTMLElement, WhoamiProps>(function Whoami(
  { mood = "idle", onMood },
  ref,
): ReactElement {
  return (
    <section ref={ref} className="relative" aria-labelledby="whoami-heading">
      <SectionLabel text="01 — WHOAMI" />
      <div className="wrap py-6 md:py-8">
        <div className="mb-8 flex flex-col gap-8 lg:mb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 lg:max-w-[560px]">
            <p className="mb-4 font-mono text-[13px] tracking-[0.14em] text-muted uppercase">
              {"// system online — ai/ml engineer · presov"}
            </p>

            <h1
              id="whoami-heading"
              className="mb-4 text-[clamp(30px,4.8vw,52px)] leading-[1.12]"
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

            <p className="mb-5 max-w-[520px] text-sm tracking-[0.04em] text-ink-soft md:text-[15px]">
              Generative pipelines.{" "}
              <b className="font-bold text-accent">Structured LLM output</b>. Evals
              that catch regressions before users do.
            </p>

            <p className="mb-3 font-mono text-xs tracking-[0.06em] text-muted">
              {">> 4 products shipped · 0 slideware"}
            </p>
            <HandCallout rotate={-3}>type help in the terminal below</HandCallout>
          </div>

          <div className="relative mx-auto w-fit shrink-0 lg:mx-0 lg:mt-1">
            <div className="rotate-[4deg] border-2 border-line bg-bg p-3 pb-9 shadow-[6px_6px_0_var(--line)] transition-transform hover:rotate-[2deg]">
              <div className="relative border-2 border-line bg-accent-2">
                <Mascot
                  mood={mood}
                  size={240}
                  interactive
                  onMoodBurst={onMood}
                />
                <span className="absolute top-0 right-0 border-2 border-line bg-accent px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-bg uppercase dark:text-[#121110]">
                  OS-TAN
                </span>
              </div>
            </div>
            <HandCallout
              rotate={8}
              className="absolute -right-2 -bottom-3 md:-right-14"
            >
              site mascot
            </HandCallout>
            <span className="absolute top-8 -left-5 hidden rotate-[-12deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              HABITFORGE
            </span>
            <span className="absolute top-[42%] -right-7 hidden rotate-[9deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              RAG
            </span>
            <span className="absolute bottom-20 left-0 hidden rotate-[-6deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              EVALS
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 border-y-2 border-line md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "px-3 py-5 md:px-4",
                i > 0 && "border-t-2 border-dashed border-line md:border-t-0 md:border-l-2 md:border-dashed",
              )}
            >
              <div className="font-display text-[clamp(26px,3.5vw,36px)] font-extrabold tracking-tight text-accent">
                {s.value}
              </div>
              <div className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* радио в потоке — как MOCP у KISA, не floating */}
        <div className="mb-8">
          <HandCallout rotate={-2} className="mb-3">
            chipradio · close anytime
          </HandCallout>
          <RadioDock />
        </div>

        <div className="mb-2">
          <Terminal />
        </div>
      </div>
      <Band />
    </section>
  )
})
