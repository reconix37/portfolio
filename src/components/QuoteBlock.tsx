import type { ReactElement } from "react"

/** Цитата в стиле // QUOTE.TXT — характер без воды. */
export function QuoteBlock(): ReactElement {
  return (
    <aside className="border-2 border-line bg-bg p-4 shadow-[var(--shadow)] md:p-5">
      <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
        {"// QUOTE.TXT"}
      </p>
      <p className="mb-4 text-[clamp(16px,2.2vw,20px)] leading-snug tracking-[0.02em]">
        <span className="mr-1 font-display text-3xl leading-none text-accent" aria-hidden="true">
          "
        </span>
        Ship evals before vibes. Structured output or it doesn&apos;t leave the laptop.
      </p>
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
        — motives · short form
      </p>
    </aside>
  )
}
