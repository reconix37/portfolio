import { useEffect, useRef, type ReactElement } from "react"

export function Mascot(): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const balls = host.querySelectorAll<SVGElement>(".eye-ball")
    if (!balls.length) return

    const onMove = (e: MouseEvent): void => {
      const rect = host.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.max(Math.abs(dx), Math.abs(dy), 1)
      const mx = (dx / dist) * 5
      const my = (dy / dist) * 4
      balls.forEach((ball) => {
        ball.setAttribute("transform", `translate(${mx} ${my})`)
      })
    }

    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div className="relative flex min-h-[240px] items-center justify-center md:min-h-[320px]">
      <div
        ref={hostRef}
        className="text-ink"
        role="img"
        aria-label="DANIIL OS mascot — a pixel robot with a monitor head"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="220"
          height="220"
          className="max-w-full"
        >
          {/* antenna */}
          <rect x="97" y="18" width="6" height="16" fill="currentColor" opacity=".35" />
          <circle cx="100" cy="14" r="6" fill="currentColor" className="m-antenna" />
          {/* head (monitor) */}
          <rect
            x="40"
            y="34"
            width="120"
            height="88"
            fill="currentColor"
            opacity=".06"
            stroke="currentColor"
            strokeWidth="5"
          />
          {/* screen */}
          <rect x="52" y="46" width="96" height="64" fill="currentColor" opacity=".10" />
          {/* eyes */}
          <rect x="64" y="62" width="26" height="22" fill="currentColor" opacity=".85" className="m-eye">
            <animate
              attributeName="opacity"
              values=".85;.85;.2;.85"
              dur="4s"
              repeatCount="indefinite"
              begin="2s"
            />
          </rect>
          <rect x="110" y="62" width="26" height="22" fill="currentColor" opacity=".85" className="m-eye">
            <animate
              attributeName="opacity"
              values=".85;.85;.2;.85"
              dur="4s"
              repeatCount="indefinite"
              begin="2s"
            />
          </rect>
          {/* pupils */}
          <rect
            x="74"
            y="72"
            width="8"
            height="8"
            fill="currentColor"
            className="eye-ball transition-transform duration-150 ease-out motion-reduce:transition-none"
          />
          <rect
            x="120"
            y="72"
            width="8"
            height="8"
            fill="currentColor"
            className="eye-ball transition-transform duration-150 ease-out motion-reduce:transition-none"
          />
          {/* mouth */}
          <rect x="76" y="98" width="48" height="4" fill="currentColor" opacity=".6" />
          {/* neck */}
          <rect x="90" y="122" width="20" height="16" fill="currentColor" opacity=".35" />
          {/* body */}
          <rect
            x="52"
            y="138"
            width="96"
            height="52"
            fill="currentColor"
            opacity=".06"
            stroke="currentColor"
            strokeWidth="5"
          />
          {/* chest light */}
          <rect x="92" y="152" width="16" height="16" fill="currentColor" className="m-heart">
            <animate attributeName="opacity" values="1;.25;1" dur="1.8s" repeatCount="indefinite" />
          </rect>
          {/* arms */}
          <rect x="28" y="146" width="16" height="34" fill="currentColor" opacity=".35" />
          <rect x="156" y="146" width="16" height="34" fill="currentColor" opacity=".35" />
          {/* legs */}
          <rect x="68" y="190" width="22" height="8" fill="currentColor" opacity=".5" />
          <rect x="110" y="190" width="22" height="8" fill="currentColor" opacity=".5" />
        </svg>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs tracking-[0.08em] text-muted uppercase">
        ▲ watching you
      </div>
    </div>
  )
}
