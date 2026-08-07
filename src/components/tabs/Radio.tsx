import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

type TrackId = "night-shift" | "deploy" | "coffee-loop" | "push-to-prod"

type Track = {
  id: TrackId
  name: string
  bpm: number
  bars: number
}

const TRACKS: Track[] = [
  { id: "night-shift", name: "night-shift", bpm: 112, bars: 4 },
  { id: "deploy", name: "deploy", bpm: 118, bars: 4 },
  { id: "coffee-loop", name: "coffee-loop", bpm: 110, bars: 4 },
  { id: "push-to-prod", name: "push-to-prod", bpm: 120, bars: 4 },
]

/** Паттерны нот (MIDI-ish): -1 = rest */
const MELODIES: Record<TrackId, number[]> = {
  "night-shift": [48, 55, 60, 55, 48, 52, 55, 60, 48, 55, 63, 55, 48, 52, 60, 55],
  deploy: [36, 36, 43, 36, 48, 43, 36, 43, 36, 36, 48, 43, 55, 48, 43, 36],
  "coffee-loop": [52, 55, 59, 55, 52, 48, 55, 59, 52, 55, 60, 55, 48, 52, 55, 59],
  "push-to-prod": [60, 60, -1, 67, 60, -1, 67, 72, 60, 60, -1, 67, 55, 60, 67, 72],
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

interface RadioProps {
  active: boolean
}

export function Radio({ active }: RadioProps): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [eq, setEq] = useState([0.3, 0.5, 0.4, 0.6, 0.35])

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const timerRef = useRef<number | null>(null)
  const stepRef = useRef(0)
  const playingRef = useRef(false)
  const trackIdxRef = useRef(0)
  const volumeRef = useRef(volume)

  volumeRef.current = volume
  trackIdxRef.current = trackIdx
  playingRef.current = playing

  const stopEngine = useCallback((): void => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    playingRef.current = false
    setPlaying(false)
  }, [])

  const ensureCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new Ctx()
      const master = ctxRef.current.createGain()
      master.gain.value = volumeRef.current
      master.connect(ctxRef.current.destination)
      masterRef.current = master
    }
    return ctxRef.current
  }, [])

  const beep = useCallback((freq: number, dur: number, type: OscillatorType): void => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + dur + 0.02)
  }, [])

  const noiseHit = useCallback((dur: number): void => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    const len = Math.floor(ctx.sampleRate * dur)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)

    const src = ctx.createBufferSource()
    const gain = ctx.createGain()
    src.buffer = buf
    gain.gain.value = 0.08
    src.connect(gain)
    gain.connect(master)
    src.start()
  }, [])

  const tick = useCallback((): void => {
    const track = TRACKS[trackIdxRef.current]
    const melody = MELODIES[track.id]
    const step = stepRef.current % melody.length
    const note = melody[step]
    const beat = 60 / track.bpm
    const sixteenth = beat / 4

    if (note >= 0) {
      const wave: OscillatorType = track.id === "deploy" ? "square" : "triangle"
      beep(midiToFreq(note), sixteenth * 0.85, wave)
    }
    if (step % 4 === 0) noiseHit(0.04)
    if (step % 8 === 4) beep(midiToFreq(36), sixteenth * 0.5, "square")

    stepRef.current = step + 1

    if (!reduced) {
      setEq([
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
      ])
    }
  }, [beep, noiseHit, reduced])

  const startEngine = useCallback(async (): Promise<void> => {
    const ctx = ensureCtx()
    if (ctx.state === "suspended") await ctx.resume()

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
    }

    const track = TRACKS[trackIdxRef.current]
    const intervalMs = ((60 / track.bpm) / 4) * 1000
    stepRef.current = 0
    playingRef.current = true
    setPlaying(true)
    tick()
    timerRef.current = window.setInterval(tick, intervalMs)
  }, [ensureCtx, tick])

  // пауза при уходе с вкладки
  useEffect(() => {
    if (!active && playingRef.current) {
      stopEngine()
      setEq([0.2, 0.2, 0.2, 0.2, 0.2])
    }
  }, [active, stopEngine])

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      stopEngine()
      void ctxRef.current?.close()
      ctxRef.current = null
      masterRef.current = null
    }
  }, [stopEngine])

  const togglePlay = (): void => {
    if (playing) stopEngine()
    else void startEngine()
  }

  const playTrack = (idx: number): void => {
    setTrackIdx(idx)
    trackIdxRef.current = idx
    stopEngine()
    window.setTimeout(() => void startEngine(), 30)
  }

  const nextTrack = (): void => {
    const next = (trackIdxRef.current + 1) % TRACKS.length
    playTrack(next)
  }

  const track = TRACKS[trackIdx]

  return (
    <section className="relative" aria-labelledby="radio-heading">
      <SectionLabel text="06 — RADIO" />
      <div className="wrap py-8 md:py-10">
        <h2 id="radio-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          CHIPRADIO
          <SectionBadge text="// webaudio" />
        </h2>
        <p className="mb-8 font-mono text-sm text-muted">
          {"// no files · square + triangle + noise · pause on tab leave"}
        </p>

        <div className="max-w-xl border-2 border-line bg-bg p-5 shadow-[var(--shadow)]">
          {/* эквалайзер */}
          <div className="mb-5 flex h-16 items-end gap-1.5" aria-hidden="true">
            {eq.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-full border-2 border-line bg-accent transition-[height] duration-100",
                  !playing && "opacity-40",
                )}
                style={{ height: `${Math.max(12, h * 100)}%` }}
              />
            ))}
          </div>

          <div className="mb-4 font-mono text-sm tracking-[0.08em] uppercase">
            <span className="text-muted">NOW :: </span>
            <span className="text-accent">{track.name}</span>
            <span className="ml-2 text-muted">{track.bpm} BPM</span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex min-h-11 min-w-14 items-center justify-center border-2 border-line bg-accent px-4 py-2 text-bg shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="min-h-11 border-2 border-line bg-surface px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              next
            </button>
            <label className="ml-auto flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase">
              VOL
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-2 w-28 cursor-pointer accent-[var(--accent)]"
                aria-label="Volume"
              />
            </label>
          </div>

          <ul className="flex flex-col gap-1.5">
            {TRACKS.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => playTrack(i)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between border-2 border-line px-3 py-2 text-left font-mono text-xs tracking-[0.08em] uppercase transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    i === trackIdx
                      ? "bg-accent text-bg dark:text-[#121110]"
                      : "bg-transparent hover:bg-surface-2",
                  )}
                >
                  <span>{t.name}</span>
                  <span className="opacity-70">{t.bpm}bpm</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
