import { forwardRef, type ReactElement } from "react"
import { Mascot, type Mood } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"
import { Band } from "@/components/Band"
import { SectionLabel } from "@/components/SectionLabel"
import { HandCallout } from "@/components/HandCallout"
import { RadioDock } from "@/components/RadioDock"
import { QuoteBlock } from "@/components/QuoteBlock"
import type { TabId } from "@/components/TabBar"
import { cn } from "@/lib/utils"

const STATS = [
  { value: "4", label: "PRODUCTS IN PRODUCTION" },
  { value: "111+", label: "TESTS, ALL GREEN" },
  { value: "44", label: "CHAT PERSONAS" },
  { value: "18K+", label: "LINES OF CODE" },
]

interface WhoamiProps {
  mood?: Mood
  onMood?: (mood: Mood) => void
  onNavigate?: (id: TabId) => void
}

/** WHOAMI — текст слева, полароид справа; callouts только в потоке. */
export const Whoami = forwardRef<HTMLElement, WhoamiProps>(function Whoami(
  { mood = "idle", onMood, onNavigate },
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
              className="mb-4 text-[clamp(28px,4.4vw,48px)] leading-[1.15] tracking-tight normal-case"
            >
              ai/ml engineer, thesis-in-progress, and an honest… good guy.
            </h1>

            <p className="mb-5 max-w-[520px] text-sm tracking-[0.04em] text-ink-soft md:text-[15px]">
              I build things that work when it matters. Sometimes they even work
              when it doesn&apos;t.
            </p>

            {onNavigate && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate("projects")}
                  className="min-h-11 border-2 border-line bg-accent px-4 py-2 font-mono text-xs tracking-[0.1em] text-bg uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
                >
                  projects →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="min-h-11 border-2 border-line bg-ink px-4 py-2 font-mono text-xs tracking-[0.1em] text-bg uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-[#E8E4DC] dark:text-[#121110]"
                >
                  contact
                </button>
              </div>
            )}
          </div>

          <div className="relative mx-auto w-fit shrink-0 lg:mx-0 lg:mt-1">
            <div className="relative rotate-[4deg] border-2 border-line bg-bg p-3 pb-8 shadow-[6px_6px_0_var(--line)] transition-transform hover:rotate-[2deg]">
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

            <span className="absolute top-8 -left-5 z-[1] hidden rotate-[-12deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              HABITFORGE
            </span>
            <span className="absolute top-[42%] -right-7 z-[1] hidden rotate-[9deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              RAG
            </span>
            <span className="absolute top-[58%] -left-3 z-[1] hidden rotate-[-6deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              EVALS
            </span>

            {/* в потоке под полароидом — не absolute поверх рамки */}
            <div className="mt-5 pl-1">
              <HandCallout point="ne" rotate={-3}>
                site mascot
              </HandCallout>
            </div>
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

        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <QuoteBlock />
          <div>
            <HandCallout point="se" rotate={-2} className="mb-3">
              chipradio · close anytime
            </HandCallout>
            <RadioDock />
          </div>
        </div>

        <div className="mb-2">
          <HandCallout point="se" rotate={-2} className="mb-3">
            type help in the terminal
          </HandCallout>
          <Terminal />
          <p className="mt-3 font-mono text-xs tracking-[0.06em] text-muted">
            {">> 4 products in production · 0 slideware"}
          </p>
        </div>
      </div>
      <Band />
    </section>
  )
})
