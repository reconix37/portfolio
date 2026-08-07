import { useEffect, useRef, useState, type ReactElement } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

type TermLine = {
  text: string
  cls: "p" | "ok" | "c"
}

const LINES: TermLine[] = [
  { text: "$ whoami", cls: "p" },
  { text: "daniil.verkhovskyi — AI/ML engineer", cls: "ok" },
  { text: "$ echo $LOCATION", cls: "p" },
  { text: "Presov, Slovakia (UTC+2)", cls: "c" },
  { text: "$ cat focus.txt", cls: "p" },
  { text: "generative AI / structured output / evals", cls: "c" },
  { text: "$ ./greet.sh", cls: "p" },
]

const LANGS = [
  { t: "Ahoj", l: "SK" },
  { t: "Привіт", l: "UA" },
  { t: "Привет", l: "RU" },
  { t: "Hello", l: "EN" },
] as const

function lineClass(cls: TermLine["cls"]): string {
  if (cls === "p") return "text-muted"
  if (cls === "ok") return "text-[var(--term-ok)]"
  return "text-[var(--term-ink)]"
}

function renderPromptLine(text: string, cls: TermLine["cls"]): ReactElement {
  if (text.startsWith("$")) {
    return (
      <span className={lineClass(cls)}>
        <span className="font-bold text-[var(--term-accent)]">$</span>
        {text.slice(1)}
      </span>
    )
  }
  return <span className={lineClass(cls)}>{text}</span>
}

function LangRotator(): ReactElement {
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()
  const lang = LANGS[index]

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LANGS.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <span className="inline-block font-bold text-accent">
      <span key={lang.l} className={cn(!reduced && "animate-langswap")}>
        {lang.t}
      </span>{" "}
      <span className="text-[11px] font-normal text-muted">[{lang.l}]</span>
    </span>
  )
}

function Cursor(): ReactElement {
  return (
    <span
      className="ml-0.5 inline-block h-[15px] w-2 translate-y-px bg-[var(--term-accent)] align-[-2px] motion-safe:animate-blink"
      aria-hidden="true"
    />
  )
}

export function Terminal(): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [done, setDone] = useState<TermLine[]>([])
  const [active, setActive] = useState<{ cls: TermLine["cls"]; shown: string } | null>(null)
  const [finished, setFinished] = useState(false)
  const lineIdx = useRef(0)
  const charIdx = useRef(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    if (reduced) {
      setDone(LINES)
      setActive(null)
      setFinished(true)
      return
    }

    // StrictMode remount — сброс
    setDone([])
    setActive(null)
    setFinished(false)
    lineIdx.current = 0
    charIdx.current = 0

    const clear = (): void => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }

    const schedule = (fn: () => void, ms: number): void => {
      clear()
      timer.current = window.setTimeout(fn, ms)
    }

    const typeNext = (): void => {
      if (cancelled) return

      if (lineIdx.current >= LINES.length) {
        setActive(null)
        setFinished(true)
        return
      }

      const line = LINES[lineIdx.current]

      if (charIdx.current < line.text.length) {
        charIdx.current += 1
        setActive({ cls: line.cls, shown: line.text.slice(0, charIdx.current) })
        schedule(typeNext, 28 + Math.random() * 40)
        return
      }

      setDone((prev) => [...prev, line])
      setActive(null)
      lineIdx.current += 1
      charIdx.current = 0
      schedule(typeNext, 260)
    }

    schedule(typeNext, 500)
    return () => {
      cancelled = true
      clear()
    }
  }, [reduced])

  return (
    <div
      className="border-2 border-line bg-[var(--term-bg)] text-[13.5px] leading-[1.7] text-[var(--term-ink)] shadow-[var(--shadow)]"
      role="log"
      aria-label="system terminal"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 border-b-2 border-line bg-surface-2 px-3.5 py-2.5 dark:bg-[#26231F]">
        <i className="size-2.5 border-2 border-line bg-accent" aria-hidden="true" />
        <i className="size-2.5 border-2 border-line bg-accent-2" aria-hidden="true" />
        <i className="size-2.5 border-2 border-line bg-ok" aria-hidden="true" />
        <span className="ml-2.5 text-[11px] tracking-[0.12em] text-ink-soft uppercase">
          daniil@os: ~ — bash
        </span>
      </div>

      <div className="min-h-[210px] px-5 py-[18px]">
        {done.map((line, i) => (
          <div key={`${i}-${line.text}`} className="break-words whitespace-pre-wrap">
            {renderPromptLine(line.text, line.cls)}
          </div>
        ))}

        {active && (
          <div className="break-words whitespace-pre-wrap">
            {renderPromptLine(active.shown, active.cls)}
            <Cursor />
          </div>
        )}

        {finished && (
          <div className="break-words whitespace-pre-wrap">
            <span className="text-muted">$ </span>
            <LangRotator />
            <Cursor />
          </div>
        )}
      </div>
    </div>
  )
}
