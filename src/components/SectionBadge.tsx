import type { ReactElement } from "react"

interface SectionBadgeProps {
  text: string
}

/** Мета-бейдж у заголовка секции (~30 sec у KISA). */
export function SectionBadge({ text }: SectionBadgeProps): ReactElement {
  return (
    <span className="ml-3 inline-block border-2 border-line bg-surface px-2 py-0.5 align-middle font-mono text-[11px] font-normal tracking-[0.08em] text-muted uppercase">
      {text}
    </span>
  )
}
