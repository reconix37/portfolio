import type { ReactElement } from "react"
import { Mascot } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"

export function Hero(): ReactElement {
  return (
    <header className="relative overflow-hidden border-b-2 border-line py-14 md:py-[72px] md:pb-20">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-14">
        <div className="order-2 md:order-1">
          <p className="mb-5 text-[13px] tracking-[0.14em] text-muted uppercase">
            <b className="font-bold text-accent">system online</b>
            {" — "}
            ai/ml engineer · presov
          </p>

          <h1 className="mb-2 text-[clamp(44px,7vw,84px)]">
            <span className="hero-outline">DANIIL</span>
            <br />
            VERKHOVSKYI<span className="text-accent">.</span>
          </h1>

          <p className="mb-9 text-sm tracking-[0.04em] text-ink-soft">
            I build AI products from data to production —
            <br />
            generative pipelines,{" "}
            <b className="font-bold text-accent">structured LLM output</b>, evals, real infra.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <a
              href="#projects"
              className="inline-block border-2 border-line bg-accent px-[22px] py-[13px] text-[13px] tracking-[0.1em] text-bg uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              View work
            </a>
            <a
              href="#contact"
              className="inline-block border-2 border-line bg-transparent px-[22px] py-[13px] text-[13px] tracking-[0.1em] text-ink uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform,background] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent-2 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Mascot />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1080px] px-6 md:mt-14">
        <Terminal />
      </div>
    </header>
  )
}
