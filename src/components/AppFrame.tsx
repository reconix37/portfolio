import type { ReactElement, ReactNode } from "react"

interface AppFrameProps {
  children: ReactNode
}

/** Рамка-окно браузера вокруг табов и панели (KISA-style). */
export function AppFrame({ children }: AppFrameProps): ReactElement {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-2 border-line bg-surface shadow-[var(--shadow)]">
      {/* titlebar — декоративные кнопки */}
      <div
        className="flex shrink-0 items-center gap-2 border-b-2 border-line bg-surface-2 px-3 py-2"
        aria-hidden="true"
      >
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[8px] leading-none text-ink">
          −
        </span>
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[7px] leading-none text-ink">
          □
        </span>
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[8px] leading-none text-ink">
          ×
        </span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
          daniil-os.app
        </span>
      </div>
      {children}
    </div>
  )
}
