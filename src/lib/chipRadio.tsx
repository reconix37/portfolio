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
  src: string
  bpm: number
  vibe: "chip" | "lofi"
}

/** Реальные mp3 (Jamendo CC) в public/music/ — id оставлены для совместимости UI. */
export const TRACKS: Track[] = [
  {
    id: "night-shift",
    name: "lofi-memories-children",
    src: "/music/lofi-memories-children.mp3",
    bpm: 112,
    vibe: "chip",
  },
  {
    id: "deploy",
    name: "dark-lofi-vibes",
    src: "/music/dark-lofi-vibes.mp3",
    bpm: 118,
    vibe: "chip",
  },
  {
    id: "coffee-loop",
    name: "midnight-lofi-love",
    src: "/music/midnight-lofi-love.mp3",
    bpm: 110,
    vibe: "chip",
  },
  {
    id: "push-to-prod",
    name: "happy-lofi",
    src: "/music/happy-lofi.mp3",
    bpm: 120,
    vibe: "chip",
  },
  {
    id: "rainy-commit",
    name: "background-lofi-lifestyle",
    src: "/music/background-lofi-lifestyle.mp3",
    bpm: 88,
    vibe: "lofi",
  },
  {
    id: "soft-reboot",
    name: "love-lofi-2",
    src: "/music/love-lofi-2.mp3",
    bpm: 92,
    vibe: "lofi",
  },
  {
    id: "late-pr",
    name: "hiphop-lofi-dance",
    src: "/music/hiphop-lofi-dance.mp3",
    bpm: 96,
    vibe: "lofi",
  },
]

export type PlaylistId = "all" | "chip" | "lofi"

type ChipRadioApi = {
  tracks: Track[]
  allTracks: Track[]
  trackIdx: number
  track: Track
  playing: boolean
  volume: number
  eq: number[]
  playlist: PlaylistId
  elapsed: number
  duration: number
  setVolume: (v: number) => void
  setPlaylist: (id: PlaylistId) => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  playTrack: (idx: number) => void
  stop: () => void
}

function filterTracks(playlist: PlaylistId): Track[] {
  if (playlist === "all") return TRACKS
  return TRACKS.filter((t) => t.vibe === playlist)
}

function resolveSrc(src: string): string {
  return new URL(src, window.location.origin).href
}

const ChipRadioContext = createContext<ChipRadioApi | null>(null)

