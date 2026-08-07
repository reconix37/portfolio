import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
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
  /** внешний клик уже обработан родителем — тогда без внутреннего jump */
  interactive?: boolean
  onMoodBurst?: (mood: Mood) => void
}

/** Pixel anime-tan. Размер задаёт родитель (hero ≠ float), без remount на mood. */
export function Mascot({
  mood = "idle",
  className,
  size = MASCOT_SIZE_HERO,
  interactive = false,
  onMoodBurst,
}: MascotProps): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [displayMood, setDisplayMood] = useState<Mood>(mood)
  const [jumping, setJumping] = useState(false)
  const blinkTimer = useRef<number | null>(null)
  const burstTimer = useRef<number | null>(null)

  useEffect(() => {
    for (const url of SPRITE_URLS) {
      const img = new Image()
      img.src = url
    }
  }, [])

  // синхронизация mood снаружи (кроме активного blink/burst)
  useEffect(() => {
    setDisplayMood(mood)
  }, [mood])

  // idle-моргание: каждые 3–5с → happy на 150–200ms
  useEffect(() => {
    if (reduced) return

    const schedule = (): void => {
      const wait = 3000 + Math.random() * 2000
      blinkTimer.current = window.setTimeout(() => {
        if (mood !== "idle") {
          schedule()
          return
        }
        setDisplayMood("happy")
        burstTimer.current = window.setTimeout(() => {
          setDisplayMood(mood)
          schedule()
        }, 150 + Math.random() * 50)
      }, wait)
    }

    schedule()
    return () => {
      if (blinkTimer.current !== null) window.clearTimeout(blinkTimer.current)
      if (burstTimer.current !== null) window.clearTimeout(burstTimer.current)
    }
  }, [mood, reduced])

  const onClick = useCallback((): void => {
    if (!interactive) return
    onMoodBurst?.("surprised")
    if (reduced) return
    setJumping(true)
    setDisplayMood("surprised")
    window.setTimeout(() => {
      setJumping(false)
      setDisplayMood(mood)
    }, 400)
  }, [interactive, mood, onMoodBurst, reduced])

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden",
        !reduced && !jumping && "motion-safe:animate-mascot-bob",
        jumping && "motion-safe:animate-mascot-jump",
        interactive && "cursor-pointer",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`DANIIL OS mascot — ${mood}`}
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      tabIndex={interactive ? 0 : undefined}
    >
      <img
        src={SPRITES[displayMood]}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="pointer-events-none block size-full max-w-none object-contain transition-opacity duration-150"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}

interface FloatingMascotProps {
  mood: Mood
  /** пока hero в viewport — floating скрыт */
  hideWhenVisibleRef: RefObject<HTMLElement | null>
  /** принудительно показать (напр. на других вкладках) */
  forceShow?: boolean
}

/** Fixed overlay в углу — заведомо меньше hero, без мигания на пороге. */
export function FloatingMascot({
  mood,
  hideWhenVisibleRef,
  forceShow = false,
}: FloatingMascotProps): ReactElement | null {
  const [show, setShow] = useState(forceShow)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (forceShow) {
      setShow(true)
      return
    }

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
  }, [hideWhenVisibleRef, forceShow])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed right-5 bottom-16 z-40 hidden md:block">
      <div
        className={cn(
          "border-2 border-line bg-surface p-2 shadow-[4px_4px_0_var(--line)]",
          !reduced && "motion-safe:animate-mascot-bob",
        )}
      >
        <Mascot mood={mood} size={MASCOT_SIZE_FLOAT} />
      </div>
    </div>
  )
}
