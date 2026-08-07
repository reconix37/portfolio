import { useEffect, useRef, type ReactElement, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3
}

export function Reveal({ children, className, delay = 0 }: RevealProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.classList.add("reveal-in")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        el.classList.add("reveal-in")
        io.unobserve(el)
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        delay === 1 && "reveal-d1",
        delay === 2 && "reveal-d2",
        delay === 3 && "reveal-d3",
        className,
      )}
    >
      {children}
    </div>
  )
}
