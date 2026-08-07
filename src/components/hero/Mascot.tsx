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

const MOODS: Mood[] = ["idle", "happy", "surprised", "skeptical"]

interface MascotProps {
  mood?: Mood
  className?: string
  size?: number
  interactive?: boolean
  onMoodBurst?: (mood: Mood) => void
}

/**
 * Anime-tan. Все спрайты в стеке — кроссфейд opacity, без смены src
 * (иначе flash + «прыжок» реквизита между кадрами).
 * Blink через happy ОТКЛЮЧЁН: idle и happy — разные генерации (стикеры/кружка),
 * свап выглядит как смена всей картинки, а не моргание.
 */
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
  const locked = useRef(false)
  const jumpTimer = useRef<number | null>(null)

  // прелоад
  useEffect(() => {
    for (const url of Object.values(SPRITES)) {
      const img = new Image()
      img.src = url
    }
  }, [])

  // внешний mood — не перебивать jump-лок
  useEffect(() => {
    if (locked.current) return
    setDisplayMood(mood)
  }, [mood])

  useEffect(() => {
    return () => {
      if (jumpTimer.current !== null) window.clearTimeout(jumpTimer.current)
    }
  }, [])

  const onClick = useCallback((): void => {
    if (!interactive) return
    onMoodBurst?.("surprised")
    if (reduced) return

    locked.current = true
    setJumping(true)
    setDisplayMood("surprised")
    if (jumpTimer.current !== null) window.clearTimeout(jumpTimer.current)
    jumpTimer.current = window.setTimeout(() => {
      setJumping(false)
      locked.current = false
      setDisplayMood(mood)
    }, 400)
  }, [interactive, mood, onMoodBurst, reduced])

  return (
    <div
      className={cn(
        "relative shrink-0",
        !reduced && !jumping && "motion-safe:animate-mascot-bob",
        jumping && "motion-safe:animate-mascot-jump",
        interactive && "cursor-pointer",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`DANIIL OS mascot — ${displayMood}`}
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
      {MOODS.map((m) => (
        <img
          key={m}
          src={SPRITES[m]}
          alt=""
          width={size}
          height={size}
          draggable={false}
          className={cn(
            "pointer-events-none absolute inset-0 size-full max-w-none object-contain transition-opacity duration-200 ease-out",
            displayMood === m ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  )
}

interface FloatingMascotProps {
  mood: Mood
  hideWhenVisibleRef: RefObject<HTMLElement | null>
  forceShow?: boolean
}

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
