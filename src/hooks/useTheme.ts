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

  const toggleTheme = useCallback((): void => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggleTheme }
}
