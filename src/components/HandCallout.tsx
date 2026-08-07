import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"

type Point = "ne" | "nw" | "se" | "sw"

interface HandCalloutProps {
  children: ReactNode
  className?: string
  /** градусы наклона — держим мягко, иначе текст лезет в соседние блоки */
  rotate?: number
  /** куда смотрит стрелка (к цели) */
  point?: Point
}

const ARROWS: Record<Point, ReactElement> = {
  ne: (
    <svg viewBox="0 0 32 32" className="size-[1.15em] shrink-0" fill="none" aria-hidden="true">
      <path d="M7 25 L23 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      <path d="M11 9 H23 V21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  ),
  nw: (
    <svg viewBox="0 0 32 32" className="size-[1.15em] shrink-0" fill="none" aria-hidden="true">
      <path d="M25 25 L9 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      <path d="M9 21 V9 H21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  ),
  se: (
    <svg viewBox="0 0 32 32" className="size-[1.15em] shrink-0" fill="none" aria-hidden="true">
      <path d="M7 7 L23 23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      <path d="M11 23 H23 V11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  ),
  sw: (
    <svg viewBox="0 0 32 32" className="size-[1.15em] shrink-0" fill="none" aria-hidden="true">
      <path d="M25 7 L9 23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
      <path d="M9 11 V23 H21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  ),
}

/**
 * Handwritten callout. Всегда в потоке документа (не absolute поверх блоков) —
 * иначе наклонный текст налазит на соседний контент.
 * Стрелки вниз (se/sw) — после текста; вверх (ne/nw) — перед ним.
 */
export function HandCallout({
  children,
  className,
  rotate = 0,
  point = "ne",
}: HandCalloutProps): ReactElement {
  const tilt = Math.max(-4, Math.min(4, rotate))
  const arrowAfter = point === "se" || point === "sw"
  return (
    <p
      className={cn(
        "handwrite pointer-events-none max-w-full items-center gap-1.5 text-accent select-none",
        className,
        "inline-flex",
      )}
      style={
        tilt !== 0
          ? { transform: `rotate(${tilt}deg)`, transformOrigin: "left center" }
          : undefined
      }
      aria-hidden="true"
    >
      {!arrowAfter && ARROWS[point]}
      <span>{children}</span>
      {arrowAfter && ARROWS[point]}
    </p>
  )
}
