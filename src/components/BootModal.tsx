import { useEffect, useState, type ReactElement } from "react"
import { cn } from "@/lib/utils"
import { useSfx } from "@/hooks/useSfx"

const BOOT_KEY = "daniil-os-booted"
const LINES = [
  { t: "$ cd /var/daniil-os", cls: "cmd" as const },
  { t: "$ ./boot.sh", cls: "cmd" as const },
  { t: "[OK] cream/graphite/terracotta theme loaded (as nature intended)", cls: "ok" as const },
  { t: "[OK] tabs mounted · whoami/projects/stack/…", cls: "ok" as const },
  { t: "[OK] radio daemon spawned — real tracks, no oscillators harmed", cls: "ok" as const },
  { t: "[OK] mascot sprites warmed up", cls: "ok" as const },
  { t: "[ READY ] daniil os v1.0 online — coffee in hand_", cls: "ready" as const },
]

interface BootModalProps {
  onDone: () => void
}

/** Boot-модалка при первом заходе за сессию (как BOOT.SH у KISA). */
export function BootModal({ onDone }: BootModalProps): ReactElement | null {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(0)
  const { boot } = useSfx()

  useEffect(() => {
    try {
      if (sessionStorage.getItem(BOOT_KEY) === "1") {
        onDone()
        return
      }
    } catch {
      /* private mode */
    }
    setOpen(true)
  }, [onDone])

  useEffect(() => {
    if (!open) return
    if (visible >= LINES.length) return
    const id = window.setTimeout(() => setVisible((v) => v + 1), 280)
    return () => window.clearTimeout(id)
  }, [open, visible])

  const finish = (): void => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1")
    } catch {
      /* ignore */
    }
    boot()
    setOpen(false)
    onDone()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-title"
    >
      <div className="w-full max-w-lg border-2 border-line bg-surface shadow-[var(--shadow-hover)]">
        <div className="flex items-center justify-between border-b-2 border-line bg-surface-2 px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase">
          <span>
            <span className="text-accent">BOOT.SH</span> user@daniil-os ~ $
          </span>
          <button
            type="button"
            onClick={finish}
            className="flex size-9 items-center justify-center border-2 border-line bg-bg text-ink hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            aria-label="Close boot dialog"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
            {"// cold start / first session"}
          </p>
          <h2 id="boot-title" className="mb-4 text-[clamp(22px,3vw,28px)]">
            BOOT{" "}
            <span className="inline-block bg-accent px-1.5 py-0.5 text-bg dark:text-[#121110]">
              DANIIL OS
            </span>
            ?
          </h2>

          <div className="mb-5 border-2 border-line bg-[var(--term-bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--term-ink)]">
            {LINES.slice(0, visible).map((line, i) => (
              <div
                key={i}
                className={cn(
                  line.cls === "cmd" && "text-[var(--term-accent)]",
                  line.cls === "ok" && "text-[var(--term-ok)]",
                  line.cls === "ready" && "mt-1 font-bold text-accent",
                )}
              >
                {line.t}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={finish}
              className="min-h-11 border-2 border-line bg-accent px-4 py-2 font-mono text-xs tracking-[0.1em] text-bg uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-[#121110]"
            >
              enter desktop
            </button>
            <button
              type="button"
              onClick={finish}
              className="min-h-11 border-2 border-line bg-bg px-4 py-2 font-mono text-xs tracking-[0.1em] text-ink uppercase shadow-[3px_3px_0_var(--line)] transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              skip boot
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
