import { PrayerTimes, PrayerTime, PRAYER_NAMES, PrayerName } from "./types"

export function getTimeZoneDate(timeZone: string, baseDate: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(baseDate)
    .reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value
      }
      return acc
    }, {} as Record<string, string>)

  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
  )
}

export function timeStringToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const date = new Date(baseDate)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function getPrayerTimesArray(prayerTimes: PrayerTimes, baseDate: Date = new Date()): PrayerTime[] {
  return PRAYER_NAMES.map((name) => ({
    name,
    time: prayerTimes[name],
    timestamp: timeStringToDate(prayerTimes[name], baseDate).getTime(),
  }))
}

export interface CurrentPrayerInfo {
  currentPrayer: PrayerName | null
  nextPrayer: PrayerName
  nextPrayerTime: string
  timeUntilNext: number
  isAfterIsha: boolean
}

export function getCurrentPrayerInfo(
  prayerTimes: PrayerTimes,
  tomorrowFajr?: string,
  timeZone?: string
): CurrentPrayerInfo {
  const now = timeZone ? getTimeZoneDate(timeZone) : new Date()
  const currentTime = now.getTime()
  const prayers = getPrayerTimesArray(prayerTimes, now)

  let currentPrayer: PrayerName | null = null
  let nextPrayer: PrayerName = "Fajr"
  let nextPrayerTime = prayerTimes.Fajr
  let timeUntilNext = 0
  let isAfterIsha = false

  for (let i = prayers.length - 1; i >= 0; i--) {
    if (currentTime >= prayers[i].timestamp) {
      currentPrayer = prayers[i].name as PrayerName
      
      if (i < prayers.length - 1) {
        nextPrayer = prayers[i + 1].name as PrayerName
        nextPrayerTime = prayers[i + 1].time
        timeUntilNext = prayers[i + 1].timestamp - currentTime
      } else {
        isAfterIsha = true
        nextPrayer = "Fajr"
        if (tomorrowFajr) {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          nextPrayerTime = tomorrowFajr
          const tomorrowFajrDate = timeStringToDate(tomorrowFajr, tomorrow)
          timeUntilNext = tomorrowFajrDate.getTime() - currentTime
        } else {
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          nextPrayerTime = prayerTimes.Fajr
          const tomorrowFajrDate = timeStringToDate(prayerTimes.Fajr, tomorrow)
          timeUntilNext = tomorrowFajrDate.getTime() - currentTime
        }
      }
      break
    }
  }

  if (currentPrayer === null) {
    currentPrayer = "Isha"
    nextPrayer = "Fajr"
    nextPrayerTime = prayerTimes.Fajr
    timeUntilNext = prayers[0].timestamp - currentTime
  }

  return {
    currentPrayer,
    nextPrayer,
    nextPrayerTime,
    timeUntilNext,
    isAfterIsha,
  }
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00"

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function isCurrentInterval(prayerName: PrayerName, currentPrayer: PrayerName | null): boolean {
  return currentPrayer === prayerName
}
