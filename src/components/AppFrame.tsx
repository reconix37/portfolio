import type { ReactElement, ReactNode } from "react"

interface AppFrameProps {
  children: ReactNode
  onOpenMap?: () => void
  onOpenMan?: () => void
}

/** Рамка-окно + кнопки MAP / ? */
export function AppFrame({ children, onOpenMap, onOpenMan }: AppFrameProps): ReactElement {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-2 border-line bg-surface shadow-[var(--shadow)]">
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-line bg-surface-2 px-3 py-2">
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[8px] leading-none text-ink" aria-hidden="true">
          −
        </span>
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[7px] leading-none text-ink" aria-hidden="true">
          □
        </span>
        <span className="flex size-3.5 items-center justify-center border-2 border-line bg-bg text-[8px] leading-none text-ink" aria-hidden="true">
          ×
        </span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase" aria-hidden="true">
          daniil-os.app
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {onOpenMap && (
            <button
              type="button"
              onClick={onOpenMap}
              className="min-h-9 border-2 border-line bg-bg px-2.5 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
            >
              map
            </button>
          )}
          {onOpenMan && (
            <button
              type="button"
              onClick={onOpenMan}
              className="flex size-9 items-center justify-center border-2 border-line bg-bg font-mono text-xs hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-[#121110]"
              aria-label="Open man page"
              title="man daniil-os (?)"
            >
              ?
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
