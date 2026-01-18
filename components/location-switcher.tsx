"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Location01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { useLocation } from "@/lib/store"
import { useLanguage } from "@/lib/language-store"
import { COUNTRIES } from "@/lib/types"
import { CustomLocationModal } from "@/components/custom-location-modal"
import { cn } from "@/lib/utils"

export function LocationSwitcher() {
  const { currentLocation, setLocation, customLocations } = useLocation()
  const { t } = useLanguage()
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<"locations" | "custom">("locations")
  const [search, setSearch] = React.useState("")

  const filteredLocations = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return COUNTRIES
    return COUNTRIES.filter((loc) =>
      `${loc.city} ${loc.country}`.toLowerCase().includes(query)
    )
  }, [search])

  const filteredCustom = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return customLocations
    return customLocations.filter((loc) =>
      `${loc.city} ${loc.country} ${loc.addressLabel ?? ""}`.toLowerCase().includes(query)
    )
  }, [customLocations, search])

  const handleOpen = () => {
    setOpen(true)
    setTab("locations")
    setSearch("")
  }

  const handleClose = () => {
    setOpen(false)
    setSearch("")
  }

  const handleSelect = (location: typeof currentLocation) => {
    setLocation(location)
    handleClose()
  }

  const formatCustomLocationLabel = (location: typeof currentLocation) => {
    if (location.addressLabel) return location.city
    return `${location.city}, ${location.country}`
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 h-9 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation truncate"
      >
        <HugeiconsIcon icon={Location01Icon} size={16} className="shrink-0" />
        <span className="truncate">{formatCustomLocationLabel(currentLocation)}</span>
      </button>

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
                <div className="text-lg font-semibold">{t.ui.location}</div>
              </div>

              <div className="px-4 pt-4 space-y-3">
                <div className="flex items-center rounded-full border border-border bg-muted/30 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setTab("locations")}
                    className={cn(
                      "flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors",
                      tab === "locations"
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/40"
                        : "text-muted-foreground"
                    )}
                  >
                    {t.ui.locationsTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("custom")}
                    className={cn(
                      "flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors",
                      tab === "custom"
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary/40"
                        : "text-muted-foreground"
                    )}
                  >
                    {t.ui.customLocationsTab}
                  </button>
                </div>

                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t.ui.search}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-white/50 bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="px-4 py-3 max-h-[50vh] overflow-y-auto overscroll-contain">
                {tab === "locations" ? (
                  <div className="space-y-2">
                    {filteredLocations.map((loc) => (
                      <button
                        key={`${loc.city}-${loc.countryCode}`}
                        onClick={() => handleSelect(loc)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl border border-border px-3 py-2 text-left text-sm hover:bg-muted/40 transition-colors",
                          loc.city === currentLocation.city && loc.countryCode === currentLocation.countryCode
                            ? "border-primary/40 bg-primary/10"
                            : ""
                        )}
                      >
                        <span className="truncate">{loc.city}, {loc.country}</span>
                        {loc.city === currentLocation.city && loc.countryCode === currentLocation.countryCode ? (
                          <span className="text-xs text-primary">{t.ui.selected}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <CustomLocationModal
                      triggerLabel={t.ui.addCustomLocationAction}
                      triggerClassName="w-full justify-center h-9 rounded-xl border border-dashed border-primary/40 text-primary hover:text-primary"
                    />
                    {filteredCustom.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        {t.ui.noCustomLocations}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredCustom.map((loc) => (
                          <button
                            key={`${loc.city}-${loc.countryCode}-${loc.lat}-${loc.lon}`}
                            onClick={() => handleSelect(loc)}
                            className={cn(
                              "w-full flex items-center justify-between rounded-xl border border-border px-3 py-2 text-left text-sm hover:bg-muted/40 transition-colors",
                              loc.city === currentLocation.city && loc.countryCode === currentLocation.countryCode && loc.lat === currentLocation.lat && loc.lon === currentLocation.lon
                                ? "border-primary/40 bg-primary/10"
                                : ""
                            )}
                          >
                            <span className="flex flex-col">
                              <span className="truncate">{formatCustomLocationLabel(loc)}</span>
                              <span className="truncate text-xs text-muted-foreground">
                                {loc.addressLabel ?? loc.country}
                              </span>
                            </span>
                            {loc.city === currentLocation.city && loc.countryCode === currentLocation.countryCode && loc.lat === currentLocation.lat && loc.lon === currentLocation.lon ? (
                              <span className="text-xs text-primary">{t.ui.selected}</span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    )}
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
