import type { ReactElement } from "react"
import { Window } from "@/components/Window"
import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/SectionLabel"
import { SectionBadge } from "@/components/SectionBadge"

type ContactItem = {
  label: string
  value: string
  href: string
  external?: boolean
  icon: ReactElement
}

const CONTACTS: ContactItem[] = [
  {
    label: "Email",
    value: "verchovskyidania@gmail.com",
    href: "mailto:verchovskyidania@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-[18px]" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/reconix37",
    href: "https://github.com/reconix37",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-[18px]" aria-hidden="true">
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "daniil-verkhovskyi",
    href: "https://linkedin.com/in/daniil-verkhovskyi-237b44417",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-[18px]" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    value: "@daniil_vk",
    href: "https://t.me/daniil_vk",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-[18px]" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
]

export function Contact(): ReactElement {
  return (
    <section id="contact" className="relative border-b-2 border-line">
      <SectionLabel text="04 — CONTACT" />
      <div className="wrap py-14 md:py-[72px]">
        <Reveal>
          <Window num="04" title="CONTACT">
            <h2 className="mb-5 text-[clamp(26px,4vw,40px)]">
              Let&apos;s <span className="text-accent">talk</span>
              <SectionBadge text="// 24h response" />
            </h2>
            <p className="mb-9 max-w-[620px] text-ink-soft">
              Open to AI/ML engineering roles and interesting builds. Response within 24h.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-11 flex-col gap-1.5 border-2 border-line bg-bg px-5 py-[18px] text-ink no-underline transition-[box-shadow,transform] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="text-accent">{c.icon}</span>
                  <span className="text-[11px] tracking-[0.12em] text-muted uppercase">
                    {c.label}
                  </span>
                  <span className="break-words font-display text-base font-bold transition-colors group-hover:text-accent">
                    {c.value}
                  </span>
                </a>
              ))}
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  )
}
