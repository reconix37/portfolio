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
  { value: "24/7", label: "ALWAYS ON DUTY · RED BULL" },
  { value: "100%", label: "VIBE-CODED · ZERO SLIDEWARE" },
  { value: "03:00", label: "PRIME HOUR FOR DEPLOYS" },
  { value: "1", label: "BUG THAT BECAME A FEATURE" },
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
        <div className="mb-8 flex flex-col gap-8 lg:mb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 lg:max-w-[680px]">
            <p className="mb-5 font-mono text-[13px] tracking-[0.16em] text-muted uppercase md:text-sm">
              {"// system online — ai/ml engineer · presov"}
            </p>

            {/* шапка как у KISA: serif + плашка + курсивный хвост */}
            <h1
              id="whoami-heading"
              className="mb-7 text-[clamp(40px,6.5vw,76px)] leading-[1.08] tracking-[-0.015em] text-ink"
              style={{ fontFamily: "var(--font-quote)" }}
            >
              <span className="block">ai/ml engineer,</span>
              <span className="mt-2.5 inline-block border-2 border-line bg-accent px-3 py-1.5 font-display text-[0.72em] leading-none font-extrabold tracking-[0.04em] text-bg uppercase dark:text-[#121110]">
                shipper
              </span>
              <span className="mt-2.5 block">and an honest…</span>
              <span className="mt-1.5 block italic text-ink-soft">good guy.</span>
            </h1>

            <p className="mb-7 max-w-[38rem] font-mono text-[15px] leading-relaxed tracking-[0.02em] text-ink-soft md:text-base lg:text-[17px]">
              I build things that{" "}
              <span className="border border-line bg-accent px-1.5 py-0.5 font-bold text-bg dark:text-[#121110]">
                work when it matters
              </span>
              . Sometimes they even work when it doesn&apos;t.
            </p>

            {onNavigate && (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("projects")}
                  className="min-h-12 border-2 border-line bg-accent px-5 py-2.5 font-mono text-[13px] tracking-[0.1em] text-bg uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
                >
                  projects →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="min-h-12 border-2 border-line bg-transparent px-5 py-2.5 font-mono text-[13px] tracking-[0.1em] text-ink uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform,background-color] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  contact
                </button>
              </div>
            )}
          </div>

          <div className="relative mx-auto w-fit shrink-0 lg:mx-0 lg:mt-10 xl:mt-12">
            <div className="relative rotate-[4deg] border-2 border-line bg-bg p-3.5 pb-10 shadow-[6px_6px_0_var(--line)] transition-transform hover:rotate-[2deg]">
              <div className="relative border-2 border-line bg-accent-2">
                <Mascot
                  mood={mood}
                  size={340}
                  interactive
                  onMoodBurst={onMood}
                />
                <span className="absolute top-0 right-0 border-2 border-line bg-accent px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-bg uppercase dark:text-[#121110]">
                  OS-TAN™
                </span>
              </div>
            </div>

            <span className="absolute top-6 -left-8 z-[1] hidden rotate-[-14deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              99% red bull
            </span>
            <span className="absolute top-[38%] -right-14 z-[1] hidden rotate-[11deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              vibe coded
            </span>
            <span className="absolute top-[62%] -left-6 z-[1] hidden rotate-[-8deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block">
              no slideware
            </span>

            {/* в потоке под полароидом — не absolute поверх рамки */}
            <div className="mt-6 pl-1">
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
                "flex flex-col justify-center gap-2.5 px-4 py-6 md:px-5",
                i % 2 === 1 && "border-l-2 border-dashed border-line",
                i >= 2 && "border-t-2 border-dashed border-line",
                "md:border-t-0",
                i > 0 && "md:border-l-2",
              )}
            >
              <div
                className="font-mono text-[clamp(30px,3.8vw,44px)] leading-none font-bold tracking-tight text-accent"
                style={{
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum", "ordn" 0, "sups" 0',
                  fontVariant: "normal",
                }}
              >
                {s.value}
              </div>
              <div className="border-t border-line pt-2 font-mono text-[10px] leading-snug tracking-[0.14em] text-muted uppercase md:text-[11px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <QuoteBlock />
          <div className="relative">
            <HandCallout point="se" rotate={-2} className="mb-4 text-[13px] italic md:text-sm">
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
