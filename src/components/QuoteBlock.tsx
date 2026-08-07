import type { ReactElement } from "react"

/** Quote как у KISA: крупная кавычка поверх текста, serif, линия, mono-подпись. */
export function QuoteBlock(): ReactElement {
  return (
    <aside className="flex h-full min-h-[220px] flex-col justify-center py-2 md:py-4">
      <p className="mb-5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
        {"// QUOTE.TXT"}
      </p>

      <div className="relative max-w-[36rem] pt-7 md:pt-8">
        {/* кавычка — оверлап на первую строку, как у референса */}
        <span
          className="pointer-events-none absolute -left-1 top-0 z-0 select-none text-[clamp(72px,9vw,104px)] leading-none text-accent"
          style={{ fontFamily: "var(--font-quote)" }}
          aria-hidden="true"
        >
          “
        </span>

        <p
          className="relative z-10 text-[clamp(20px,2.4vw,28px)] leading-[1.35] tracking-[0.005em] text-ink"
          style={{ fontFamily: "var(--font-quote)" }}
        >
          I write code and build products because it&apos;s fun. That&apos;s it.
          That&apos;s the whole reason.
        </p>
      </div>

      <div className="mt-6 h-px w-full max-w-[18rem] bg-line" aria-hidden="true" />

      <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
        motives · short form
      </p>
    </aside>
  )
}
