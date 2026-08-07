import { useState } from 'react'
import Mascot from './components/Mascot'
import type { Mood } from './components/Mascot'

export default function App() {
  const [mood, setMood] = useState<Mood>('idle')

  return (
    <main className="min-h-screen">
      {/* sysbar */}
      <div className="border-b-2 border-line bg-surface">
        <div className="wrap flex items-center justify-between py-2.5 text-xs uppercase tracking-[.1em]">
          <div><b className="text-accent">DANIIL</b> OS <span className="text-muted">v1.0</span></div>
          <div className="text-muted">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {/* hero */}
      <header className="border-b-2 border-line">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] md:items-center">
          <div>
            <div className="mb-5 text-[13px] uppercase tracking-[.14em] text-muted">
              <b className="text-accent">system online</b> — ai/ml engineer · presov
            </div>
            <h1 className="text-[clamp(44px,7vw,84px)] leading-[1.02]">
              <span className="text-transparent" style={{ WebkitTextStroke: '2px var(--ink)' }}>DANIIL</span>
              <br />
              VERKHOVSKYI<span className="text-accent">.</span>
            </h1>
            <p className="mt-4 mb-8 text-sm text-ink-soft">
              I build AI products from data to production —<br />
              generative pipelines, <b className="text-accent">structured LLM output</b>, evals, real infra.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a href="#projects" className="btn btn-solid">View work</a>
              <a href="#contact" className="btn btn-line">Contact</a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Mascot mood={mood} size={240} />
            <div className="text-[11px] uppercase tracking-[.08em] text-muted">▲ watching you</div>
            {/* mood tester — remove in production */}
            <div className="mt-2 flex gap-2 flex-wrap justify-center">
              {(['idle', 'happy', 'surprised', 'skeptical'] as Mood[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`border-2 border-line px-3 py-1.5 text-[11px] uppercase tracking-[.08em] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_var(--line)] ${
                    mood === m ? 'bg-accent text-[var(--bg)]' : 'bg-transparent'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* hover-reaction demo — remove in production */}
      <section className="border-b-2 border-line">
        <div className="wrap py-12">
          <div className="mb-6 text-xs uppercase tracking-[.12em] text-muted"><b className="text-accent">demo</b> — hover a project → mascot reacts</div>
          <div className="grid gap-4 sm:grid-cols-3">
            {([
              ['HabitForge', 'happy'],
              ['AI Chat', 'surprised'],
              ['SLE Terminal', 'skeptical'],
            ] as [string, Mood][]).map(([name, m]) => (
              <div
                key={name}
                onMouseEnter={() => setMood(m)}
                onMouseLeave={() => setMood('idle')}
                className="border-2 border-line bg-surface p-5 shadow-[4px_4px_0_var(--line)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--line)]"
              >
                <div className="font-display text-lg font-extrabold">{name}</div>
                <div className="mt-1 text-xs text-muted">hover → {m}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-line bg-surface">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-4 text-xs uppercase tracking-[.1em] text-ink-soft">
          <div><b className="text-ok">DANIIL OS</b> · PREŠOV · <span className="text-ink">v1.0</span></div>
          <div>© 2026 · built by hand</div>
        </div>
      </footer>
    </main>
  )
}
