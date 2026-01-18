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
const MONTHLY_CACHE_KEY = "salahnow-prayer-cache-30d"
const ALADHAN_BASE_URL = "https://api.aladhan.com/v1"

function getCacheKey(location: Location): string {
  return `${location.city}-${location.countryCode}`
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]
}

function formatLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDateRange(days: number): { startDate: Date; endDate: Date } {
  const startDate = normalizeDate(new Date())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + days - 1)
  return { startDate, endDate }
}

function parseDiyanetDate(dateStr: string): Date | null {
  const [day, month, year] = dateStr.split(".").map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

interface CachedMonthlyPrayerData {
  data: DiyanetPrayerTime[]
  startDate: string
  endDate: string
  location: string
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

function getCachedMonthlyData(location: Location): DiyanetPrayerTime[] | null {
  if (typeof window === "undefined") return null
  try {
    const cached = localStorage.getItem(MONTHLY_CACHE_KEY)
    if (!cached) return null
    const data: Record<string, CachedMonthlyPrayerData> = JSON.parse(cached)
    const key = getCacheKey(location)
    const entry = data[key]
    if (!entry) return null
    const today = normalizeDate(new Date())
    const startDate = parseLocalDateString(entry.startDate)
    const endDate = parseLocalDateString(entry.endDate)
    if (today < startDate || today > endDate) return null
    return entry.data
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

function setCachedMonthlyData(location: Location, data: DiyanetPrayerTime[], startDate: Date, endDate: Date): void {
  if (typeof window === "undefined") return
  try {
    const cached = localStorage.getItem(MONTHLY_CACHE_KEY)
    const stored: Record<string, CachedMonthlyPrayerData> = cached ? JSON.parse(cached) : {}
    const key = getCacheKey(location)
    stored[key] = {
      data,
      startDate: formatLocalDateString(startDate),
      endDate: formatLocalDateString(endDate),
      location: key,
    }
    localStorage.setItem(MONTHLY_CACHE_KEY, JSON.stringify(stored))
  } catch {
    console.error("Failed to cache monthly prayer times")
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
    prefetchMonthlyPrayerTimes(location)
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

async function fetchMonthlyFromAlAdhan(location: Location, year: number, month: number): Promise<DiyanetPrayerTime[]> {
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

function filterPrayerTimesToRange(data: DiyanetPrayerTime[], startDate: Date, endDate: Date): DiyanetPrayerTime[] {
  return data
    .map(item => {
      const parsedDate = parseDiyanetDate(item.MiladiTarihKisa)
      return parsedDate ? { item, parsedDate } : null
    })
    .filter((entry): entry is { item: DiyanetPrayerTime; parsedDate: Date } => Boolean(entry))
    .filter(({ parsedDate }) => parsedDate >= startDate && parsedDate <= endDate)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .map(({ item }) => item)
}

async function fetchNext30DaysFromAlAdhan(location: Location): Promise<DiyanetPrayerTime[]> {
  const { startDate, endDate } = getDateRange(30)
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth() + 1

  const currentMonthData = await fetchMonthlyFromAlAdhan(location, startYear, startMonth)

  let combined = currentMonthData
  if (startYear !== endYear || startMonth !== endMonth) {
    const nextMonthData = await fetchMonthlyFromAlAdhan(location, endYear, endMonth)
    combined = [...currentMonthData, ...nextMonthData]
  }

  return filterPrayerTimesToRange(combined, startDate, endDate)
}

function filterNext30Days(data: DiyanetPrayerTime[]): { filtered: DiyanetPrayerTime[]; startDate: Date; endDate: Date } {
  const { startDate, endDate } = getDateRange(30)
  const filtered = filterPrayerTimesToRange(data, startDate, endDate)
  return { filtered, startDate, endDate }
}

async function fetchNext30DaysFromDiyanet(location: Location): Promise<{ filtered: DiyanetPrayerTime[]; startDate: Date; endDate: Date }> {
  const data = await fetchFromDiyanet(location.diyanetIlceId as string)
  return filterNext30Days(data)
}

export async function fetchMonthlyPrayerTimes(location: Location): Promise<DiyanetPrayerTime[]> {
  const cached = getCachedMonthlyData(location)
  if (cached) {
    return cached
  }
  if (location.diyanetIlceId) {
    const result = await fetchNext30DaysFromDiyanet(location)
    setCachedMonthlyData(location, result.filtered, result.startDate, result.endDate)
    return result.filtered
  }
  const { startDate, endDate } = getDateRange(30)
  const data = await fetchNext30DaysFromAlAdhan(location)
  setCachedMonthlyData(location, data, startDate, endDate)
  return data
}

function prefetchMonthlyPrayerTimes(location: Location): void {
  fetchMonthlyPrayerTimes(location).catch(() => {})
}
