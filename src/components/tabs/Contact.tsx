import { useState, type MouseEvent, type ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"
import { cn } from "@/lib/utils"

type PortRow = {
  port: string
  proto: string
  addr: string
  copyValue: string
  href: string
  preferred?: boolean
  external?: boolean
}

const PORTS: PortRow[] = [
  {
    port: ":mail",
    proto: "smtp",
    addr: "verchovskyidania@gmail.com",
    copyValue: "verchovskyidania@gmail.com",
    href: "mailto:verchovskyidania@gmail.com",
  },
  {
    port: ":gh",
    proto: "https",
    addr: "github.com/reconix37",
    copyValue: "https://github.com/reconix37",
    href: "https://github.com/reconix37",
    external: true,
  },
  {
    port: ":li",
    proto: "https",
    addr: "linkedin.com/in/daniil-verkhovskyi",
    copyValue: "https://www.linkedin.com/in/daniil-verkhovskyi-237b44417/",
    href: "https://www.linkedin.com/in/daniil-verkhovskyi-237b44417/",
    external: true,
  },
  {
    port: ":tg",
    proto: "telegram",
    addr: "@verkhovskyi",
    copyValue: "https://t.me/verkhovskyi",
    href: "https://t.me/verkhovskyi",
    preferred: true,
    external: true,
  },
]

const HANDSHAKE = [
  "Skip the soft pitch. What broke, what you tried, what you need.",
  "Show me something that shipped. Slideware gets a polite smile.",
  "Reply in ~24h. If I ghost — ping again, I'm not offended.",
]

function openPort(row: PortRow): void {
  if (row.external) {
    window.open(row.href, "_blank", "noopener,noreferrer")
  } else {
    window.location.href = row.href
  }
}

export function Contact(): ReactElement {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (
    e: MouseEvent,
    key: string,
    text: string,
  ): Promise<void> => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 1500)
    } catch {
      /* clipboard denied */
    }
  }

  const preferred = PORTS.find((p) => p.preferred)

  return (
    <section className="relative" aria-labelledby="contact-heading">
      <SectionLabel text="05 — CONTACT" />
      <div className="wrap py-8 md:py-10">
        <h2 id="contact-heading" className="mb-2 text-[clamp(26px,4vw,40px)]">
          ESTABLISH CONNECTION
          <SectionBadge text="// 24h response" />
        </h2>
        <p className="mb-5 font-mono text-sm text-muted">
          {"// channels are open — pick one, I actually reply"}
        </p>

        {preferred && (
          <a
            href={preferred.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mb-5 flex min-h-11 items-center justify-between gap-3 border-2 border-line bg-accent px-4 py-3",
              "font-mono text-sm tracking-[0.06em] text-bg no-underline dark:text-[#121110]",
              "shadow-[var(--shadow)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            )}
          >
            <span>
              {">> OPEN TELEGRAM "}
              <span className="font-bold">{preferred.addr}</span>
              {" — preferred"}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        )}

        <div className="mb-6 overflow-x-auto border-2 border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink text-bg dark:bg-[#E8E4DC] dark:text-[#121110]">
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  PORT
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  PROTO
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  ADDR
                </th>
                <th className="border-b-2 border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] font-bold uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {PORTS.map((row, i) => (
                <tr
                  key={row.port}
                  tabIndex={0}
                  role="link"
                  aria-label={`Open ${row.addr}`}
                  className={cn(
                    "cursor-pointer border-b-2 border-line last:border-b-0 transition-colors",
                    "hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                    i % 2 === 1 ? "bg-surface" : "bg-transparent",
                    row.preferred && "bg-accent-2/40",
                  )}
                  onClick={() => openPort(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openPort(row)
                    }
                  }}
                >
                  <td className="px-4 py-3.5 font-mono text-xs tracking-[0.08em] text-muted uppercase">
                    {row.port}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {row.proto}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "break-all font-mono text-sm text-ink",
                        row.preferred && "font-bold",
                      )}
                    >
                      {row.addr}
                    </span>
                    {row.preferred && (
                      <span className="ml-2 inline-block border-2 border-accent px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
                        preferred
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs tracking-[0.08em] text-accent uppercase">
                        [open] ↗
                      </span>
                      <button
                        type="button"
                        onClick={(e) => void copy(e, row.port, row.copyValue)}
                        className="min-h-11 border-2 border-line bg-surface px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-ink uppercase hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {copied === row.port ? "copied!" : "[copy]"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-2 border-line bg-bg p-4 shadow-[var(--shadow)]">
          <p className="mb-3 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {"// handshake.rules"}
          </p>
          <ol className="flex flex-col gap-2">
            {HANDSHAKE.map((rule, i) => (
              <li
                key={rule}
                className="flex gap-3 font-mono text-sm leading-relaxed text-ink-soft"
              >
                <span className="shrink-0 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
