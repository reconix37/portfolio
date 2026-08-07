import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

export type TrackId =
  | "night-shift"
  | "deploy"
  | "coffee-loop"
  | "push-to-prod"
  | "rainy-commit"
  | "soft-reboot"
  | "late-pr"

export type Track = {
  id: TrackId
  name: string
  bpm: number
  vibe: "chip" | "lofi"
}

export const TRACKS: Track[] = [
  { id: "night-shift", name: "night-shift", bpm: 112, vibe: "chip" },
  { id: "deploy", name: "deploy", bpm: 118, vibe: "chip" },
  { id: "coffee-loop", name: "coffee-loop", bpm: 110, vibe: "chip" },
  { id: "push-to-prod", name: "push-to-prod", bpm: 120, vibe: "chip" },
  { id: "rainy-commit", name: "rainy-commit", bpm: 88, vibe: "lofi" },
  { id: "soft-reboot", name: "soft-reboot", bpm: 92, vibe: "lofi" },
  { id: "late-pr", name: "late-pr", bpm: 96, vibe: "lofi" },
]

/** Паттерны: -1 = rest. Lofi — реже ноты, ниже регистр. */
const MELODIES: Record<TrackId, number[]> = {
  "night-shift": [48, 55, 60, 55, 48, 52, 55, 60, 48, 55, 63, 55, 48, 52, 60, 55],
  deploy: [36, 36, 43, 36, 48, 43, 36, 43, 36, 36, 48, 43, 55, 48, 43, 36],
  "coffee-loop": [52, 55, 59, 55, 52, 48, 55, 59, 52, 55, 60, 55, 48, 52, 55, 59],
  "push-to-prod": [60, 60, -1, 67, 60, -1, 67, 72, 60, 60, -1, 67, 55, 60, 67, 72],
  "rainy-commit": [48, -1, 52, -1, 55, -1, 52, -1, 48, -1, 50, -1, 52, -1, 55, -1],
  "soft-reboot": [43, -1, -1, 48, -1, -1, 50, -1, 43, -1, 48, -1, 55, -1, 52, -1],
  "late-pr": [55, -1, 52, 48, -1, 52, -1, 55, 60, -1, 55, -1, 52, -1, 48, -1],
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

type ChipRadioApi = {
  tracks: Track[]
  trackIdx: number
  track: Track
  playing: boolean
  volume: number
  eq: number[]
  setVolume: (v: number) => void
  togglePlay: () => void
  nextTrack: () => void
  playTrack: (idx: number) => void
  stop: () => void
}

const ChipRadioContext = createContext<ChipRadioApi | null>(null)

export function ChipRadioProvider({ children }: { children: ReactNode }): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.32)
  const [eq, setEq] = useState([0.3, 0.5, 0.4, 0.6, 0.35])

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const timerRef = useRef<number | null>(null)
  const stepRef = useRef(0)
  const playingRef = useRef(false)
  const trackIdxRef = useRef(0)
  const volumeRef = useRef(volume)
  const reducedRef = useRef(reduced)

  volumeRef.current = volume
  trackIdxRef.current = trackIdx
  playingRef.current = playing
  reducedRef.current = reduced

  const stop = useCallback((): void => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    playingRef.current = false
    setPlaying(false)
    setEq([0.2, 0.2, 0.2, 0.2, 0.2])
  }, [])

  const ensureCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctxRef.current = new Ctx()
      const master = ctxRef.current.createGain()
      master.gain.value = volumeRef.current
      master.connect(ctxRef.current.destination)
      masterRef.current = master
    }
    return ctxRef.current
  }, [])

  const beep = useCallback(
    (freq: number, dur: number, type: OscillatorType, peak = 0.18): void => {
      const ctx = ctxRef.current
      const master = masterRef.current
      if (!ctx || !master) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + dur + 0.02)
    },
    [],
  )

  const noiseHit = useCallback((dur: number, amp = 0.08): void => {
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
    gain.gain.value = amp
    src.connect(gain)
    gain.connect(master)
    src.start()
  }, [])

  const tick = useCallback((): void => {
    const track = TRACKS[trackIdxRef.current]
    const melody = MELODIES[track.id]
    const step = stepRef.current % melody.length
    const note = melody[step]
    const sixteenth = 60 / track.bpm / 4
    const lofi = track.vibe === "lofi"

    if (note >= 0) {
      const wave: OscillatorType = lofi
        ? "triangle"
        : track.id === "deploy"
          ? "square"
          : "triangle"
      beep(midiToFreq(note), sixteenth * (lofi ? 1.4 : 0.85), wave, lofi ? 0.1 : 0.18)
    }
    if (!lofi && step % 4 === 0) noiseHit(0.04)
    if (lofi && step % 8 === 0) noiseHit(0.06, 0.035)
    if (!lofi && step % 8 === 4) beep(midiToFreq(36), sixteenth * 0.5, "square", 0.12)

    stepRef.current = step + 1

    if (!reducedRef.current) {
      setEq([
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
      ])
    }
  }, [beep, noiseHit])

  const startEngine = useCallback(async (): Promise<void> => {
    const ctx = ensureCtx()
    if (ctx.state === "suspended") await ctx.resume()
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    const track = TRACKS[trackIdxRef.current]
    const intervalMs = (60 / track.bpm / 4) * 1000
    stepRef.current = 0
    playingRef.current = true
    setPlaying(true)
    tick()
    timerRef.current = window.setInterval(tick, intervalMs)
  }, [ensureCtx, tick])

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume
  }, [volume])

  useEffect(() => {
    return () => {
      stop()
      void ctxRef.current?.close()
      ctxRef.current = null
      masterRef.current = null
    }
  }, [stop])

  const togglePlay = useCallback((): void => {
    if (playingRef.current) stop()
    else void startEngine()
  }, [startEngine, stop])

  const playTrack = useCallback(
    (idx: number): void => {
      setTrackIdx(idx)
      trackIdxRef.current = idx
      stop()
      window.setTimeout(() => void startEngine(), 30)
    },
    [startEngine, stop],
  )

  const nextTrack = useCallback((): void => {
    playTrack((trackIdxRef.current + 1) % TRACKS.length)
  }, [playTrack])

  const value = useMemo<ChipRadioApi>(
    () => ({
      tracks: TRACKS,
      trackIdx,
      track: TRACKS[trackIdx],
      playing,
      volume,
      eq,
      setVolume,
      togglePlay,
      nextTrack,
      playTrack,
      stop,
    }),
    [trackIdx, playing, volume, eq, togglePlay, nextTrack, playTrack, stop],
  )

  return <ChipRadioContext.Provider value={value}>{children}</ChipRadioContext.Provider>
}

export function useChipRadio(): ChipRadioApi {
  const ctx = useContext(ChipRadioContext)
  if (!ctx) throw new Error("useChipRadio must be used within ChipRadioProvider")
  return ctx
}
