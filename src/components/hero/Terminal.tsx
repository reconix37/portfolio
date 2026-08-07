import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactElement,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { toggleDosTheme } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"

type TermLine = {
  text: string
  cls: "p" | "ok" | "c" | "err"
}

const BOOT: TermLine[] = [
  { text: "$ whoami", cls: "p" },
  { text: "daniil.verkhovskyi — AI/ML engineer", cls: "ok" },
  { text: "$ echo $LOCATION", cls: "p" },
  { text: "Presov, Slovakia (UTC+2)", cls: "c" },
  { text: "$ cat focus.txt", cls: "p" },
  { text: "generative AI / structured output / evals", cls: "c" },
  { text: "$ ./greet.sh", cls: "p" },
  { text: "type 'help' for commands", cls: "ok" },
]

const LANGS = [
  { t: "Ahoj", l: "SK" },
  { t: "Привіт", l: "UA" },
  { t: "Привет", l: "RU" },
  { t: "Hello", l: "EN" },
] as const

const HELP_LINES = [
  "help          list commands",
  "whoami        identity",
  "projects      shipped modules",
  "contact       email + github + telegram",
  "stack         core toolkit",
  "theme         toggle light/dark",
  "clear         clear screen",
  "sudo hire     nice try",
  "cat secret.txt",
]

const SECRET_CAT = [
  "  /\\_/\\",
  " ( o.o )",
  "  > ^ <",
  "secret: hire the human, not the cat",
]

