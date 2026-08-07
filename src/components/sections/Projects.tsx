import type { ReactElement } from "react"
import { Window } from "@/components/Window"
import { Metric } from "@/components/Metric"
import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import type { Mood } from "@/components/hero/Mascot"

type Project = {
  idx: string
  name: string
  stack: string
  desc: string
  mood: Mood
  metrics?: { value: number; suffix?: string; label: string }[]
}

const PROJECTS: Project[] = [
  {
    idx: "01",
    name: "HabitForge",
    stack: "React Native · TypeScript · Supabase · Gemini API · Swift",
    desc: "AI-powered habit tracker. Gemini onboarding pipeline with structured JSON output — 95%+ parse success across 40+ eval scenarios.",
    mood: "happy",
    metrics: [
      { value: 111, suffix: "+", label: "test suites" },
      { value: 68, label: "pg migrations · RLS" },
      { value: 12, label: "edge functions" },
    ],
  },
  {
    idx: "02",
    name: "AI Chat Platform",
    stack: "Python · FastAPI · PostgreSQL · Redis · Docker · aiogram",
    desc: "Production LLM chat app for Telegram. 44 persona presets, free local models (Dolphin, Gemma) and a premium 70B tier (Euryale), crypto billing with automated payment verification.",
    mood: "surprised",
    metrics: [
      { value: 44, label: "persona presets" },
      { value: 3, label: "model tiers" },
      { value: 2, label: "free local models" },
    ],
  },
  {
    idx: "03",
    name: "SLE Terminal",
    stack: "Python · FastAPI · XGBoost · Next.js · Docker",
    desc: "Quantitative trading platform. XGBoost gatekeeper filters signals on multi-year OHLC data; offline ETL from MT5 miner → daily labeler → probability engine over 5+ years of M5 data.",
    mood: "skeptical",
    metrics: [
      { value: 18, suffix: "K+", label: "LOC backend" },
      { value: 11, label: "REST routers" },
      { value: 5, suffix: "+", label: "yr M5 data" },
    ],
  },
  {
    idx: "04",
    name: "MSc Thesis — RAG Assistant",
    stack: "RAG · Guardrails · Loop Engineering",
    desc: "In progress (expected 2027): a RAG assistant with guardrails and loop engineering — the hard part of LLM products: keeping outputs on the rails while iterating.",
    mood: "idle",
  },
]

interface ProjectsProps {
  onMood: (mood: Mood) => void
}

function ArrowIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="size-[22px]" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

export function Projects({ onMood }: ProjectsProps): ReactElement {
  return (
    <section id="projects" className="relative border-b-2 border-line">
      <SectionLabel text="01 — PROJECTS" />
      <div className="wrap py-14 md:py-[72px]">
        <Reveal>
          <Window num="01" title="PROJECTS">
            <h2 className="mb-5 text-[clamp(26px,4vw,40px)]">
              SHIPPED <span className="text-accent">MODULES</span>
              <SectionBadge text="// 4 shipped" />
            </h2>
            <p className="mb-9 max-w-[620px] text-ink-soft">
              Four products shipped end-to-end. Real numbers, real infra — not slideware.
            </p>

            <div className="flex flex-col gap-5">
              {PROJECTS.map((p) => (
                <article
                  key={p.idx}
                  className="group border-2 border-line bg-bg"
                  onMouseEnter={() => onMood(p.mood)}
                  onMouseLeave={() => onMood("idle")}
                  onFocus={() => onMood(p.mood)}
                  onBlur={() => onMood("idle")}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3.5 border-b-2 border-line px-5 py-4 transition-colors group-hover:bg-surface-2 group-focus-visible:bg-surface-2">
                    <span className="text-xs text-muted">[{p.idx}]</span>
                    <h3 className="font-display text-[clamp(19px,2.6vw,25px)] font-extrabold tracking-[-0.01em] transition-colors group-hover:text-accent group-focus-visible:text-accent">
                      {p.name}
                    </h3>
                    <span className="ml-auto text-accent opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                      <ArrowIcon />
                    </span>
                  </div>
                  <div className="px-5 py-[18px]">
                    <div className="mb-3 text-xs tracking-[0.06em] text-muted">{p.stack}</div>
                    <p className="mb-4 max-w-[640px] text-ink-soft">{p.desc}</p>
                    {p.metrics && (
                      <div className="flex flex-wrap gap-2.5">
                        {p.metrics.map((m) => (
                          <Metric
                            key={m.label}
                            value={m.value}
                            suffix={m.suffix}
                            label={m.label}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  )
}
