import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

interface WindowProps {
  num: string
  title: string
  children: ReactNode
  className?: string
  draggable?: boolean
}

export function Window({
  num,
  title,
  children,
  className,
  draggable = true,
}: WindowProps): ReactElement {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches)
  }, [])

  const enabled = draggable && finePointer

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>): void => {
      if (!enabled || e.button !== 0) return
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offset.x,
        oy: offset.y,
      }
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled, offset.x, offset.y],
  )

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!dragStart.current) return
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    })
  }, [])

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!dragStart.current) return
    dragStart.current = null
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }, [])

  return (
    <div
      className={cn(
        "relative border-2 border-line bg-surface shadow-[var(--shadow)] transition-[box-shadow] hover:shadow-[var(--shadow-hover)]",
        dragging && "z-40 shadow-[var(--shadow-hover)]",
        className,
      )}
      style={
        offset.x !== 0 || offset.y !== 0
          ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
          : undefined
      }
    >
      <div
        className={cn(
          "flex items-center justify-between border-b-2 border-line bg-surface-2 px-4 py-2.5 text-xs tracking-[0.14em] uppercase select-none",
          enabled && "cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div>
          <b className="font-bold text-accent">{num}</b>
          {" — "}
          {title}
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          <i className="inline-block size-3 border-2 border-line" />
          <i className="inline-block size-3 border-2 border-line" />
          <i className="inline-block size-3 border-2 border-line" />
        </div>
      </div>
      <div className="p-5 md:p-7 md:px-8">{children}</div>
    </div>
  )
}
