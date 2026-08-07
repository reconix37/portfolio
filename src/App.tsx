import { useRef, useState, type ReactElement } from "react"
import { Sysbar } from "@/components/Sysbar"
import { Hero } from "@/components/hero/Hero"
import { FloatingMascot, type Mood } from "@/components/hero/Mascot"
import { Band } from "@/components/Band"
import { Projects } from "@/components/sections/Projects"
import { Stack } from "@/components/sections/Stack"
import { Education } from "@/components/sections/Education"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/Footer"
import { ScrollProgress } from "@/components/ScrollProgress"

export default function App(): ReactElement {
  const [mood, setMood] = useState<Mood>("idle")
  const heroRef = useRef<HTMLElement>(null)

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <div className="pointer-events-none fixed inset-0 z-[90] opacity-50 scanlines" aria-hidden="true" />
      <ScrollProgress />
      <Sysbar />

      <main>
        <Hero ref={heroRef} mood={mood} />
        <Band />
        <Projects onMood={setMood} />
        <Stack />
        <Education />
        <Contact />
      </main>

      <FloatingMascot mood={mood} hideWhenVisibleRef={heroRef} />
      <Footer />
    </div>
  )
}