function lineClass(cls: TermLine["cls"]): string {
  if (cls === "p") return "text-muted"
  if (cls === "ok") return "text-[var(--term-ok)]"
  if (cls === "err") return "text-[var(--term-accent)]"
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
  return <span className={cn("whitespace-pre-wrap", lineClass(cls))}>{text}</span>
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

function runCommand(raw: string): TermLine[] {
  const input = raw.trim()
  if (!input) return []

  const lower = input.toLowerCase()
  const [cmd, ...rest] = lower.split(/\s+/)
  const arg = rest.join(" ")

  if (cmd === "help") {
    return HELP_LINES.map((t) => ({ text: t, cls: "c" as const }))
  }
  if (cmd === "whoami") {
    return [{ text: "daniil.verkhovskyi — AI/ML engineer", cls: "ok" }]
  }
  if (cmd === "projects") {
    return [
      { text: "[01] HabitForge — AI habit tracker", cls: "c" },
      { text: "[02] AI Chat Platform — LLM chat for Telegram", cls: "c" },
      { text: "[03] SLE Terminal — quant trading platform", cls: "c" },
      { text: "[04] MSc Thesis — RAG assistant (in progress)", cls: "c" },
    ]
  }
  if (cmd === "contact") {
    return [
      { text: "email     verchovskyidania@gmail.com", cls: "c" },
      { text: "github    github.com/reconix37", cls: "c" },
      { text: "linkedin  linkedin.com/in/daniil-verkhovskyi", cls: "c" },
      { text: "telegram  @verkhovskyi  ★ preferred", cls: "ok" },
    ]
  }
  if (cmd === "stack") {
    return [
      { text: "gen ai / llm · python · fastapi · xgboost · react · supabase", cls: "c" },
    ]
  }
  if (cmd === "theme") {
    const next = toggleDosTheme()
    return [{ text: `theme → ${next}`, cls: "ok" }]
  }
  if (cmd === "clear") {
    return [{ text: "__CLEAR__", cls: "c" }]
  }
  if (cmd === "sudo" && arg === "hire") {
    return [{ text: "nice try, send email instead", cls: "err" }]
  }
  if (cmd === "cat" && (arg === "secret.txt" || arg === "./secret.txt")) {
    return SECRET_CAT.map((t) => ({ text: t, cls: "ok" as const }))
  }

  return [{ text: `command not found: ${input}. try 'help'`, cls: "err" }]
}

export function Terminal(): ReactElement {
  const reduced = usePrefersReducedMotion()
  const [bootDone, setBootDone] = useState<TermLine[]>([])
  const [bootActive, setBootActive] = useState<{ cls: TermLine["cls"]; shown: string } | null>(
    null,
  )
  const [booted, setBooted] = useState(false)
  const [lines, setLines] = useState<TermLine[]>([])
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const histIdx = useRef<number>(-1)
  const draft = useRef("")
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const lineIdx = useRef(0)
  const charIdx = useRef(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    if (reduced) {
      setBootDone(BOOT)
      setBootActive(null)
      setBooted(true)
      return
    }

    setBootDone([])
    setBootActive(null)
    setBooted(false)
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
      if (lineIdx.current >= BOOT.length) {
        setBootActive(null)
        setBooted(true)
        return
      }
      const line = BOOT[lineIdx.current]
      if (charIdx.current < line.text.length) {
        charIdx.current += 1
        setBootActive({ cls: line.cls, shown: line.text.slice(0, charIdx.current) })
        schedule(typeNext, 28 + Math.random() * 40)
        return
      }
      setBootDone((prev) => [...prev, line])
      setBootActive(null)
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

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [bootDone, bootActive, lines, booted])

  const focusInput = useCallback((): void => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(
    (raw: string): void => {
      const trimmed = raw.trimEnd()
      const echo: TermLine = { text: `$ ${trimmed}`, cls: "p" }
      if (!trimmed) {
        setLines((prev) => [...prev, echo])
        return
      }

      const out = runCommand(trimmed)
      if (out.length === 1 && out[0].text === "__CLEAR__") {
        setLines([])
        setHistory((h) => [...h, trimmed])
        histIdx.current = -1
        return
      }

      setLines((prev) => [...prev, echo, ...out])
      setHistory((h) => [...h, trimmed])
      histIdx.current = -1
    },
    [],
  )

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()
    submit(value)
    setValue("")
    draft.current = ""
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!history.length) return
      if (histIdx.current === -1) draft.current = value
      const next = histIdx.current === -1 ? history.length - 1 : Math.max(0, histIdx.current - 1)
      histIdx.current = next
      setValue(history[next] ?? "")
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx.current === -1) return
      if (histIdx.current >= history.length - 1) {
        histIdx.current = -1
        setValue(draft.current)
        return
      }
      const next = histIdx.current + 1
      histIdx.current = next
      setValue(history[next] ?? "")
    }
  }

  return (
    <div
      className="border-2 border-line bg-[var(--term-bg)] text-[13.5px] leading-[1.7] text-[var(--term-ink)] shadow-[var(--shadow)]"
      role="application"
      aria-label="system terminal"
      onClick={focusInput}
    >
      <div className="flex items-center gap-2 border-b-2 border-line bg-surface-2 px-3.5 py-2.5 dark:bg-[#26231F]">
        <i className="size-2.5 border-2 border-line bg-accent" aria-hidden="true" />
        <i className="size-2.5 border-2 border-line bg-accent-2" aria-hidden="true" />
        <i className="size-2.5 border-2 border-line bg-ok" aria-hidden="true" />
        <span className="ml-2.5 text-[11px] tracking-[0.12em] text-ink-soft uppercase">
          daniil@gaplik: ~ — bash
        </span>
      </div>

      <div
        ref={bodyRef}
        className="max-h-[320px] min-h-[210px] overflow-y-auto px-5 py-[18px]"
        aria-live="polite"
      >
        {bootDone.map((line, i) => (
          <div key={`b-${i}-${line.text}`} className="break-words whitespace-pre-wrap">
            {renderPromptLine(line.text, line.cls)}
          </div>
        ))}

        {bootActive && (
          <div className="break-words whitespace-pre-wrap">
            {renderPromptLine(bootActive.shown, bootActive.cls)}
            <span
              className="ml-0.5 inline-block h-[15px] w-2 translate-y-px bg-[var(--term-accent)] align-[-2px] motion-safe:animate-blink"
              aria-hidden="true"
            />
          </div>
        )}

        {booted && bootDone.length > 0 && (
          <div className="break-words whitespace-pre-wrap">
            <span className="text-muted"># greet: </span>
            <LangRotator />
          </div>
        )}

        {lines.map((line, i) => (
          <div key={`l-${i}-${line.text}`} className="break-words whitespace-pre-wrap">
            {renderPromptLine(line.text, line.cls)}
          </div>
        ))}

        {booted && (
          <form onSubmit={onSubmit} className="flex items-center gap-0">
            <span className="font-bold text-[var(--term-accent)]" aria-hidden="true">
              $
            </span>
            <span className="text-muted" aria-hidden="true">
              &nbsp;
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal command"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[13.5px] text-[var(--term-ink)] caret-[var(--term-accent)] outline-none"
            />
          </form>
        )}
      </div>
    </div>
  )
}