export function ChipRadioProvider({ children }: { children: ReactNode }): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [playlist, setPlaylistState] = useState<PlaylistId>("all")
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.32)
  const [eq, setEq] = useState([0.3, 0.5, 0.4, 0.6, 0.35])
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const eqTimerRef = useRef<number | null>(null)
  const playingRef = useRef(false)
  const trackIdxRef = useRef(0)
  const playlistRef = useRef<PlaylistId>(playlist)
  const volumeRef = useRef(volume)
  const reducedRef = useRef(reduced)
  const nextTrackRef = useRef<() => void>(() => undefined)

  const tracks = useMemo(() => filterTracks(playlist), [playlist])
  const safeIdx = Math.min(trackIdx, Math.max(0, tracks.length - 1))
  const track = tracks[safeIdx] ?? TRACKS[0]

  trackIdxRef.current = safeIdx
  playlistRef.current = playlist
  volumeRef.current = volume
  playingRef.current = playing
  reducedRef.current = reduced

  const ensureAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.preload = "metadata"
      audioRef.current = audio
    }
    return audioRef.current
  }, [])

  const stopEq = useCallback((): void => {
    if (eqTimerRef.current !== null) {
      window.clearInterval(eqTimerRef.current)
      eqTimerRef.current = null
    }
    setEq([0.2, 0.2, 0.2, 0.2, 0.2])
  }, [])

  const startEq = useCallback((): void => {
    if (eqTimerRef.current !== null) return
    if (reducedRef.current) return
    eqTimerRef.current = window.setInterval(() => {
      setEq([
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
        0.2 + Math.random() * 0.8,
      ])
    }, 120)
  }, [])

  const bindSrc = useCallback(
    (t: Track): HTMLAudioElement => {
      const audio = ensureAudio()
      const abs = resolveSrc(t.src)
      if (audio.src !== abs) {
        audio.src = t.src
        audio.preload = "metadata"
      }
      audio.volume = volumeRef.current
      return audio
    },
    [ensureAudio],
  )

  const playCurrent = useCallback(async (): Promise<void> => {
    const list = filterTracks(playlistRef.current)
    const cur = list[trackIdxRef.current] ?? TRACKS[0]
    const audio = bindSrc(cur)
    try {
      await audio.play()
      playingRef.current = true
      setPlaying(true)
      startEq()
    } catch {
      playingRef.current = false
      setPlaying(false)
      stopEq()
    }
  }, [bindSrc, startEq, stopEq])

  const stop = useCallback((): void => {
    const audio = audioRef.current
    playingRef.current = false
    setPlaying(false)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setElapsed(0)
    stopEq()
  }, [stopEq])

  useEffect(() => {
    const audio = ensureAudio()

    const onTime = (): void => setElapsed(audio.currentTime || 0)
    const onMeta = (): void => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    const onEnded = (): void => nextTrackRef.current()
    const onPlay = (): void => {
      playingRef.current = true
      setPlaying(true)
      startEq()
    }
    const onPause = (): void => {
      // stop() уже выставил playingRef=false до pause
      if (!playingRef.current) {
        stopEq()
        return
      }
      playingRef.current = false
      setPlaying(false)
      stopEq()
    }

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("durationchange", onMeta)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)

    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("durationchange", onMeta)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
      stopEq()
      audioRef.current = null
    }
  }, [ensureAudio, startEq, stopEq])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // подгрузить metadata текущего трека (без автоплея)
  useEffect(() => {
    const audio = bindSrc(track)
    setElapsed(0)
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration)
    } else {
      setDuration(0)
    }
  }, [track.id, bindSrc])

  const togglePlay = useCallback((): void => {
    const audio = ensureAudio()
    if (playingRef.current) {
      playingRef.current = false
      setPlaying(false)
      audio.pause()
      stopEq()
    } else {
      void playCurrent()
    }
  }, [ensureAudio, playCurrent, stopEq])

  const playTrack = useCallback(
    (idx: number): void => {
      const list = filterTracks(playlistRef.current)
      const safe = ((idx % list.length) + list.length) % list.length
      setTrackIdx(safe)
      trackIdxRef.current = safe
      setElapsed(0)
      void playCurrent()
    },
    [playCurrent],
  )

  const nextTrack = useCallback((): void => {
    const list = filterTracks(playlistRef.current)
    playTrack((trackIdxRef.current + 1) % list.length)
  }, [playTrack])

  const prevTrack = useCallback((): void => {
    const list = filterTracks(playlistRef.current)
    playTrack((trackIdxRef.current - 1 + list.length) % list.length)
  }, [playTrack])

  nextTrackRef.current = nextTrack

  const setPlaylist = useCallback(
    (id: PlaylistId): void => {
      const wasPlaying = playingRef.current
      setPlaylistState(id)
      playlistRef.current = id
      setTrackIdx(0)
      trackIdxRef.current = 0
      setElapsed(0)
      if (wasPlaying) void playCurrent()
      else {
        const list = filterTracks(id)
        bindSrc(list[0] ?? TRACKS[0])
      }
    },
    [bindSrc, playCurrent],
  )

  const value = useMemo<ChipRadioApi>(
    () => ({
      tracks,
      allTracks: TRACKS,
      trackIdx: safeIdx,
      track,
      playing,
      volume,
      eq,
      playlist,
      elapsed,
      duration,
      setVolume,
      setPlaylist,
      togglePlay,
      nextTrack,
      prevTrack,
      playTrack,
      stop,
    }),
    [
      tracks,
      safeIdx,
      track,
      playing,
      volume,
      eq,
      playlist,
      elapsed,
      duration,
      setPlaylist,
      togglePlay,
      nextTrack,
      prevTrack,
      playTrack,
      stop,
    ],
  )

  return <ChipRadioContext.Provider value={value}>{children}</ChipRadioContext.Provider>
}

export function useChipRadio(): ChipRadioApi {
  const ctx = useContext(ChipRadioContext)
  if (!ctx) throw new Error("useChipRadio must be used within ChipRadioProvider")
  return ctx
}
