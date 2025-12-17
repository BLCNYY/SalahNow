"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Globe02Icon, Location01Icon, StarIcon, Loading03Icon } from "@hugeicons/core-free-icons"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MobileSelect } from "@/components/mobile-select"
import { LanguageSelector } from "@/components/language-selector"
import { MonthlyPrayerTimes } from "@/components/monthly-prayer-times"
import { cn } from "@/lib/utils"
import { LocationProvider, useLocation } from "@/lib/store"
import { LanguageProvider, useLanguage } from "@/lib/language-store"
import { COUNTRIES_LIST, getCitiesByCountry, PrayerName } from "@/lib/types"
import { getCountdownText } from "@/lib/i18n"
import { usePrayerTimes } from "@/hooks/use-prayer-times"
import { useIsMobile } from "@/hooks/use-mobile"

function PrayerTimesDisplay() {
  const { currentLocation, setLocation, isFavorite, toggleFavorite, detectedCountryCode } = useLocation()
  const { loading, error, countdown, nextPrayer, prayerList } = usePrayerTimes(currentLocation)
  const { t, initializeFromCountry, language } = useLanguage()
  const isMobile = useIsMobile()

  const [selectedCountry, setSelectedCountry] = React.useState(currentLocation.countryCode)
  const cities = React.useMemo(() => getCitiesByCountry(selectedCountry), [selectedCountry])

  const countryOptions = React.useMemo(() => 
    COUNTRIES_LIST.map((c) => ({ value: c.countryCode, label: c.country })),
    []
  )

  const cityOptions = React.useMemo(() => 
    cities.map((c) => ({ value: c.city, label: c.city })),
    [cities]
  )

  React.useEffect(() => {
    setSelectedCountry(currentLocation.countryCode)
  }, [currentLocation.countryCode])

  React.useEffect(() => {
    if (detectedCountryCode) {
      initializeFromCountry(detectedCountryCode)
    }
  }, [detectedCountryCode, initializeFromCountry])

  const translatedNextPrayer = t.prayerNames[nextPrayer as PrayerName] || nextPrayer
  
  const countdownText = React.useMemo(() => {
    return getCountdownText(language, translatedNextPrayer)
  }, [language, translatedNextPrayer])

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    const newCities = getCitiesByCountry(countryCode)
    if (newCities.length > 0) {
      setLocation(newCities[0])
    }
  }

  const handleCityChange = (city: string) => {
    const location = cities.find((c) => c.city === city)
    if (location) {
      setLocation(location)
    }
  }

  const currentIsFavorite = isFavorite(currentLocation)

  return (
    <>
      <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-transparent px-3 sm:px-4 safe-top transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors touch-manipulation" />
          <MonthlyPrayerTimes />
          <Separator orientation="vertical" className="ml-1 mr-2 h-4 bg-border/40 hidden sm:block" />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-4">
          {isMobile ? (
            <>
              <MobileSelect
                value={selectedCountry}
                onValueChange={handleCountryChange}
                options={countryOptions}
                placeholder={t.ui.country}
                title={t.ui.selectCountry}
                icon={<HugeiconsIcon icon={Globe02Icon} size={16} className="shrink-0" />}
              />
              <MobileSelect
                value={currentLocation.city}
                onValueChange={handleCityChange}
                options={cityOptions}
                placeholder={t.ui.city}
                title={t.ui.selectCity}
                icon={<HugeiconsIcon icon={Location01Icon} size={16} className="shrink-0" />}
              />
            </>
          ) : (
            <>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none hover:bg-accent/50 focus:ring-0 text-muted-foreground hover:text-foreground h-8 text-sm touch-manipulation">
                  <div className="flex items-center gap-2 truncate">
                    <HugeiconsIcon icon={Globe02Icon} size={16} className="shrink-0" />
                    <SelectValue placeholder={t.ui.country} />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[50vh]">
                  {COUNTRIES_LIST.map((c) => (
                    <SelectItem key={c.countryCode} value={c.countryCode}>
                      {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={currentLocation.city} onValueChange={handleCityChange}>
                <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none hover:bg-accent/50 focus:ring-0 text-muted-foreground hover:text-foreground h-8 text-sm touch-manipulation">
                  <div className="flex items-center gap-2 truncate">
                    <HugeiconsIcon icon={Location01Icon} size={16} className="shrink-0" />
                    <SelectValue placeholder={t.ui.city} />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[50vh]">
                  {cities.map((c) => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-9 sm:size-8 hover:bg-transparent touch-manipulation active:scale-95 transition-transform",
              currentIsFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => toggleFavorite(currentLocation)}
          >
<HugeiconsIcon 
                              icon={StarIcon} 
                              size={20}
                              className={cn(
                                "transition-all duration-300",
                                currentIsFavorite && "fill-current"
                              )}
                            />
            <span className="sr-only">Favorite Location</span>
          </Button>

          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-0 gap-6 sm:gap-12">
        <div className="flex flex-col items-center justify-center p-4 w-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-muted-foreground" />
                <span className="text-muted-foreground text-sm">{t.ui.loading}</span>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <span className="text-destructive text-sm">{error}</span>
              </motion.div>
            ) : (
              <motion.div
                key={`${currentLocation.city}-${currentLocation.countryCode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-2 sm:space-y-1 w-full px-4"
              >
                <div className="text-muted-foreground text-xl sm:text-sm tracking-widest uppercase">
                  <span>{countdownText}</span>
                </div>

                <div className="relative">
                  <h1 className="text-[15vw] sm:text-[10vw] md:text-[8vw] font-bold leading-none tracking-tighter text-foreground tabular-nums select-none">
                    {countdown}
                  </h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 w-full px-6 sm:px-8 pb-6 sm:pb-8 pt-4 z-10 safe-bottom">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-12 md:gap-16 pb-2">
              {prayerList.map((prayer) => (
                <div 
                  key={prayer.name} 
                  className={cn(
                    "flex items-center justify-between sm:flex-col sm:items-center gap-2 sm:gap-1.5 sm:min-w-[70px] transition-all duration-300 select-none cursor-default group touch-manipulation py-1 sm:py-0",
                    prayer.isActive ? "opacity-100" : "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-1.5">
                    {prayer.isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="w-2 h-2 sm:hidden rounded-full bg-primary shrink-0"
                      />
                    )}
                    <span className={cn(
                      "text-xl sm:text-xs tracking-wide sm:tracking-widest uppercase font-semibold sm:font-medium",
                      prayer.isActive ? "text-primary" : "text-foreground/50"
                    )}>
                      {t.prayerNames[prayer.name as PrayerName] || prayer.name}
                    </span>
                    {prayer.isActive && (
                      <motion.div 
                        layoutId="activeIndicatorDesktop"
                        className="hidden sm:block w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-2xl sm:text-base font-bold sm:font-medium tracking-tight tabular-nums",
                    prayer.isActive ? "text-foreground" : "text-foreground/60"
                  )}>
                    {prayer.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <LocationProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-background overflow-hidden flex flex-col h-[100dvh]">
            <PrayerTimesDisplay />
          </SidebarInset>
        </SidebarProvider>
      </LocationProvider>
    </LanguageProvider>
  )
}
