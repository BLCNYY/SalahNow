"use client"

import * as React from "react"
import { DEFAULT_PRAYER_SOURCE, PRAYER_SOURCES, PrayerSource } from "@/lib/prayer-source"

const PRAYER_SOURCE_STORAGE_KEY = "salahnow-prayer-source"

interface SettingsState {
  prayerSource: PrayerSource
  setPrayerSource: (source: PrayerSource) => void
}

const SettingsContext = React.createContext<SettingsState | null>(null)

function loadPrayerSource(): PrayerSource {
  if (typeof window === "undefined") return DEFAULT_PRAYER_SOURCE
  try {
    const stored = localStorage.getItem(PRAYER_SOURCE_STORAGE_KEY)
    if (stored && PRAYER_SOURCES.includes(stored as PrayerSource)) {
      return stored as PrayerSource
    }
  } catch {
    return DEFAULT_PRAYER_SOURCE
  }
  return DEFAULT_PRAYER_SOURCE
}

function savePrayerSource(source: PrayerSource) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PRAYER_SOURCE_STORAGE_KEY, source)
  } catch {
    console.error("Failed to save prayer source")
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [prayerSource, setPrayerSourceState] = React.useState<PrayerSource>(DEFAULT_PRAYER_SOURCE)

  React.useEffect(() => {
    setPrayerSourceState(loadPrayerSource())
  }, [])

  const setPrayerSource = React.useCallback((source: PrayerSource) => {
    setPrayerSourceState(source)
    savePrayerSource(source)
  }, [])

  const value = React.useMemo(
    () => ({
      prayerSource,
      setPrayerSource,
    }),
    [prayerSource, setPrayerSource]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider")
  }
  return context
}
