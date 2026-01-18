"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddCircleIcon, Cancel01Icon, Location01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-store"
import { useLocation } from "@/lib/store"
import { fetchPrayerTimes } from "@/lib/api"
import { Location, getNearestLocations } from "@/lib/types"

const DEFAULT_COUNTRY_CODE = "XX"

type FormState = {
  city: string
  country: string
  countryCode: string
  lat: string
  lon: string
}

export function CustomLocationModal() {
  const { t } = useLanguage()
  const { addFavorite, setLocation, currentLocation } = useLocation()
  const [open, setOpen] = React.useState(false)
  const [advancedOpen, setAdvancedOpen] = React.useState(false)
  const [method, setMethod] = React.useState<"search" | "manual">("search")
  const [form, setForm] = React.useState<FormState>({
    city: "",
    country: "",
    countryCode: "",
    lat: "",
    lon: "",
  })
  const [address, setAddress] = React.useState("")
  const [addressStatus, setAddressStatus] = React.useState<"idle" | "finding">("idle")
  const [addressError, setAddressError] = React.useState<string | null>(null)
  const [addressResults, setAddressResults] = React.useState<
    Array<{
      display_name: string
      lat: string
      lon: string
      address?: {
        city?: string
        town?: string
        village?: string
        municipality?: string
        state?: string
        country?: string
        country_code?: string
      }
    }>
  >([])
  const [status, setStatus] = React.useState<"idle" | "checking" | "ready" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<Location[]>([])
  const [candidate, setCandidate] = React.useState<Location | null>(null)

  const handleOpen = () => {
    setOpen(true)
    setAdvancedOpen(false)
    setMethod("search")
    setAddress("")
    setAddressStatus("idle")
    setAddressError(null)
    setStatus("idle")
    setErrorMessage(null)
    setSuggestions([])
    setCandidate(null)
    setForm({
      city: "",
      country: currentLocation.country,
      countryCode: currentLocation.countryCode,
      lat: currentLocation.lat.toString(),
      lon: currentLocation.lon.toString(),
    })
  }

  const handleClose = () => {
    setOpen(false)
    setStatus("idle")
    setErrorMessage(null)
    setSuggestions([])
    setCandidate(null)
    setAddress("")
    setAddressStatus("idle")
    setAddressError(null)
  }

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const inputClassName = "border-white/50 focus-visible:border-white/70 focus-visible:ring-white/30"

  const applyAddressResult = (result: {
    display_name: string
    lat: string
    lon: string
    address?: {
      city?: string
      town?: string
      village?: string
      municipality?: string
      state?: string
      country?: string
      country_code?: string
    }
  }) => {
    const cityName =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.municipality ||
      result.address?.state ||
      ""
    const countryName = result.address?.country || form.country
    const countryCode = result.address?.country_code
      ? result.address.country_code.toUpperCase()
      : form.countryCode
    setForm((prev) => ({
      ...prev,
      city: prev.city || cityName,
      country: countryName,
      countryCode,
      lat: result.lat,
      lon: result.lon,
    }))
  }

  const buildLocation = (): Location | null => {
    const lat = Number(form.lat)
    const lon = Number(form.lon)
    if (!form.city.trim() || !form.country.trim() || Number.isNaN(lat) || Number.isNaN(lon)) {
      setErrorMessage(t.ui.customLocationInvalid)
      setStatus("error")
      return null
    }
    const countryCode = form.countryCode.trim() || DEFAULT_COUNTRY_CODE
    const location: Location = {
      city: form.city.trim(),
      country: form.country.trim(),
      countryCode,
      lat,
      lon,
    }
    return location
  }

  const handleCheck = async () => {
    setAddressError(null)
    setErrorMessage(null)
    setStatus("checking")
    const location = buildLocation()
    if (!location) return
    try {
      await fetchPrayerTimes(location)
      setCandidate(location)
      setStatus("ready")
    } catch {
      const nearby = getNearestLocations(location.lat, location.lon, 3)
      setSuggestions(nearby)
      setErrorMessage(t.ui.customLocationUnavailable)
      setStatus("error")
    }
  }

  const handleAddressSearch = async () => {
    const query = address.trim()
    if (!query) {
      setAddressError(t.ui.addressNotFound)
      return
    }
    setAddressError(null)
    setAddressStatus("finding")
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`
      )
      if (!response.ok) {
        setAddressError(t.ui.addressNotFound)
        setAddressStatus("idle")
        return
      }
      const data = (await response.json()) as Array<{
        display_name: string
        lat: string
        lon: string
        address?: {
          city?: string
          town?: string
          village?: string
          municipality?: string
          state?: string
          country?: string
          country_code?: string
        }
      }>
      const result = data[0]
      if (!result) {
        setAddressError(t.ui.addressNotFound)
        setAddressStatus("idle")
        return
      }
      applyAddressResult(result)
      setAddressStatus("idle")
    } catch {
      setAddressError(t.ui.addressNotFound)
      setAddressStatus("idle")
    }
  }

  React.useEffect(() => {
    if (method !== "search") return
    const query = address.trim()
    if (!query) {
      setAddressResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`
        )
        if (!response.ok) {
          setAddressResults([])
          return
        }
        const data = (await response.json()) as Array<{
          display_name: string
          lat: string
          lon: string
          address?: {
            city?: string
            town?: string
            village?: string
            municipality?: string
            state?: string
            country?: string
            country_code?: string
          }
        }>
        setAddressResults(data)
      } catch {
        setAddressResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [address, method])

  const handleSave = () => {
    if (!candidate) return
    addFavorite(candidate)
    setLocation(candidate)
    handleClose()
  }

  const handleSuggestionSave = (location: Location) => {
    addFavorite(location)
    setLocation(location)
    handleClose()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
        onClick={handleOpen}
      >
        <HugeiconsIcon icon={AddCircleIcon} size={16} className="mr-1.5" />
        <span>{t.ui.addCustomLocation}</span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <button
                  onClick={handleClose}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground touch-manipulation"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </button>
                <div>
                  <div className="text-lg font-semibold">{t.ui.customLocationTitle}</div>
                  <div className="text-xs text-muted-foreground">{t.ui.customLocationSubtitle}</div>
                </div>
              </div>

              <div className="px-4 py-4 space-y-4">
                <div className="flex items-center rounded-full border border-border bg-muted/30 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setMethod("search")}
                    className={`flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors ${method === "search" ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/40" : "text-muted-foreground"}`}
                  >
                    {t.ui.searchMethod}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("manual")}
                    className={`flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors ${method === "manual" ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/40" : "text-muted-foreground"}`}
                  >
                    {t.ui.manualMethod}
                  </button>
                </div>

                {method === "search" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {t.ui.address}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder={t.ui.addressPlaceholder}
                        className={inputClassName}
                      />
                      <Button
                        variant="secondary"
                        onClick={handleAddressSearch}
                        disabled={addressStatus === "finding"}
                        className="sm:w-40"
                      >
                        {addressStatus === "finding" ? t.ui.findingAddress : t.ui.findAddress}
                      </Button>
                    </div>
                    {addressError && (
                      <div className="text-xs text-destructive">{addressError}</div>
                    )}
                    {addressResults.length > 0 && (
                      <div className="rounded-xl border border-border bg-background shadow-sm">
                        <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                          {t.ui.addressSuggestions}
                        </div>
                        <div className="divide-y divide-border/70">
                          {addressResults.map((result) => (
                            <button
                              key={`${result.display_name}-${result.lat}-${result.lon}`}
                              type="button"
                              onClick={() => {
                                setAddress(result.display_name)
                                applyAddressResult(result)
                                setAddressResults([])
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted/40 transition-colors"
                            >
                              {result.display_name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {method === "manual" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {t.ui.locationName}
                      </label>
                      <Input
                        value={form.city}
                        onChange={updateField("city")}
                        placeholder={t.ui.locationNamePlaceholder}
                        className={inputClassName}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {t.ui.country}
                        </label>
                        <Input
                          value={form.country}
                          onChange={updateField("country")}
                          placeholder={t.ui.countryPlaceholder}
                          className={inputClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {t.ui.countryCodeLabel}
                        </label>
                        <Input
                          value={form.countryCode}
                          onChange={updateField("countryCode")}
                          placeholder={t.ui.countryCodePlaceholder}
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAdvancedOpen((prev) => !prev)}
                      className="text-xs font-semibold text-primary uppercase tracking-wide"
                    >
                      {t.ui.advanced}
                    </button>

                    {advancedOpen && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {t.ui.latitude}
                          </label>
                          <Input
                            value={form.lat}
                            onChange={updateField("lat")}
                            placeholder="41.0082"
                            className={inputClassName}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {t.ui.longitude}
                          </label>
                          <Input
                            value={form.lon}
                            onChange={updateField("lon")}
                            placeholder="28.9784"
                            className={inputClassName}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center gap-3">
                  <Button onClick={handleCheck} disabled={status === "checking"} className="flex-1">
                    {status === "checking" ? t.ui.checkingLocation : t.ui.checkLocation}
                  </Button>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    {t.ui.close}
                  </Button>
                </div>

                {errorMessage && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive space-y-2">
                    <div>{errorMessage}</div>
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-wide text-destructive/80">
                          {t.ui.nearbyLocations}
                        </div>
                        <div className="grid gap-2">
                          {suggestions.map((location) => (
                            <button
                              key={`${location.city}-${location.countryCode}`}
                              onClick={() => handleSuggestionSave(location)}
                              className="flex items-center justify-between rounded-lg border border-destructive/40 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                            >
                              <span>{location.city}, {location.country}</span>
                              <HugeiconsIcon icon={Location01Icon} size={16} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {candidate && status === "ready" && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 space-y-3">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Location01Icon} size={18} />
                      <span className="font-semibold">{candidate.city}, {candidate.country}</span>
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      {t.ui.saveLocation}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
