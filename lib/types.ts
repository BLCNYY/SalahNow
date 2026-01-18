export interface Location {
  city: string
  country: string
  countryCode: string
  lat: number
  lon: number
  addressLabel?: string
  diyanetIlceId?: string
}

export interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

export interface PrayerTime {
  name: string
  time: string
  timestamp: number
}

export type PrayerName = keyof PrayerTimes

export const PRAYER_NAMES: PrayerName[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"]

export const COUNTRIES: Location[] = [
  { city: "Adana", country: "Türkiye", countryCode: "TR", lat: 37.0000, lon: 35.3213, diyanetIlceId: "9146" },
  { city: "Adıyaman", country: "Türkiye", countryCode: "TR", lat: 37.7648, lon: 38.2786, diyanetIlceId: "9158" },
  { city: "Afyonkarahisar", country: "Türkiye", countryCode: "TR", lat: 38.7507, lon: 30.5567, diyanetIlceId: "9167" },
  { city: "Ağrı", country: "Türkiye", countryCode: "TR", lat: 39.7191, lon: 43.0503, diyanetIlceId: "9182" },
  { city: "Aksaray", country: "Türkiye", countryCode: "TR", lat: 38.3687, lon: 34.0370, diyanetIlceId: "9186" },
  { city: "Amasya", country: "Türkiye", countryCode: "TR", lat: 40.6499, lon: 35.8353, diyanetIlceId: "9193" },
  { city: "Ankara", country: "Türkiye", countryCode: "TR", lat: 39.9334, lon: 32.8597, diyanetIlceId: "9206" },
  { city: "Antalya", country: "Türkiye", countryCode: "TR", lat: 36.8969, lon: 30.7133, diyanetIlceId: "9225" },
  { city: "Ardahan", country: "Türkiye", countryCode: "TR", lat: 41.1105, lon: 42.7022, diyanetIlceId: "9243" },
  { city: "Artvin", country: "Türkiye", countryCode: "TR", lat: 41.1828, lon: 41.8183, diyanetIlceId: "9251" },
  { city: "Aydın", country: "Türkiye", countryCode: "TR", lat: 37.8560, lon: 27.8416, diyanetIlceId: "9261" },
  { city: "Balıkesir", country: "Türkiye", countryCode: "TR", lat: 39.6484, lon: 27.8826, diyanetIlceId: "9285" },
  { city: "Bartın", country: "Türkiye", countryCode: "TR", lat: 41.6344, lon: 32.3375, diyanetIlceId: "9303" },
  { city: "Batman", country: "Türkiye", countryCode: "TR", lat: 37.8812, lon: 41.1351, diyanetIlceId: "9308" },
  { city: "Bayburt", country: "Türkiye", countryCode: "TR", lat: 40.2552, lon: 40.2249, diyanetIlceId: "9315" },
  { city: "Bilecik", country: "Türkiye", countryCode: "TR", lat: 40.0567, lon: 30.0665, diyanetIlceId: "9319" },
  { city: "Bingöl", country: "Türkiye", countryCode: "TR", lat: 38.8854, lon: 40.4966, diyanetIlceId: "9329" },
  { city: "Bitlis", country: "Türkiye", countryCode: "TR", lat: 38.4004, lon: 42.1095, diyanetIlceId: "9339" },
  { city: "Bolu", country: "Türkiye", countryCode: "TR", lat: 40.7392, lon: 31.6089, diyanetIlceId: "9348" },
  { city: "Burdur", country: "Türkiye", countryCode: "TR", lat: 37.7203, lon: 30.2906, diyanetIlceId: "9359" },
  { city: "Bursa", country: "Türkiye", countryCode: "TR", lat: 40.1826, lon: 29.0665, diyanetIlceId: "9370" },
  { city: "Çanakkale", country: "Türkiye", countryCode: "TR", lat: 40.1553, lon: 26.4142, diyanetIlceId: "9392" },
  { city: "Çankırı", country: "Türkiye", countryCode: "TR", lat: 40.6013, lon: 33.6134, diyanetIlceId: "9405" },
  { city: "Çorum", country: "Türkiye", countryCode: "TR", lat: 40.5506, lon: 34.9556, diyanetIlceId: "9418" },
  { city: "Denizli", country: "Türkiye", countryCode: "TR", lat: 37.7765, lon: 29.0864, diyanetIlceId: "9433" },
  { city: "Diyarbakır", country: "Türkiye", countryCode: "TR", lat: 37.9144, lon: 40.2306, diyanetIlceId: "9453" },
  { city: "Düzce", country: "Türkiye", countryCode: "TR", lat: 40.8438, lon: 31.1565, diyanetIlceId: "9471" },
  { city: "Edirne", country: "Türkiye", countryCode: "TR", lat: 41.6818, lon: 26.5623, diyanetIlceId: "9479" },
  { city: "Elazığ", country: "Türkiye", countryCode: "TR", lat: 38.6810, lon: 39.2264, diyanetIlceId: "9489" },
  { city: "Erzincan", country: "Türkiye", countryCode: "TR", lat: 39.7500, lon: 39.5000, diyanetIlceId: "9500" },
  { city: "Erzurum", country: "Türkiye", countryCode: "TR", lat: 39.9055, lon: 41.2658, diyanetIlceId: "9510" },
  { city: "Eskişehir", country: "Türkiye", countryCode: "TR", lat: 39.7767, lon: 30.5206, diyanetIlceId: "9530" },
  { city: "Gaziantep", country: "Türkiye", countryCode: "TR", lat: 37.0662, lon: 37.3833, diyanetIlceId: "9544" },
  { city: "Giresun", country: "Türkiye", countryCode: "TR", lat: 40.9128, lon: 38.3895, diyanetIlceId: "9556" },
  { city: "Gümüşhane", country: "Türkiye", countryCode: "TR", lat: 40.4386, lon: 39.5086, diyanetIlceId: "9573" },
  { city: "Hakkari", country: "Türkiye", countryCode: "TR", lat: 37.5833, lon: 43.7333, diyanetIlceId: "9580" },
  { city: "Hatay", country: "Türkiye", countryCode: "TR", lat: 36.4018, lon: 36.3498, diyanetIlceId: "9586" },
  { city: "Iğdır", country: "Türkiye", countryCode: "TR", lat: 39.9237, lon: 44.0450, diyanetIlceId: "9602" },
  { city: "Isparta", country: "Türkiye", countryCode: "TR", lat: 37.7648, lon: 30.5566, diyanetIlceId: "9609" },
  { city: "İstanbul", country: "Türkiye", countryCode: "TR", lat: 41.0082, lon: 28.9784, diyanetIlceId: "9541" },
  { city: "İzmir", country: "Türkiye", countryCode: "TR", lat: 38.4237, lon: 27.1428, diyanetIlceId: "9560" },
  { city: "Kahramanmaraş", country: "Türkiye", countryCode: "TR", lat: 37.5858, lon: 36.9371, diyanetIlceId: "9667" },
  { city: "Karabük", country: "Türkiye", countryCode: "TR", lat: 41.2061, lon: 32.6204, diyanetIlceId: "9680" },
  { city: "Karaman", country: "Türkiye", countryCode: "TR", lat: 37.1759, lon: 33.2287, diyanetIlceId: "9688" },
  { city: "Kars", country: "Türkiye", countryCode: "TR", lat: 40.6167, lon: 43.1000, diyanetIlceId: "9696" },
  { city: "Kastamonu", country: "Türkiye", countryCode: "TR", lat: 41.3887, lon: 33.7827, diyanetIlceId: "9707" },
  { city: "Kayseri", country: "Türkiye", countryCode: "TR", lat: 38.7312, lon: 35.4787, diyanetIlceId: "9727" },
  { city: "Kilis", country: "Türkiye", countryCode: "TR", lat: 36.7184, lon: 37.1212, diyanetIlceId: "9744" },
  { city: "Kırıkkale", country: "Türkiye", countryCode: "TR", lat: 39.8468, lon: 33.5153, diyanetIlceId: "9750" },
  { city: "Kırklareli", country: "Türkiye", countryCode: "TR", lat: 41.7333, lon: 27.2167, diyanetIlceId: "9761" },
  { city: "Kırşehir", country: "Türkiye", countryCode: "TR", lat: 39.1425, lon: 34.1709, diyanetIlceId: "9771" },
  { city: "Kocaeli", country: "Türkiye", countryCode: "TR", lat: 40.8533, lon: 29.8815, diyanetIlceId: "9781" },
  { city: "Konya", country: "Türkiye", countryCode: "TR", lat: 37.8667, lon: 32.4833, diyanetIlceId: "9795" },
  { city: "Kütahya", country: "Türkiye", countryCode: "TR", lat: 39.4167, lon: 29.9833, diyanetIlceId: "9828" },
  { city: "Malatya", country: "Türkiye", countryCode: "TR", lat: 38.3552, lon: 38.3095, diyanetIlceId: "9843" },
  { city: "Manisa", country: "Türkiye", countryCode: "TR", lat: 38.6191, lon: 27.4289, diyanetIlceId: "9858" },
  { city: "Mardin", country: "Türkiye", countryCode: "TR", lat: 37.3212, lon: 40.7245, diyanetIlceId: "9876" },
  { city: "Mersin", country: "Türkiye", countryCode: "TR", lat: 36.8121, lon: 34.6415, diyanetIlceId: "9893" },
  { city: "Muğla", country: "Türkiye", countryCode: "TR", lat: 37.2153, lon: 28.3636, diyanetIlceId: "9908" },
  { city: "Muş", country: "Türkiye", countryCode: "TR", lat: 38.9462, lon: 41.7539, diyanetIlceId: "9923" },
  { city: "Nevşehir", country: "Türkiye", countryCode: "TR", lat: 38.6939, lon: 34.6857, diyanetIlceId: "9932" },
  { city: "Niğde", country: "Türkiye", countryCode: "TR", lat: 37.9667, lon: 34.6833, diyanetIlceId: "9942" },
  { city: "Ordu", country: "Türkiye", countryCode: "TR", lat: 40.9839, lon: 37.8764, diyanetIlceId: "9952" },
  { city: "Osmaniye", country: "Türkiye", countryCode: "TR", lat: 37.0742, lon: 36.2463, diyanetIlceId: "9972" },
  { city: "Rize", country: "Türkiye", countryCode: "TR", lat: 41.0201, lon: 40.5234, diyanetIlceId: "9981" },
  { city: "Sakarya", country: "Türkiye", countryCode: "TR", lat: 40.7569, lon: 30.3781, diyanetIlceId: "9994" },
  { city: "Samsun", country: "Türkiye", countryCode: "TR", lat: 41.2867, lon: 36.3300, diyanetIlceId: "20010" },
  { city: "Şanlıurfa", country: "Türkiye", countryCode: "TR", lat: 37.1591, lon: 38.7969, diyanetIlceId: "20045" },
  { city: "Siirt", country: "Türkiye", countryCode: "TR", lat: 37.9333, lon: 41.9500, diyanetIlceId: "20028" },
  { city: "Sinop", country: "Türkiye", countryCode: "TR", lat: 42.0231, lon: 35.1531, diyanetIlceId: "20036" },
  { city: "Şırnak", country: "Türkiye", countryCode: "TR", lat: 37.4187, lon: 42.4918, diyanetIlceId: "20062" },
  { city: "Sivas", country: "Türkiye", countryCode: "TR", lat: 39.7477, lon: 37.0179, diyanetIlceId: "20072" },
  { city: "Tekirdağ", country: "Türkiye", countryCode: "TR", lat: 40.9833, lon: 27.5167, diyanetIlceId: "20093" },
  { city: "Tokat", country: "Türkiye", countryCode: "TR", lat: 40.3167, lon: 36.5500, diyanetIlceId: "20107" },
  { city: "Trabzon", country: "Türkiye", countryCode: "TR", lat: 41.0015, lon: 39.7178, diyanetIlceId: "20121" },
  { city: "Tunceli", country: "Türkiye", countryCode: "TR", lat: 39.1079, lon: 39.5401, diyanetIlceId: "20140" },
  { city: "Uşak", country: "Türkiye", countryCode: "TR", lat: 38.6823, lon: 29.4082, diyanetIlceId: "20150" },
  { city: "Van", country: "Türkiye", countryCode: "TR", lat: 38.4891, lon: 43.4089, diyanetIlceId: "20158" },
  { city: "Yalova", country: "Türkiye", countryCode: "TR", lat: 40.6500, lon: 29.2667, diyanetIlceId: "20175" },
  { city: "Yozgat", country: "Türkiye", countryCode: "TR", lat: 39.8181, lon: 34.8147, diyanetIlceId: "20182" },
  { city: "Zonguldak", country: "Türkiye", countryCode: "TR", lat: 41.4564, lon: 31.7987, diyanetIlceId: "20198" },
  { city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lon: -0.1278 },
  { city: "Birmingham", country: "United Kingdom", countryCode: "GB", lat: 52.4862, lon: -1.8904 },
  { city: "Manchester", country: "United Kingdom", countryCode: "GB", lat: 53.4808, lon: -2.2426 },
  { city: "New York", country: "United States", countryCode: "US", lat: 40.7128, lon: -74.0060 },
  { city: "Los Angeles", country: "United States", countryCode: "US", lat: 34.0522, lon: -118.2437 },
  { city: "Chicago", country: "United States", countryCode: "US", lat: 41.8781, lon: -87.6298 },
  { city: "Mecca", country: "Saudi Arabia", countryCode: "SA", lat: 21.4225, lon: 39.8262 },
  { city: "Medina", country: "Saudi Arabia", countryCode: "SA", lat: 24.5247, lon: 39.5692 },
  { city: "Riyadh", country: "Saudi Arabia", countryCode: "SA", lat: 24.7136, lon: 46.6753 },
  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.2048, lon: 55.2708 },
  { city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", lat: 24.4539, lon: 54.3773 },
  { city: "Cairo", country: "Egypt", countryCode: "EG", lat: 30.0444, lon: 31.2357 },
  { city: "Berlin", country: "Germany", countryCode: "DE", lat: 52.5200, lon: 13.4050 },
  { city: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lon: 2.3522 },
]

export const COUNTRIES_LIST = Array.from(
  new Map(COUNTRIES.map(loc => [loc.countryCode, { country: loc.country, countryCode: loc.countryCode }])).values()
)

export function getCitiesByCountry(countryCode: string): Location[] {
  return COUNTRIES.filter(loc => loc.countryCode === countryCode)
}

export const DEFAULT_LOCATION: Location = COUNTRIES.find(loc => loc.city === "İstanbul")!

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function findNearestLocation(lat: number, lon: number): Location {
  let nearest = DEFAULT_LOCATION
  let minDistance = Infinity
  
  for (const loc of COUNTRIES) {
    const distance = haversineDistance(lat, lon, loc.lat, loc.lon)
    if (distance < minDistance) {
      minDistance = distance
      nearest = loc
    }
  }
  
  return nearest
}

export function getNearestLocations(lat: number, lon: number, limit: number): Location[] {
  return COUNTRIES.map((loc) => ({
    loc,
    distance: haversineDistance(lat, lon, loc.lat, loc.lon),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((entry) => entry.loc)
}
