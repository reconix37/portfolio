import type { ReactElement } from "react"

interface SectionLabelProps {
  text: string
}

/** Вертикальный лейбл слева от секции (KISA-style). На мобиле скрыт. */
export function SectionLabel({ text }: SectionLabelProps): ReactElement {
  return (
    <div
      className="pointer-events-none absolute top-14 bottom-14 left-3 z-10 hidden md:flex"
      aria-hidden="true"
    >
      <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase [writing-mode:vertical-rl] rotate-180">
        {text}
      </span>
    </div>
  )
}
