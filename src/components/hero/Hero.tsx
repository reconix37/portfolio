import { forwardRef, type ReactElement } from "react"
import { Mascot, MASCOT_SIZE_HERO, type Mood } from "@/components/hero/Mascot"
import { Terminal } from "@/components/hero/Terminal"

interface HeroProps {
  mood?: Mood
}

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { mood = "idle" },
  ref,
): ReactElement {
  return (
    <header
      ref={ref}
      className="relative overflow-hidden border-b-2 border-line py-14 md:py-[72px] md:pb-20"
    >
      <div className="wrap relative">
        {/* текст: место справа под крупного маскота */}
        <div className="relative z-10 md:max-w-[calc(100%-300px)] md:pr-6">
          <p className="mb-5 text-[13px] tracking-[0.14em] text-muted uppercase">
            <b className="font-bold text-accent">system online</b>
            {" — "}
            <span className="inline-block bg-accent px-1.5 py-0.5 font-bold text-[var(--bg)]">
              AI/ML
            </span>{" "}
            <span className="inline-block bg-accent px-1.5 py-0.5 font-bold text-[var(--bg)]">
              ENGINEER
            </span>
            {" · presov"}
          </p>

          <h1 className="mb-2 text-[clamp(40px,6vw,78px)]">
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

        {/* absolute — якорь у имени; стикеры вокруг (маскот не трогаем) */}
        <div className="pointer-events-none relative mt-8 flex justify-center md:absolute md:top-6 md:-right-2 md:mt-0 md:block lg:right-0">
          <div className="relative">
            <Mascot mood={mood} size={MASCOT_SIZE_HERO} />
            <span className="absolute top-4 -left-3 hidden rotate-[-8deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block md:-left-8">
              HABITFORGE
            </span>
            <span className="absolute top-1/3 -right-2 hidden rotate-[7deg] border-2 border-line bg-surface px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-ink uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block md:-right-6">
              RAG
            </span>
            <span className="absolute bottom-10 left-0 hidden rotate-[-4deg] border-2 border-line bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-accent uppercase shadow-[3px_3px_0_var(--line)] sm:inline-block md:-left-4">
              EVALS
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-10 md:mt-14">
          <Terminal />
        </div>
      </div>
    </header>
  )
})
