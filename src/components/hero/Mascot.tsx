import { useEffect, useRef, useState, type ReactElement } from "react"

export type Mood = "idle" | "happy" | "surprised" | "skeptical"

const SPRITES: Record<Mood, string> = {
  idle: "/mascot/mascot-idle.png",
  happy: "/mascot/mascot-happy.png",
  surprised: "/mascot/mascot-surprised.png",
  skeptical: "/mascot/mascot-skeptical.png",
}

interface MascotProps {
  /** override mood from outside (e.g. project hover). default: internal state */
  mood?: Mood
  /** cursor parallax on fine pointers. default: true */
  followCursor?: boolean
}

/**
 * Pixel cat-robot mascot (generated via ChatGPT, sprite sheet cutout).
 * 4 expressions cross-fading on change + cursor parallax.
 */
export function Mascot({ mood, followCursor = true }: MascotProps): ReactElement {
  const [current, setCurrent] = useState<Mood>(mood ?? "idle")
  const [prev, setPrev] = useState<Mood | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  // external mood overrides internal state
  useEffect(() => {
    if (mood && mood !== current) {
      setPrev(current)
      setCurrent(mood)
      const t = setTimeout(() => setPrev(null), 400)
      return () => clearTimeout(t)
    }
  }, [mood, current])

  // cursor parallax (fine pointers only)
  useEffect(() => {
    const host = hostRef.current
    if (!host || !followCursor) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    let raf = 0
    const onMove = (e: MouseEvent): void => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / rect.width
        const dy = (e.clientY - cy) / rect.height
        host.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`
      })
    }
    window.addEventListener("mousemove", onMove)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [followCursor])

  return (
    <div
      className="relative flex min-h-[240px] items-center justify-center md:min-h-[320px]"
      role="img"
      aria-label="DANIIL OS mascot — pixel cat-robot"
    >
      <div
        ref={hostRef}
        className="relative size-[220px] transition-transform duration-300 ease-out"
        style={{ imageRendering: "pixelated" }}
      >
        {prev && (
          <img
            src={SPRITES[prev]}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain animate-[mascotOut_.4s_ease_forwards]"
            style={{ imageRendering: "pixelated" }}
          />
        )}
        <img
          src={SPRITES[current]}
          alt="DANIIL OS mascot — pixel cat robot"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain ${prev ? "animate-[mascotIn_.4s_ease]" : ""}`}
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <style>{`
        @keyframes mascotIn { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes mascotOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  )
}
