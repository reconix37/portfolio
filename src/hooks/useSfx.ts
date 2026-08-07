import { useCallback, useEffect, useRef, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const MUTE_KEY = "daniil-os-sfx-mute"

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1"
  } catch {
    return false
  }
}

/** Короткие UI-звуки (WebAudio). Mute — localStorage + событие. */
export function useSfx(): {
  muted: boolean
  toggleMute: () => void
  click: () => void
  boot: () => void
  tab: () => void
} {
  const reduced = usePrefersReducedMotion()
  const [muted, setMuted] = useState(readMuted)
  const ctxRef = useRef<AudioContext | null>(null)
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  useEffect(() => {
    const sync = (): void => setMuted(readMuted())
    window.addEventListener("daniil-sfx-mute", sync)
    return () => window.removeEventListener("daniil-sfx-mute", sync)
  }, [])

  const ensure = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new Ctx()
    }
    return ctxRef.current
  }, [])

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "square", peak = 0.06): void => {
      if (mutedRef.current || reduced) return
      const ctx = ensure()
      if (!ctx) return
      void ctx.resume()
      const now = ctx.currentTime
      oscBeep(ctx, freq, dur, type, peak, now)
    },
    [ensure, reduced],
  )

  const toggleMute = useCallback((): void => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0")
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("daniil-sfx-mute"))
  }, [])

  const click = useCallback((): void => tone(880, 0.04, "square", 0.05), [tone])
  const tab = useCallback((): void => tone(660, 0.05, "triangle", 0.045), [tone])
  const boot = useCallback((): void => {
    tone(220, 0.08, "square", 0.07)
    window.setTimeout(() => tone(330, 0.08, "square", 0.06), 70)
    window.setTimeout(() => tone(440, 0.1, "square", 0.05), 140)
  }, [tone])

  return { muted, toggleMute, click, boot, tab }
}

function oscBeep(
  ctx: AudioContext,
  freq: number,
  dur: number,
  type: OscillatorType,
  peak: number,
  now: number,
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}
