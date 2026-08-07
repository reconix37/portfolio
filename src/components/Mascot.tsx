import { useEffect, useRef, useState } from 'react'

type Mood = 'idle' | 'happy' | 'surprised' | 'skeptical'

export type { Mood }

const SPRITES: Record<Mood, string> = {
  idle: '/mascot/mascot-idle.png',
  happy: '/mascot/mascot-happy.png',
  surprised: '/mascot/mascot-surprised.png',
  skeptical: '/mascot/mascot-skeptical.png',
}

interface MascotProps {
  /** trigger a mood change from outside (e.g. project hover) */
  mood?: Mood
  /** enable cursor-follow eyes effect */
  followCursor?: boolean
  size?: number
}

/**
 * Pixel robot-cat mascot for DANIIL OS.
 * 4 expressions from the generated sprite sheet, cross-fading on change.
 * Optional cursor-follow (parallax) for fine pointers.
 */
export default function Mascot({ mood = 'idle', followCursor = true, size = 220 }: MascotProps) {
  const [current, setCurrent] = useState<Mood>(mood)
  const [prev, setPrev] = useState<Mood | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mood !== current) {
      setPrev(current)
      setCurrent(mood)
      const t = setTimeout(() => setPrev(null), 400)
      return () => clearTimeout(t)
    }
  }, [mood, current])

  // cursor-follow parallax (fine pointers only)
  useEffect(() => {
    if (!followCursor || !window.matchMedia('(pointer: fine)').matches) return
    const el = wrapRef.current
    if (!el) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = (e.clientX - cx) / r.width
        const dy = (e.clientY - cy) / r.height
        el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [followCursor])

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{
        width: size,
        height: size,
        transition: 'transform .3s ease',
        imageRendering: 'pixelated',
      }}
    >
      {/* prev sprite fades out */}
      {prev && (
        <img
          src={SPRITES[prev]}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain animate-[mascotOut_.4s_ease_forwards]"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      {/* current sprite */}
      <img
        src={SPRITES[current]}
        alt="DANIIL OS mascot — pixel robot cat"
        className={`absolute inset-0 w-full h-full object-contain ${prev ? 'animate-[mascotIn_.4s_ease]' : ''}`}
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
      <style>{`
        @keyframes mascotIn { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes mascotOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  )
}
