"use client"

import * as React from "react"
import { PrayerTimes, PrayerName, PRAYER_NAMES, Location } from "@/lib/types"
import { fetchPrayerTimes, fetchTomorrowFajr } from "@/lib/api"
import { getCurrentPrayerInfo, formatCountdown } from "@/lib/prayer-utils"

interface PrayerListItem {
  name: PrayerName
  time: string
  isActive: boolean
}

interface PrayerTimesState {
  prayerTimes: PrayerTimes | null
  tomorrowFajr: string | null
  loading: boolean
  error: string | null
  currentPrayer: PrayerName | null
  nextPrayer: PrayerName
  countdown: string
  prayerList: PrayerListItem[]
}

export function usePrayerTimes(location: Location) {
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTimes | null>(null)
  const [tomorrowFajr, setTomorrowFajr] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [countdown, setCountdown] = React.useState("00:00:00")
  const [currentPrayer, setCurrentPrayer] = React.useState<PrayerName | null>(null)
  const [nextPrayer, setNextPrayer] = React.useState<PrayerName>("Fajr")
  const [prayerList, setPrayerList] = React.useState<PrayerListItem[]>([])

  React.useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadPrayerTimes() {
      try {
        const [times, tomorrow] = await Promise.all([
          fetchPrayerTimes(location),
          fetchTomorrowFajr(location),
        ])

        if (isMounted) {
          setPrayerTimes(times)
          setTomorrowFajr(tomorrow)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch prayer times")
          setLoading(false)
        }
      }
    }

    loadPrayerTimes()

    return () => {
      isMounted = false
    }
  }, [location])

  React.useEffect(() => {
    if (!prayerTimes) return

    function updateCountdown() {
      const info = getCurrentPrayerInfo(prayerTimes!, tomorrowFajr || undefined)
      setCountdown(formatCountdown(info.timeUntilNext))
      setCurrentPrayer(info.currentPrayer)
      setNextPrayer(info.nextPrayer)

      const isSunriseWindow = info.currentPrayer === "Sunrise"
      
      setPrayerList(PRAYER_NAMES.map((name) => ({
        name,
        time: prayerTimes![name],
        isActive: !isSunriseWindow && info.currentPrayer === name,
      })))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [prayerTimes, tomorrowFajr])

  return {
    prayerTimes,
    tomorrowFajr,
    loading,
    error,
    currentPrayer,
    nextPrayer,
    countdown,
    prayerList,
  } as PrayerTimesState
}
