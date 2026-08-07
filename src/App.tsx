import { useCallback, useEffect, useRef, useState, type ReactElement } from "react"
import { Sysbar } from "@/components/Sysbar"
import { Footer } from "@/components/Footer"
import { AppFrame } from "@/components/AppFrame"
import { TabBar, type TabId } from "@/components/TabBar"
import { FakeNews } from "@/components/FakeNews"
import { BootModal } from "@/components/BootModal"
import { MiniRadio } from "@/components/MiniRadio"
import { Whoami } from "@/components/tabs/Whoami"
import { Projects } from "@/components/tabs/Projects"
import { Stack } from "@/components/tabs/Stack"
import { Education } from "@/components/tabs/Education"
import { Contact } from "@/components/tabs/Contact"
import { Radio } from "@/components/tabs/Radio"
import { FloatingMascot, type Mood } from "@/components/hero/Mascot"
import { ChipRadioProvider } from "@/lib/chipRadio"

export default function App(): ReactElement {
  const [tab, setTab] = useState<TabId>("whoami")
  const [mood, setMood] = useState<Mood>("idle")
  const [booted, setBooted] = useState(false)
  const whoamiRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const moodTimer = useRef<number | null>(null)

  const onBootDone = useCallback((): void => setBooted(true), [])

  const setMoodTemp = useCallback((next: Mood, ms = 600): void => {
    setMood(next)
    if (moodTimer.current !== null) window.clearTimeout(moodTimer.current)
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms)
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    let lastY = panel.scrollTop
    let cooldownUntil = 0

    const onScroll = (): void => {
      const now = Date.now()
      if (now < cooldownUntil) {
        lastY = panel.scrollTop
        return
      }
      const y = panel.scrollTop
      const dy = y - lastY
      lastY = y
      if (Math.abs(dy) < 40) return
      cooldownUntil = now + 1200
      if (dy > 0) setMoodTemp("skeptical", 700)
      else setMoodTemp("surprised", 700)
    }

    panel.addEventListener("scroll", onScroll, { passive: true })
    return () => panel.removeEventListener("scroll", onScroll)
  }, [setMoodTemp, tab])

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [tab])

  return (
    <ChipRadioProvider>
      <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-ink">
        <div className="pointer-events-none fixed inset-0 z-[90] opacity-50 scanlines" aria-hidden="true" />
        <FakeNews />
        <Sysbar />

        <main className="flex min-h-0 flex-1 flex-col px-3 py-3 md:px-6 md:py-4">
          <AppFrame>
            <TabBar active={tab} onChange={setTab} />
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
                  />
                )}
                {tab === "projects" && <Projects onMood={setMood} />}
                {tab === "stack" && <Stack />}
                {tab === "education" && <Education />}
                {tab === "contact" && <Contact />}
                {tab === "radio" && <Radio />}
              </div>
            </div>
          </AppFrame>
        </main>

        {booted && <MiniRadio />}
        {tab !== "whoami" && (
          <FloatingMascot mood={mood} hideWhenVisibleRef={whoamiRef} forceShow />
        )}
        <Footer />
        <BootModal onDone={onBootDone} />
      </div>
    </ChipRadioProvider>
  )
}
