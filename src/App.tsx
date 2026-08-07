import { useCallback, useEffect, useRef, useState, type ReactElement } from "react"
import { Footer } from "@/components/Footer"
import { AppFrame } from "@/components/AppFrame"
import { TabBar, type TabId } from "@/components/TabBar"
import { FakeNews } from "@/components/FakeNews"
import { BootModal } from "@/components/BootModal"
import { ChangelogModal } from "@/components/ChangelogModal"
import { FsMapModal } from "@/components/FsMapModal"
import { ManModal } from "@/components/ManModal"
import { Whoami } from "@/components/tabs/Whoami"
import { Projects } from "@/components/tabs/Projects"
import { Stack } from "@/components/tabs/Stack"
import { Education } from "@/components/tabs/Education"
import { Contact } from "@/components/tabs/Contact"
import { FloatingMascot, type Mood } from "@/components/hero/Mascot"
import { ChipRadioProvider } from "@/lib/chipRadio"
import { useSfx } from "@/hooks/useSfx"

export default function App(): ReactElement {
  const [tab, setTab] = useState<TabId>("whoami")
  const [mood, setMood] = useState<Mood>("idle")
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [manOpen, setManOpen] = useState(false)
  const whoamiRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const moodTimer = useRef<number | null>(null)
  const { tab: tabSfx } = useSfx()

  const setMoodTemp = useCallback((next: Mood, ms = 600): void => {
    setMood(next)
    if (moodTimer.current !== null) window.clearTimeout(moodTimer.current)
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms)
  }, [])

  // автоцикл лиц — только на WHOAMI (большой маскот). На остальных вкладках
  // эмоция ставится один раз при входе и держится до следующей вкладки.
  useEffect(() => {
    if (tab !== "whoami") return

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return

    const SEQUENCE: Mood[] = ["happy", "surprised", "skeptical"]
    let idx = 0
    let timeout = 0
    let alive = true

    const HOLD_MS = 7000
    const IDLE_MS = 11000
    const FIRST_DELAY_MS = 8000

    const scheduleIdleThenNext = (delay: number): void => {
      timeout = window.setTimeout(() => {
        if (!alive) return
        const next = SEQUENCE[idx % SEQUENCE.length]!
        idx += 1
        setMoodTemp(next, HOLD_MS)
        scheduleIdleThenNext(HOLD_MS + 800 + IDLE_MS)
      }, delay)
    }

    scheduleIdleThenNext(FIRST_DELAY_MS)
    return () => {
      alive = false
      window.clearTimeout(timeout)
    }
  }, [tab, setMoodTemp])

  const changeTab = useCallback(
    (id: TabId): void => {
      if (id !== tab) tabSfx()
      setTab(id)
      // сбросить временный burst с WHOAMI — иначе через N ms вернёт idle
      if (moodTimer.current !== null) {
        window.clearTimeout(moodTimer.current)
        moodTimer.current = null
      }
      // одна эмоция на вкладку — без таймера обратно в idle
      const TAB_MOOD: Partial<Record<TabId, Mood>> = {
        projects: "happy",
        stack: "idle",
        education: "skeptical",
        contact: "surprised",
      }
      if (id === "whoami") {
        setMood("idle")
        return
      }
      const m = TAB_MOOD[id]
      if (m) setMood(m)
    },
    [tab, tabSfx],
  )

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [tab])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      if (typing) return

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault()
        setManOpen((v) => !v)
        return
      }
      if (e.key === "Escape") {
        setManOpen(false)
        setMapOpen(false)
        setChangelogOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <ChipRadioProvider>
      <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-ink">
        <div className="pointer-events-none fixed inset-0 z-[90] opacity-50 scanlines" aria-hidden="true" />
        <FakeNews />

        <main className="flex min-h-0 flex-1 flex-col px-3 py-3 md:px-6 md:py-4">
          <AppFrame
            onOpenMap={() => setMapOpen(true)}
            onOpenMan={() => setManOpen(true)}
          >
            <TabBar active={tab} onChange={changeTab} />
            <div
              ref={panelRef}
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              className="min-h-0 flex-1 overflow-y-auto border-t-0 bg-bg"
            >
              <div className="m-2 min-h-[calc(100%-1rem)] border-2 border-line md:m-3">
                {tab === "whoami" && (
                  <Whoami
                    ref={whoamiRef}
                    mood={mood}
                    onMood={(m) => setMoodTemp(m, 400)}
                    onNavigate={changeTab}
                  />
                )}
                {tab === "projects" && <Projects />}
                {tab === "stack" && <Stack />}
                {tab === "education" && <Education />}
                {tab === "contact" && <Contact />}
              </div>
            </div>
          </AppFrame>
        </main>

        {tab !== "whoami" && (
          <FloatingMascot mood={mood} hideWhenVisibleRef={whoamiRef} forceShow />
        )}
        <Footer onOpenChangelog={() => setChangelogOpen(true)} />
        <BootModal onDone={() => undefined} />
        <ChangelogModal open={changelogOpen} onClose={() => setChangelogOpen(false)} />
        <FsMapModal
          open={mapOpen}
          active={tab}
          onClose={() => setMapOpen(false)}
          onNavigate={changeTab}
        />
        <ManModal open={manOpen} onClose={() => setManOpen(false)} />
      </div>
    </ChipRadioProvider>
  )
}
