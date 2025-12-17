"use client"

import * as React from "react"
import { 
  Language, 
  translations, 
  detectSystemLanguage, 
  getLanguageFromCountry,
  SUPPORTED_LANGUAGES 
} from "./i18n"

const LANGUAGE_KEY = "waqt-language"

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations["en"]
  initializeFromCountry: (countryCode: string) => void
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

function loadSavedLanguage(): Language | null {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY)
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language
    }
    return null
  } catch {
    return null
  }
}

function saveLanguage(lang: Language) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LANGUAGE_KEY, lang)
  } catch {
    console.error("Failed to save language")
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("en")
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    const saved = loadSavedLanguage()
    if (saved) {
      setLanguageState(saved)
    } else {
      const systemLang = detectSystemLanguage()
      setLanguageState(systemLang)
    }
    setInitialized(true)
  }, [])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    saveLanguage(lang)
  }, [])

  const initializeFromCountry = React.useCallback((countryCode: string) => {
    const saved = loadSavedLanguage()
    if (!saved) {
      const countryLang = getLanguageFromCountry(countryCode)
      setLanguageState(countryLang)
    }
  }, [])

  const t = translations[language]

  const value = React.useMemo(
    () => ({ language, setLanguage, t, initializeFromCountry }),
    [language, setLanguage, t, initializeFromCountry]
  )

  if (!initialized) {
    return null
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
