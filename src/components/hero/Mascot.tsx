import {
  useEffect,
  useState,
  type ReactElement,
  type RefObject,
} from "react"
import { cn } from "@/lib/utils"

export type Mood = "idle" | "happy" | "surprised" | "skeptical"

/** Hero — крупный якорь рядом с именем. Float — отдельный мини-виджет в углу. */
export const MASCOT_SIZE_HERO = 280
export const MASCOT_SIZE_FLOAT = 128

const SPRITES: Record<Mood, string> = {
  idle: "/mascot/mascot-idle.png",
  happy: "/mascot/mascot-happy.png",
  surprised: "/mascot/mascot-surprised.png",
  skeptical: "/mascot/mascot-skeptical.png",
}

const SPRITE_URLS = Object.values(SPRITES)

interface MascotProps {
  mood?: Mood
  className?: string
  size?: number
}

/** Pixel cat-robot. Размер задаёт родитель (hero ≠ float), без remount на mood. */
export function Mascot({
  mood = "idle",
  className,
  size = MASCOT_SIZE_HERO,
}: MascotProps): ReactElement {
  useEffect(() => {
    for (const url of SPRITE_URLS) {
      const img = new Image()
      img.src = url
    }
  }, [])

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`DANIIL OS mascot — ${mood}`}
    >
      <img
        src={SPRITES[mood]}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="pointer-events-none block size-full max-w-none object-contain"
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

/** Fixed overlay в углу — заведомо меньше hero, без мигания на пороге. */
export function FloatingMascot({
  mood,
  hideWhenVisibleRef,
}: FloatingMascotProps): ReactElement | null {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = hideWhenVisibleRef.current
    if (!el) return

    const mq = window.matchMedia("(min-width: 768px)")
    let io: IntersectionObserver | null = null

    const disconnect = (): void => {
      io?.disconnect()
      io = null
    }

    const observe = (): void => {
      disconnect()
      if (!mq.matches) {
        setShow(false)
        return
      }
      io = new IntersectionObserver(
        ([entry]) => {
          const ratio = entry.intersectionRatio
          setShow((prev) => {
            if (ratio >= 0.2) return false
            if (ratio <= 0.05) return true
            return prev
          })
        },
        { threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 1] },
      )
      io.observe(el)
    }

    observe()
    mq.addEventListener("change", observe)
    return () => {
      mq.removeEventListener("change", observe)
      disconnect()
    }
  }, [hideWhenVisibleRef])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-40 hidden md:block">
      <div className="border-2 border-line bg-surface p-2 shadow-[4px_4px_0_var(--line)]">
        <Mascot mood={mood} size={MASCOT_SIZE_FLOAT} />
      </div>
    </div>
  )
}
