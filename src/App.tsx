import { useState, type ReactElement } from "react"
import { Sysbar } from "@/components/Sysbar"
import { Hero } from "@/components/hero/Hero"
import type { Mood } from "@/components/hero/Mascot"

export default function App(): ReactElement {
  const [mood, setMood] = useState<Mood>("idle")

  return (
    <main className="min-h-screen">
      <Sysbar />
      <Hero mood={mood} />

      {/* hover-reaction demo — remove in production, sections land via Cursor */}
      <section className="border-b-2 border-line">
        <div className="mx-auto max-w-[1080px] px-6 py-12">
          <div className="mb-6 text-xs uppercase tracking-[.12em] text-muted">
            <b className="text-accent">demo</b> — hover a project → mascot reacts
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ["HabitForge", "happy"],
                ["AI Chat", "surprised"],
                ["SLE Terminal", "skeptical"],
              ] as [string, Mood][]
            ).map(([name, m]) => (
              <div
                key={name}
                onMouseEnter={() => setMood(m)}
                onMouseLeave={() => setMood("idle")}
                className="border-2 border-line bg-surface p-5 shadow-[4px_4px_0_var(--line)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--line)]"
              >
                <div className="font-display text-lg font-extrabold">{name}</div>
                <div className="mt-1 text-xs text-muted">hover → {m}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-line bg-surface">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs uppercase tracking-[.1em] text-ink-soft">
          <div>
            <b className="text-ok">DANIIL OS</b> · PREŠOV · <span className="text-ink">v1.0</span>
          </div>
          <div>© 2026 · built by hand</div>
        </div>
      </footer>
    </main>
  )
}
