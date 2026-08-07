import { useCallback, useEffect, useState } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "dos-theme"

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  return "light"
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

const EVENT = "dos-theme-toggle"

/** Для терминала и внешних триггеров — синхронизирует все useTheme. */
export function toggleDosTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark"
  applyTheme(next)
  localStorage.setItem(STORAGE_KEY, next)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
  return next
}

export function useTheme(): {
  theme: Theme
  toggleTheme: () => void
} {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    const initial = readStoredTheme()
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const onToggle = (e: Event): void => {
      const detail = (e as CustomEvent<Theme>).detail
      if (detail === "dark" || detail === "light") setTheme(detail)
    }
    window.addEventListener(EVENT, onToggle)
    return () => window.removeEventListener(EVENT, onToggle)
  }, [])

  const toggleTheme = useCallback((): void => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark"
      applyTheme(next)
      localStorage.setItem(STORAGE_KEY, next)
      window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
