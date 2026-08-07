import {
  useEffect,
  useState,
  type ReactElement,
  type RefObject,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

export type Mood = "idle" | "happy" | "surprised" | "skeptical"

const SPRITES: Record<Mood, string> = {
  idle: "/mascot/mascot-idle.png",
  happy: "/mascot/mascot-happy.png",
  surprised: "/mascot/mascot-surprised.png",
  skeptical: "/mascot/mascot-skeptical.png",
}

interface MascotProps {
  mood?: Mood
  className?: string
  size?: number
}

/** Pixel cat-robot. Спрайты центрированы — смена mood без прыжков. */
export function Mascot({ mood = "idle", className, size = 200 }: MascotProps): ReactElement {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`DANIIL OS mascot — ${mood}`}
    >
      <img
        key={mood}
        src={SPRITES[mood]}
        alt=""
        draggable={false}
        className={cn(
          "block h-full w-full object-contain",
          !reduced && "animate-mascot-in",
        )}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}

interface FloatingMascotProps {
  mood: Mood
  /** пока hero в viewport — floating скрыт */
  hideWhenVisibleRef: RefObject<HTMLElement | null>
}

/** Fixed overlay: не жмёт лэйаут, виден при hover проектов. */
export function FloatingMascot({
  mood,
  hideWhenVisibleRef,
}: FloatingMascotProps): ReactElement | null {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = hideWhenVisibleRef.current
    if (!el) return
    if (!window.matchMedia("(min-width: 768px)").matches) return

    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hideWhenVisibleRef])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-40 hidden md:block">
      <div className="border-2 border-line bg-surface p-2 shadow-[4px_4px_0_var(--line)]">
        <Mascot mood={mood} size={120} />
      </div>
    </div>
  )
}
