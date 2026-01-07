import { PrayerTimes, Location } from "./types"

interface AlAdhanTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface AlAdhanResponse {
  code: number
  status: string
  data: {
    timings: AlAdhanTimings
    meta?: {
      timezone?: string
    }
  }
}

interface AlAdhanCalendarResponse {
  code: number
  status: string
  data: Array<{
    timings: AlAdhanTimings
    date: {
      gregorian: {
        date: string
      }
    }
  }>
}

export interface DiyanetPrayerTime {
  MiladiTarihKisa: string
  MiladiTarihUzun?: string
  HicriTarihKisa?: string
  HicriTarihUzun?: string
  Imsak: string
  Gunes: string
  Ogle: string
  Ikindi: string
  Aksam: string
  Yatsi: string
}

interface CachedPrayerData {
  times: PrayerTimes
  tomorrowFajr: string
  date: string
  location: string
  timeZone?: string | null
}

const CACHE_KEY = "salahnow-prayer-cache"
const ALADHAN_BASE_URL = "https://api.aladhan.com/v1"

function getCacheKey(location: Location): string {
  return `${location.city}-${location.countryCode}`
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]
}

function getCachedData(location: Location): CachedPrayerData | null {
  if (typeof window === "undefined") return null
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const data: Record<string, CachedPrayerData> = JSON.parse(cached)
    const key = getCacheKey(location)
    const entry = data[key]
    if (entry && entry.date === getTodayDateString()) {
      return entry
    }
    return null
  } catch {
    return null
  }
}

function setCachedData(location: Location, times: PrayerTimes, tomorrowFajr: string, timeZone: string | null): void {
  if (typeof window === "undefined") return
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const data: Record<string, CachedPrayerData> = cached ? JSON.parse(cached) : {}
    const key = getCacheKey(location)
    data[key] = {
      times,
      tomorrowFajr,
      date: getTodayDateString(),
      location: key,
      timeZone,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    console.error("Failed to cache prayer times")
  }
}

