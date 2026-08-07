import { useState, type ReactElement } from "react"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"

type ContactRow = {
  label: string
  value: string
  copyValue: string
  href: string
  external?: boolean
  copyable?: boolean
}

const CONTACTS: ContactRow[] = [
  {
    label: "EMAIL",
    value: "verchovskyidania@gmail.com",
    copyValue: "verchovskyidania@gmail.com",
    href: "mailto:verchovskyidania@gmail.com",
    copyable: true,
  },
  {
    label: "GITHUB",
    value: "github.com/reconix37",
    copyValue: "https://github.com/reconix37",
    href: "https://github.com/reconix37",
    external: true,
    copyable: true,
  },
  {
    label: "LINKEDIN",
    value: "daniil-verkhovskyi",
    copyValue: "https://linkedin.com/in/daniil-verkhovskyi-237b44417",
    href: "https://linkedin.com/in/daniil-verkhovskyi-237b44417",
    external: true,
  },
  {
    label: "TELEGRAM",
    value: "@daniil_vk",
    copyValue: "@daniil_vk",
    href: "https://t.me/daniil_vk",
    external: true,
  },
]

export function Contact(): ReactElement {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (key: string, text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 1500)
    } catch {
      /* clipboard denied */
    }
  }

  return (
    <section className="relative" aria-labelledby="contact-heading">
      <SectionLabel text="05 — CONTACT" />
      <div className="wrap py-8 md:py-10">
        <h2 id="contact-heading" className="mb-8 text-[clamp(26px,4vw,40px)]">
          ESTABLISH CONNECTION
          <SectionBadge text="// 24h response" />
        </h2>

        <ul className="flex flex-col gap-3">
          {CONTACTS.map((c) => (
            <li
              key={c.label}
              className="flex flex-wrap items-center gap-2 border-2 border-line bg-bg px-4 py-3 sm:gap-4"
            >
              <span className="w-24 shrink-0 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                {c.label}
              </span>
              <span className="text-muted" aria-hidden="true">
                —
              </span>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="min-h-11 break-all font-mono text-sm text-ink no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {c.value}
              </a>
              {c.copyable && (
                <button
                  type="button"
                  onClick={() => void copy(c.label, c.copyValue)}
                  className="ml-auto min-h-11 border-2 border-line bg-surface px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-ink uppercase hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {copied === c.label ? "copied!" : "[copy]"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
