"use client"

import * as React from "react"
import { PrayerTimes, PrayerName, PRAYER_NAMES, Location } from "@/lib/types"
import { fetchPrayerTimes, fetchTomorrowFajr } from "@/lib/api"
import { getCurrentPrayerInfo, formatCountdown } from "@/lib/prayer-utils"
import { useSettings } from "@/lib/settings-store"

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
  timeZone: string | null
  localTime: string
  showLocalTime: boolean
}

export function usePrayerTimes(location: Location) {
  const { prayerSource } = useSettings()
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTimes | null>(null)
  const [tomorrowFajr, setTomorrowFajr] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [countdown, setCountdown] = React.useState("00:00:00")
  const [currentPrayer, setCurrentPrayer] = React.useState<PrayerName | null>(null)
  const [nextPrayer, setNextPrayer] = React.useState<PrayerName>("Fajr")
  const [prayerList, setPrayerList] = React.useState<PrayerListItem[]>([])
  const [timeZone, setTimeZone] = React.useState<string | null>(null)
  const [localTime, setLocalTime] = React.useState("")
  const [showLocalTime, setShowLocalTime] = React.useState(false)

  const userTimeZone = React.useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const formatLocalTime = React.useCallback((zone: string) => {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date())
  }, [])

  React.useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    async function loadPrayerTimes() {
      try {
        const [times, tomorrow] = await Promise.all([
          fetchPrayerTimes(location, prayerSource),
          fetchTomorrowFajr(location, prayerSource),
        ])

        if (isMounted) {
          setPrayerTimes(times.times)
          setTimeZone(times.timeZone)
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
  }, [location, prayerSource])

  React.useEffect(() => {
    if (!prayerTimes) return

    function updateCountdown() {
      const info = getCurrentPrayerInfo(prayerTimes!, tomorrowFajr || undefined, timeZone || undefined)
      setCountdown(formatCountdown(info.timeUntilNext))
      setCurrentPrayer(info.currentPrayer)
      setNextPrayer(info.nextPrayer)

      const isSunriseWindow = info.currentPrayer === "Sunrise"
      
      setPrayerList(PRAYER_NAMES.map((name) => ({
        name,
        time: prayerTimes![name],
        isActive: !isSunriseWindow && info.currentPrayer === name,
      })))

      if (timeZone && userTimeZone) {
        setLocalTime(formatLocalTime(timeZone))
        setShowLocalTime(timeZone !== userTimeZone)
      } else {
        setLocalTime("")
        setShowLocalTime(false)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [prayerTimes, tomorrowFajr, timeZone, userTimeZone, formatLocalTime])

  return {
    prayerTimes,
    tomorrowFajr,
    loading,
    error,
    currentPrayer,
    nextPrayer,
    countdown,
    prayerList,
    timeZone,
    localTime,
    showLocalTime,
  } as PrayerTimesState
}
