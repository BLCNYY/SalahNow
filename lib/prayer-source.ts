export const PRAYER_SOURCES = ["diyanet", "mwl"] as const
export type PrayerSource = (typeof PRAYER_SOURCES)[number]

export const DEFAULT_PRAYER_SOURCE: PrayerSource = "diyanet"
