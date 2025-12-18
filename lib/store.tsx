"use client"

import * as React from "react"
import { Location, DEFAULT_LOCATION, findNearestLocation } from "./types"

const FAVORITES_KEY = "salahnow-favorites"

export interface LocationState {
  currentLocation: Location
  favorites: Location[]
  detectedCountryCode: string | null
  setLocation: (location: Location) => void
  addFavorite: (location: Location) => void
  removeFavorite: (location: Location) => void
  isFavorite: (location: Location) => boolean
  toggleFavorite: (location: Location) => void
}

const LocationContext = React.createContext<LocationState | null>(null)

export function useLocation() {
  const context = React.useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}

function loadFavorites(): Location[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: Location[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {
    console.error("Failed to save favorites")
  }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = React.useState<Location>(DEFAULT_LOCATION)
  const [favorites, setFavorites] = React.useState<Location[]>([])
  const [detectedCountryCode, setDetectedCountryCode] = React.useState<string | null>(null)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    const loaded = loadFavorites()
    setFavorites(loaded)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearest = findNearestLocation(position.coords.latitude, position.coords.longitude)
          setCurrentLocation(nearest)
          setDetectedCountryCode(nearest.countryCode)
          setIsHydrated(true)
        },
        () => {
          setIsHydrated(true)
        },
        { timeout: 10000, maximumAge: 300000 }
      )
    } else {
    setIsHydrated(true)
    }
  }, [])

  const setLocation = React.useCallback((location: Location) => {
    setCurrentLocation(location)
  }, [])

  const addFavorite = React.useCallback((location: Location) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.city === location.city && f.countryCode === location.countryCode
      )
      if (exists) return prev
      const newFavorites = [...prev, location]
      saveFavorites(newFavorites)
      return newFavorites
    })
  }, [])

  const removeFavorite = React.useCallback((location: Location) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter(
        (f) => !(f.city === location.city && f.countryCode === location.countryCode)
      )
      saveFavorites(newFavorites)
      return newFavorites
    })
  }, [])

  const isFavorite = React.useCallback(
    (location: Location) => {
      return favorites.some(
        (f) => f.city === location.city && f.countryCode === location.countryCode
      )
    },
    [favorites]
  )

  const toggleFavorite = React.useCallback(
    (location: Location) => {
      if (isFavorite(location)) {
        removeFavorite(location)
      } else {
        addFavorite(location)
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  )

  const value = React.useMemo(
    () => ({
      currentLocation,
      favorites,
      detectedCountryCode,
      setLocation,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
    }),
    [currentLocation, favorites, detectedCountryCode, setLocation, addFavorite, removeFavorite, isFavorite, toggleFavorite]
  )

  if (!isHydrated) {
    return null
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