function formatDateForDiyanet(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function formatTimeToHHMM(time: string): string {
  const parts = time.split(":")
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return time
}

async function fetchFromDiyanet(ilceId: string): Promise<DiyanetPrayerTime[]> {
  const response = await fetch(`/api/diyanet?ilceId=${ilceId}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch prayer times from Diyanet")
  }

  return response.json()
}

function findTodayPrayerTimes(data: DiyanetPrayerTime[], targetDate: Date): DiyanetPrayerTime | undefined {
  const targetDateStr = formatDateForDiyanet(targetDate)
  return data.find(d => d.MiladiTarihKisa === targetDateStr)
}

async function fetchPrayerTimesFromDiyanet(ilceId: string): Promise<PrayerTimes> {
  const data = await fetchFromDiyanet(ilceId)
  const today = new Date()
  const todayTimes = findTodayPrayerTimes(data, today)

  if (!todayTimes) {
    throw new Error("Could not find today's prayer times")
  }

  return {
    Fajr: todayTimes.Imsak,
    Sunrise: todayTimes.Gunes,
    Dhuhr: todayTimes.Ogle,
    Asr: todayTimes.Ikindi,
    Maghrib: todayTimes.Aksam,
    Isha: todayTimes.Yatsi,
  }
}

async function fetchTomorrowFajrFromDiyanet(ilceId: string): Promise<string> {
  const data = await fetchFromDiyanet(ilceId)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowTimes = findTodayPrayerTimes(data, tomorrow)

  if (!tomorrowTimes) {
    throw new Error("Could not find tomorrow's prayer times")
  }

  return tomorrowTimes.Imsak
}

async function fetchPrayerTimesFromAlAdhan(location: Location): Promise<{ times: PrayerTimes; timeZone: string | null }> {
  const today = new Date()
  const timestamp = Math.floor(today.getTime() / 1000)
  const url = `${ALADHAN_BASE_URL}/timings/${timestamp}?latitude=${location.lat}&longitude=${location.lon}&method=3&school=1`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("Failed to fetch prayer times")
  }

  const data: AlAdhanResponse = await response.json()
  const times = data.data.timings

  return {
    times: {
      Fajr: formatTimeToHHMM(times.Fajr),
      Sunrise: formatTimeToHHMM(times.Sunrise),
      Dhuhr: formatTimeToHHMM(times.Dhuhr),
      Asr: formatTimeToHHMM(times.Asr),
      Maghrib: formatTimeToHHMM(times.Maghrib),
      Isha: formatTimeToHHMM(times.Isha),
    },
    timeZone: data.data.meta?.timezone ?? null,
  }
}

async function fetchTomorrowFajrFromAlAdhan(location: Location): Promise<string> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const timestamp = Math.floor(tomorrow.getTime() / 1000)
  const url = `${ALADHAN_BASE_URL}/timings/${timestamp}?latitude=${location.lat}&longitude=${location.lon}&method=3&school=1`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("Failed to fetch tomorrow's prayer times")
  }

  const data: AlAdhanResponse = await response.json()
  return formatTimeToHHMM(data.data.timings.Fajr)
}

export async function fetchPrayerTimes(location: Location): Promise<{ times: PrayerTimes; timeZone: string | null }> {
  const cached = getCachedData(location)
  if (cached) {
    return { times: cached.times, timeZone: cached.timeZone ?? null }
  }

  try {
    let times: PrayerTimes
    let tomorrowFajr: string
    let timeZone: string | null = null

    if (location.diyanetIlceId) {
      times = await fetchPrayerTimesFromDiyanet(location.diyanetIlceId)
      tomorrowFajr = await fetchTomorrowFajrFromDiyanet(location.diyanetIlceId)
      timeZone = "Europe/Istanbul"
    } else {
      const result = await fetchPrayerTimesFromAlAdhan(location)
      times = result.times
      timeZone = result.timeZone
      tomorrowFajr = await fetchTomorrowFajrFromAlAdhan(location)
    }

    setCachedData(location, times, tomorrowFajr, timeZone)
    return { times, timeZone }
  } catch (error) {
    const staleCache = getCachedData(location)
    if (staleCache) {
      return { times: staleCache.times, timeZone: staleCache.timeZone ?? null }
    }
    throw error
  }
}

export async function fetchTomorrowFajr(location: Location): Promise<string> {
  const cached = getCachedData(location)
  if (cached) {
    return cached.tomorrowFajr
  }

  if (location.diyanetIlceId) {
    return fetchTomorrowFajrFromDiyanet(location.diyanetIlceId)
  }
  return fetchTomorrowFajrFromAlAdhan(location)
}

function convertAlAdhanDateToDiyanetFormat(dateStr: string): string {
  const [day, month, year] = dateStr.split("-")
  return `${day}.${month}.${year}`
}

async function fetchMonthlyFromAlAdhan(location: Location): Promise<DiyanetPrayerTime[]> {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  
  const url = `${ALADHAN_BASE_URL}/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lon}&method=3&school=1`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("Failed to fetch monthly prayer times")
  }

  const data: AlAdhanCalendarResponse = await response.json()
  
  return data.data.map(day => ({
    MiladiTarihKisa: convertAlAdhanDateToDiyanetFormat(day.date.gregorian.date),
    Imsak: formatTimeToHHMM(day.timings.Fajr),
    Gunes: formatTimeToHHMM(day.timings.Sunrise),
    Ogle: formatTimeToHHMM(day.timings.Dhuhr),
    Ikindi: formatTimeToHHMM(day.timings.Asr),
    Aksam: formatTimeToHHMM(day.timings.Maghrib),
    Yatsi: formatTimeToHHMM(day.timings.Isha),
  }))
}

export async function fetchMonthlyPrayerTimes(location: Location): Promise<DiyanetPrayerTime[]> {
  if (location.diyanetIlceId) {
    return fetchFromDiyanet(location.diyanetIlceId)
  }
  return fetchMonthlyFromAlAdhan(location)
}
