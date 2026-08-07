import type { ReactElement } from "react"
import { Window } from "@/components/Window"
import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/SectionLabel"

const LANGS = [
  { name: "Ukrainian", level: "NATIVE", width: "100%" },
  { name: "Russian", level: "FLUENT", width: "90%" },
  { name: "Slovak", level: "B2", width: "75%" },
  { name: "English", level: "B2", width: "75%" },
]

export function Education(): ReactElement {
  return (
    <section id="education" className="relative border-b-2 border-line">
      <SectionLabel text="03 — EDUCATION" />
      <div className="wrap py-14 md:py-[72px]">
        <Reveal>
          <Window num="03" title="EDUCATION">
            <h2 className="mb-5 text-[clamp(26px,4vw,40px)]">
              School of <span className="text-accent">hard knocks</span>
            </h2>
            <p className="mb-9 max-w-[620px] text-ink-soft">
              TUKE, Faculty of Manufacturing Technologies, Prešov. Ing. in progress — thesis is the
              real teacher.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border-2 border-line bg-bg p-5">
                <div className="mb-1.5 font-display text-[17px] font-extrabold">
                  Ing. — Intelligent Technologies in Industry{" "}
                  <span className="relative top-0.5 ml-2 border-2 border-accent px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] text-accent uppercase">
                    in progress
                  </span>
                </div>
                <div className="mb-2.5 text-[13px] text-ink-soft">TUKE · FVT · Prešov</div>
                <div className="mb-3 text-xs text-muted">2025 — 2027</div>
                <p className="text-[13px] text-ink-soft">
                  MSc track: intelligent systems, applied ML, industrial technologies.
                </p>
                <div className="mt-3 border-t-2 border-dashed border-line pt-3 text-xs text-ink-soft">
                  <b className="font-bold text-ok">THESIS:</b> RAG assistant with guardrails &amp;
                  loop engineering. Expected 2027.
                </div>
              </div>

              <div className="border-2 border-line bg-bg p-5">
                <div className="mb-1.5 font-display text-[17px] font-extrabold">
                  Bc. — Computer Support of Production Technologies
                </div>
                <div className="mb-2.5 text-[13px] text-ink-soft">TUKE · FVT · Prešov</div>
                <div className="mb-3 text-xs text-muted">2022 — 2025</div>
                <p className="text-[13px] text-ink-soft">
                  Bachelor&apos;s: software support for production, automation, data handling.
                </p>
              </div>
            </div>

            <div className="mt-9">
              <h3 className="mb-4 font-display text-xl font-extrabold">
                Languages <span className="text-accent">::</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {LANGS.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-baseline gap-3 border-2 border-line bg-bg px-4 py-3"
                  >
                    <b className="font-display text-base font-extrabold">{l.name}</b>
                    <span className="relative h-2.5 max-w-[200px] flex-1 border-2 border-line bg-surface-2">
                      <i
                        className="absolute inset-y-0 left-0 bg-accent"
                        style={{ width: l.width }}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-auto text-xs tracking-[0.06em] text-muted">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  )
}
