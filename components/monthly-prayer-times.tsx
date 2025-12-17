"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, Cancel01Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import { useLanguage } from "@/lib/language-store"
import { useLocation } from "@/lib/store"
import { fetchMonthlyPrayerTimes, DiyanetPrayerTime } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { toHijri } from "hijri-converter"

const LANGUAGE_LOCALES: Record<string, string> = {
  en: "en-US",
  tr: "tr-TR",
  ar: "ar-SA",
  de: "de-DE",
  fr: "fr-FR",
}

const HIJRI_MONTHS: Record<string, string[]> = {
  en: ["Muharram", "Safar", "Rabi' I", "Rabi' II", "Jumada I", "Jumada II", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"],
  tr: ["Muharrem", "Safer", "Rebiülevvel", "Rebiülahir", "Cemaziyelevvel", "Cemaziyelahir", "Recep", "Şaban", "Ramazan", "Şevval", "Zilkade", "Zilhicce"],
  ar: ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
  de: ["Muharram", "Safar", "Rabi' I", "Rabi' II", "Dschumada I", "Dschumada II", "Radschab", "Scha'ban", "Ramadan", "Schawwal", "Dhu l-Qa'da", "Dhu l-Hiddscha"],
  fr: ["Mouharram", "Safar", "Rabia I", "Rabia II", "Joumada I", "Joumada II", "Rajab", "Chaabane", "Ramadan", "Chawwal", "Dhou al qi'da", "Dhou al-hijja"],
}

function formatGregorianDate(dateStr: string, language: string): string {
  const [day, month, year] = dateStr.split(".")
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const locale = LANGUAGE_LOCALES[language] || "en-US"
  return date.toLocaleDateString(locale, { 
    weekday: "short", 
    day: "numeric", 
    month: "short" 
  })
}

function formatHijriDate(dateStr: string, language: string): string {
  const [day, month, year] = dateStr.split(".")
  const hijri = toHijri(parseInt(year), parseInt(month), parseInt(day))
  const months = HIJRI_MONTHS[language] || HIJRI_MONTHS.en
  return `${hijri.hd} ${months[hijri.hm - 1]} ${hijri.hy}`
}

function isToday(dateStr: string): boolean {
  const [day, month, year] = dateStr.split(".")
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function getDayNumber(dateStr: string): string {
  const [day] = dateStr.split(".")
  return day
}

function getWeekday(dateStr: string, language: string): string {
  const [day, month, year] = dateStr.split(".")
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const locale = LANGUAGE_LOCALES[language] || "en-US"
  return date.toLocaleDateString(locale, { weekday: "short" })
}

function getMonthYear(dateStr: string, language: string, calendarType: "gregorian" | "hijri"): string {
  const [day, month, year] = dateStr.split(".")
  if (calendarType === "hijri") {
    const hijri = toHijri(parseInt(year), parseInt(month), parseInt(day))
    const months = HIJRI_MONTHS[language] || HIJRI_MONTHS.en
    return `${months[hijri.hm - 1]} ${hijri.hy}`
  }
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const locale = LANGUAGE_LOCALES[language] || "en-US"
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" })
}

function getMonthKey(dateStr: string, calendarType: "gregorian" | "hijri"): string {
  const [day, month, year] = dateStr.split(".")
  if (calendarType === "hijri") {
    const hijri = toHijri(parseInt(year), parseInt(month), parseInt(day))
    return `${hijri.hy}-${hijri.hm}`
  }
  return `${year}-${month}`
}

type CalendarType = "gregorian" | "hijri"

export function MonthlyPrayerTimes() {
  const { t, language } = useLanguage()
  const { currentLocation } = useLocation()
  const { setOpenMobile } = useSidebar()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<DiyanetPrayerTime[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [calendarType, setCalendarType] = React.useState<CalendarType>("gregorian")
  const todayRef = React.useRef<HTMLDivElement>(null)

  const formatDate = React.useCallback((dateStr: string) => {
    return calendarType === "hijri" 
      ? formatHijriDate(dateStr, language)
      : formatGregorianDate(dateStr, language)
  }, [calendarType, language])

  React.useEffect(() => {
    if (open) {
      setLoading(true)
      setError(null)
      fetchMonthlyPrayerTimes(currentLocation)
        .then((result) => {
          setData(result)
          setLoading(false)
        })
        .catch(() => {
          setError("Failed to load prayer times")
          setLoading(false)
        })
    }
  }, [open, currentLocation])

  React.useEffect(() => {
    if (open && !loading && data.length > 0 && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [open, loading, data])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 sm:h-8 gap-1.5 text-muted-foreground hover:text-foreground touch-manipulation px-2 sm:px-3"
        onClick={() => {
          setOpenMobile(false)
          setOpen(true)
        }}
      >
        <HugeiconsIcon icon={Calendar03Icon} size={16} />
        <span className="text-sm font-medium">{t.ui.calendar}</span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background flex flex-col safe-area"
          >
            <div className="flex flex-col px-4 md:px-8 py-3 md:py-4 border-b border-border shrink-0 gap-3 max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-semibold">{t.ui.monthlyPrayerTimes}</span>
                  <span className="text-sm text-muted-foreground">{currentLocation.city}, {currentLocation.country}</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground touch-manipulation rounded-full hover:bg-muted/50"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </button>
              </div>
              
              <div className="flex rounded-lg bg-muted p-1 gap-1 max-w-xs">
                <button
                  onClick={() => setCalendarType("gregorian")}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors touch-manipulation",
                    calendarType === "gregorian" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.ui.gregorian}
                </button>
                <button
                  onClick={() => setCalendarType("hijri")}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors touch-manipulation",
                    calendarType === "hijri" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.ui.hijri}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full p-8 text-center text-destructive">
                  {error}
                </div>
              ) : (
                <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
                  <div className="hidden md:block">
                    <div className="grid grid-cols-7 gap-2 mb-4 px-2">
                      <div className="text-sm font-medium text-muted-foreground">{t.ui.date}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Fajr}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Sunrise}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Dhuhr}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Asr}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Maghrib}</div>
                      <div className="text-sm font-medium text-muted-foreground text-center">{t.prayerNames.Isha}</div>
                    </div>
                    <div className="space-y-2">
                      {data.map((day, index) => {
                        const isTodayRow = isToday(day.MiladiTarihKisa)
                        const currentMonthKey = getMonthKey(day.MiladiTarihKisa, calendarType)
                        const prevMonthKey = index > 0 ? getMonthKey(data[index - 1].MiladiTarihKisa, calendarType) : null
                        const showMonthDivider = index === 0 || currentMonthKey !== prevMonthKey
                        
                        return (
                          <React.Fragment key={day.MiladiTarihKisa}>
                            {showMonthDivider && (
                              <div className="flex items-center gap-3 py-3 mt-2 first:mt-0">
                                <div className="h-px flex-1 bg-border" />
                                <span className="text-sm font-semibold text-foreground px-2">
                                  {getMonthYear(day.MiladiTarihKisa, language, calendarType)}
                                </span>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                            )}
                            <div
                              ref={isTodayRow ? todayRef : undefined}
                              className={cn(
                                "grid grid-cols-7 gap-2 items-center p-3 rounded-xl transition-colors",
                                isTodayRow 
                                  ? "bg-primary/15 ring-1 ring-primary/30" 
                                  : "bg-muted/30 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg",
                                  isTodayRow ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                  <span className="text-lg font-bold leading-none">{getDayNumber(day.MiladiTarihKisa)}</span>
                                  <span className="text-[10px] uppercase opacity-80">{getWeekday(day.MiladiTarihKisa, language)}</span>
                                </div>
                                {isTodayRow && (
                                  <span className="text-xs font-medium text-primary">{t.ui.today}</span>
                                )}
                              </div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Imsak}</div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Gunes}</div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Ogle}</div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Ikindi}</div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Aksam}</div>
                              <div className={cn("text-center text-base tabular-nums", isTodayRow && "font-semibold")}>{day.Yatsi}</div>
                            </div>
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>

                  <div className="md:hidden space-y-3">
                    {data.map((day, index) => {
                      const isTodayRow = isToday(day.MiladiTarihKisa)
                      const currentMonthKey = getMonthKey(day.MiladiTarihKisa, calendarType)
                      const prevMonthKey = index > 0 ? getMonthKey(data[index - 1].MiladiTarihKisa, calendarType) : null
                      const showMonthDivider = index === 0 || currentMonthKey !== prevMonthKey
                      
                      return (
                        <React.Fragment key={day.MiladiTarihKisa}>
                          {showMonthDivider && (
                            <div className="flex items-center gap-3 py-2 mt-2 first:mt-0">
                              <div className="h-px flex-1 bg-border" />
                              <span className="text-sm font-semibold text-foreground px-2">
                                {getMonthYear(day.MiladiTarihKisa, language, calendarType)}
                              </span>
                              <div className="h-px flex-1 bg-border" />
                            </div>
                          )}
                          <div
                            ref={isTodayRow ? todayRef : undefined}
                            className={cn(
                              "rounded-xl p-4 transition-colors",
                              isTodayRow 
                                ? "bg-primary/15 ring-1 ring-primary/30" 
                                : "bg-muted/30"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                              <div className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-lg",
                                isTodayRow ? "bg-primary text-primary-foreground" : "bg-muted"
                              )}>
                                <span className="text-lg font-bold leading-none">{getDayNumber(day.MiladiTarihKisa)}</span>
                                <span className="text-[10px] uppercase opacity-80">{getWeekday(day.MiladiTarihKisa, language)}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className={cn("font-medium", isTodayRow && "text-primary")}>
                                  {formatDate(day.MiladiTarihKisa)}
                                </span>
                                {isTodayRow && (
                                  <span className="text-xs text-primary">{t.ui.today}</span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Fajr}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Imsak}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Sunrise}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Gunes}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Dhuhr}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Ogle}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Asr}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Ikindi}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Maghrib}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Aksam}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-muted-foreground text-xs">{t.prayerNames.Isha}</span>
                                <span className={cn("tabular-nums", isTodayRow && "font-semibold")}>{day.Yatsi}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
