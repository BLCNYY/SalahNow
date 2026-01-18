"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-store"
import { useLocation } from "@/lib/store"
import { useSettings } from "@/lib/settings-store"
import { findNearestLocation } from "@/lib/types"
import { PrayerSource } from "@/lib/prayer-source"
import { cn } from "@/lib/utils"

export function SettingsPanel() {
  const { t } = useLanguage()
  const { favorites, currentLocation, setLocation } = useLocation()
  const { prayerSource, setPrayerSource } = useSettings()
  const [expanded, setExpanded] = React.useState(false)
  const [locating, setLocating] = React.useState(false)
  const [candidate, setCandidate] = React.useState<typeof currentLocation | null>(null)
  const [locationError, setLocationError] = React.useState<string | null>(null)

  const isTurkey = currentLocation.countryCode.toUpperCase() === "TR"

  const handleLocationSelect = (location: typeof currentLocation) => {
    setLocation(location)
    setExpanded(false)
    setCandidate(null)
    setLocationError(null)
  }

  const requestCurrentLocation = () => {
    setLocationError(null)
    setCandidate(null)

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setLocationError(t.ui.locationUnavailable)
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestLocation(position.coords.latitude, position.coords.longitude)
        setCandidate(nearest)
        setLocating(false)
      },
      () => {
        setLocationError(t.ui.locationPermissionDenied)
        setLocating(false)
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }

  const handleConfirmLocation = () => {
    if (!candidate) return
    handleLocationSelect(candidate)
  }

  const handlePrayerSourceChange = (source: PrayerSource) => {
    setPrayerSource(source)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{t.ui.defaultLanguage}</span>
          <span className="text-xs text-muted-foreground">{t.ui.defaultLanguageDescription}</span>
        </div>
        <LanguageSelector />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{t.ui.defaultLocation}</span>
            <span className="text-xs text-muted-foreground">{currentLocation.city}, {currentLocation.country}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-border/70 bg-background shadow-xs hover:bg-muted"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? t.ui.close : t.ui.update}
          </Button>
        </div>

        {expanded && (
          <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.ui.starredLocations}</span>
              {favorites.length === 0 ? (
                <span className="text-xs text-muted-foreground">{t.ui.noSavedLocations}</span>
              ) : (
                <div className="flex flex-col gap-2">
                  {favorites.map((location) => (
                    <button
                      key={`${location.city}-${location.countryCode}`}
                      onClick={() => handleLocationSelect(location)}
                      className={cn(
                        "flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors",
                        currentLocation.city === location.city && currentLocation.countryCode === location.countryCode
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{location.city}, {location.country}</span>
                      {currentLocation.city === location.city && currentLocation.countryCode === location.countryCode && (
                        <span className="text-xs font-semibold">{t.ui.selected}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.ui.useCurrentLocation}</span>
              <Button size="sm" variant="secondary" onClick={requestCurrentLocation} disabled={locating}>
                {locating ? t.ui.checkingLocation : t.ui.requestLocation}
              </Button>
              {locationError ? (
                <span className="text-xs text-destructive">{locationError}</span>
              ) : null}
              {candidate ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background px-3 py-2">
                  <span className="text-xs text-muted-foreground">{candidate.city}, {candidate.country}</span>
                  <Button size="sm" onClick={handleConfirmLocation}>
                    {t.ui.saveDefaultLocation}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {isTurkey && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.ui.advanced}</span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">{t.ui.prayerSource}</span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handlePrayerSourceChange("diyanet")}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  prayerSource === "diyanet" ? "border-primary/60 bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{t.ui.prayerSourceDiyanet}</span>
                  {prayerSource === "diyanet" && <span className="text-xs font-semibold text-primary">{t.ui.selected}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{t.ui.prayerSourceDiyanetDescription}</p>
              </button>
              <button
                onClick={() => handlePrayerSourceChange("mwl")}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  prayerSource === "mwl" ? "border-primary/60 bg-primary/5" : "border-border hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{t.ui.prayerSourceMwl}</span>
                  {prayerSource === "mwl" && <span className="text-xs font-semibold text-primary">{t.ui.selected}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{t.ui.prayerSourceMwlDescription}</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
