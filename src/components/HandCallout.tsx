import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HandCalloutProps {
  children: ReactNode
  className?: string
  /** градусы наклона */
  rotate?: number
}

/** Крупный handwritten callout со стрелкой (как «↗ маскот сайта» у KISA). */
export function HandCallout({
  children,
  className,
  rotate = 0,
}: HandCalloutProps): ReactElement {
  return (
    <p
      className={cn("handwrite inline-flex items-center gap-2 text-accent", className)}
      style={rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 28 28"
        className="size-[1.15em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        aria-hidden="true"
      >
        <path d="M6 22 L20 8" />
        <path d="M9 8 H20 V19" />
      </svg>
      <span>{children}</span>
    </p>
  )
}
