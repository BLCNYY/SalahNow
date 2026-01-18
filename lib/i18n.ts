export const SUPPORTED_LANGUAGES = ["en", "tr", "ar", "de", "fr"] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  de: "Deutsch",
  fr: "Français",
}

export const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  TR: "tr",
  US: "en",
  GB: "en",
  DE: "de",
  FR: "fr",
  SA: "ar",
  AE: "ar",
  EG: "ar",
}

type TranslationKeys = {
  prayerNames: {
    Fajr: string
    Sunrise: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
  }
  ui: {
    in: string
    selectCountry: string
    selectCity: string
    search: string
    noResults: string
    savedLocations: string
    noSavedLocations: string
    clickStarToSave: string
    loading: string
    language: string
    country: string
    city: string
    monthlyPrayerTimes: string
    date: string
    today: string
    close: string
    notAvailable: string
    gregorian: string
    hijri: string
    calendar: string
    localTime: string
    location: string
    addCustomLocation: string
    customLocationTitle: string
    customLocationSubtitle: string
    locationName: string
    locationNamePlaceholder: string
    latitude: string
    longitude: string
    checkLocation: string
    checkingLocation: string
    saveLocation: string
    customLocationInvalid: string
    customLocationUnavailable: string
    nearbyLocations: string
    address: string
    addressPlaceholder: string
    findAddress: string
    findingAddress: string
    addressNotFound: string
    addressSuggestions: string
    searchingLocations: string
    locationsTab: string
    customLocationsTab: string
    addCustomLocationAction: string
    selected: string
    noCustomLocations: string
  }
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    prayerNames: {
      Fajr: "Fajr",
      Sunrise: "Sunrise",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
    },
    ui: {
      in: "in",
      selectCountry: "Select Country",
      selectCity: "Select City",
      search: "Search...",
      noResults: "No results found",
      savedLocations: "Starred Locations",
      noSavedLocations: "No starred locations yet.",
      clickStarToSave: "Click the star icon to star a location.",
      loading: "Loading prayer times...",
      language: "Language",
      country: "Country",
      city: "City",
      monthlyPrayerTimes: "Monthly Prayer Times",
      date: "Date",
      today: "Today",
      close: "Close",
      notAvailable: "Monthly view not available for this location",
      gregorian: "Gregorian",
      hijri: "Hijri",
      calendar: "Calendar",
      localTime: "Local Time",
      location: "Location",
      addCustomLocation: "Add Custom Location",
      customLocationTitle: "Custom Location",
      customLocationSubtitle: "Enter an address to check availability.",
      locationName: "Location Name",
      locationNamePlaceholder: "e.g. Downtown",
      latitude: "Latitude",
      longitude: "Longitude",
      checkLocation: "Check Location",
      checkingLocation: "Checking...",
      saveLocation: "Save Location",
      customLocationInvalid: "Please enter a valid name and address.",
      customLocationUnavailable: "Prayer times are not available for this location.",
      nearbyLocations: "Nearby available locations",
      address: "Exact Address",
      addressPlaceholder: "Type a full address",
      findAddress: "Find Address",
      findingAddress: "Finding...",
      addressNotFound: "Address could not be found.",
      addressSuggestions: "Suggested locations",
      searchingLocations: "Searching locations...",
      locationsTab: "Locations",
      customLocationsTab: "Custom Locations",
      addCustomLocationAction: "Add Custom Location",
      selected: "Selected",
      noCustomLocations: "No custom locations yet.",
    },
  },
  tr: {
    prayerNames: {
      Fajr: "İmsak",
      Sunrise: "Güneş",
      Dhuhr: "Öğle",
      Asr: "İkindi",
      Maghrib: "Akşam",
      Isha: "Yatsı",
    },
    ui: {
      in: "için",
      selectCountry: "Ülke Seç",
      selectCity: "Şehir Seç",
      search: "Ara...",
      noResults: "Sonuç bulunamadı",
      savedLocations: "Yıldızlanan Konumlar",
      noSavedLocations: "Henüz yıldızlanan konum yok.",
      clickStarToSave: "Yıldızlamak için yıldıza tıklayın.",
      loading: "Namaz vakitleri yükleniyor...",
      language: "Dil",
      country: "Ülke",
      city: "Şehir",
      monthlyPrayerTimes: "Aylık Namaz Vakitleri",
      date: "Tarih",
      today: "Bugün",
      close: "Kapat",
      notAvailable: "Bu konum için aylık görünüm mevcut değil",
      gregorian: "Miladi",
      hijri: "Hicri",
      calendar: "Takvim",
      localTime: "Yerel Saat",
      location: "Konum",
      addCustomLocation: "Özel Konum Ekle",
      customLocationTitle: "Özel Konum",
      customLocationSubtitle: "Uygunluğu kontrol etmek için adres girin.",
      locationName: "Konum Adı",
      locationNamePlaceholder: "Örn. Merkez",
      latitude: "Enlem",
      longitude: "Boylam",
      checkLocation: "Konumu Kontrol Et",
      checkingLocation: "Kontrol ediliyor...",
      saveLocation: "Konumu Kaydet",
      customLocationInvalid: "Geçerli bir ad ve adres girin.",
      customLocationUnavailable: "Bu konum için namaz vakitleri bulunamadı.",
      nearbyLocations: "Yakındaki kullanılabilir konumlar",
      address: "Açık Adres",
      addressPlaceholder: "Tam adres girin",
      findAddress: "Adres Bul",
      findingAddress: "Bulunuyor...",
      addressNotFound: "Adres bulunamadı.",
      addressSuggestions: "Önerilen konumlar",
      searchingLocations: "Konumlar aranıyor...",
      locationsTab: "Konumlar",
      customLocationsTab: "Özel Konumlar",
      addCustomLocationAction: "Özel Konum Ekle",
      selected: "Seçili",
      noCustomLocations: "Henüz özel konum yok.",
    },
  },
  ar: {
    prayerNames: {
      Fajr: "الفجر",
      Sunrise: "الشروق",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء",
    },
    ui: {
      in: "في",
      selectCountry: "اختر الدولة",
      selectCity: "اختر المدينة",
      search: "بحث...",
      noResults: "لا توجد نتائج",
      savedLocations: "المواقع المميزة",
      noSavedLocations: "لا توجد مواقع مميزة بعد.",
      clickStarToSave: "انقر على النجمة للتمييز.",
      loading: "جاري تحميل أوقات الصلاة...",
      language: "اللغة",
      country: "الدولة",
      city: "المدينة",
      monthlyPrayerTimes: "أوقات الصلاة الشهرية",
      date: "التاريخ",
      today: "اليوم",
      close: "إغلاق",
      notAvailable: "العرض الشهري غير متاح لهذا الموقع",
      gregorian: "ميلادي",
      hijri: "هجري",
      calendar: "التقويم",
      localTime: "الوقت المحلي",
      location: "الموقع",
      addCustomLocation: "إضافة موقع مخصص",
      customLocationTitle: "موقع مخصص",
      customLocationSubtitle: "أدخل عنوانًا للتحقق من التوفر.",
      locationName: "اسم الموقع",
      locationNamePlaceholder: "مثلاً: وسط المدينة",
      latitude: "خط العرض",
      longitude: "خط الطول",
      checkLocation: "تحقق من الموقع",
      checkingLocation: "جارٍ التحقق...",
      saveLocation: "حفظ الموقع",
      customLocationInvalid: "يرجى إدخال اسم وعنوان صالحين.",
      customLocationUnavailable: "أوقات الصلاة غير متاحة لهذا الموقع.",
      nearbyLocations: "مواقع قريبة متاحة",
      address: "العنوان الكامل",
      addressPlaceholder: "اكتب العنوان الكامل",
      findAddress: "ابحث عن العنوان",
      findingAddress: "جارٍ البحث...",
      addressNotFound: "تعذر العثور على العنوان.",
      addressSuggestions: "المواقع المقترحة",
      searchingLocations: "جارٍ البحث عن المواقع...",
      locationsTab: "المواقع",
      customLocationsTab: "مواقع مخصصة",
      addCustomLocationAction: "إضافة موقع مخصص",
      selected: "محدد",
      noCustomLocations: "لا توجد مواقع مخصصة بعد.",
    },
  },
  de: {
    prayerNames: {
      Fajr: "Fadschr",
      Sunrise: "Sonnenaufgang",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Ischa",
    },
    ui: {
      in: "in",
      selectCountry: "Land auswählen",
      selectCity: "Stadt auswählen",
      search: "Suchen...",
      noResults: "Keine Ergebnisse",
      savedLocations: "Markierte Orte",
      noSavedLocations: "Noch keine markierten Orte.",
      clickStarToSave: "Zum Markieren auf den Stern klicken.",
      loading: "Gebetszeiten werden geladen...",
      language: "Sprache",
      country: "Land",
      city: "Stadt",
      monthlyPrayerTimes: "Monatliche Gebetszeiten",
      date: "Datum",
      today: "Heute",
      close: "Schließen",
      notAvailable: "Monatsansicht für diesen Standort nicht verfügbar",
      gregorian: "Gregorianisch",
      hijri: "Hidschri",
      calendar: "Kalender",
      localTime: "Ortszeit",
      location: "Ort",
      addCustomLocation: "Benutzerdefinierten Ort hinzufügen",
      customLocationTitle: "Benutzerdefinierter Ort",
      customLocationSubtitle: "Adresse eingeben, um die Verfügbarkeit zu prüfen.",
      locationName: "Ortsname",
      locationNamePlaceholder: "z. B. Innenstadt",
      latitude: "Breitengrad",
      longitude: "Längengrad",
      checkLocation: "Ort prüfen",
      checkingLocation: "Wird geprüft...",
      saveLocation: "Ort speichern",
      customLocationInvalid: "Bitte einen gültigen Namen und eine Adresse eingeben.",
      customLocationUnavailable: "Gebetszeiten sind für diesen Ort nicht verfügbar.",
      nearbyLocations: "Nahegelegene verfügbare Orte",
      address: "Genaue Adresse",
      addressPlaceholder: "Genaue Adresse eingeben",
      findAddress: "Adresse suchen",
      findingAddress: "Suche läuft...",
      addressNotFound: "Adresse konnte nicht gefunden werden.",
      addressSuggestions: "Vorgeschlagene Orte",
      searchingLocations: "Orte werden gesucht...",
      locationsTab: "Orte",
      customLocationsTab: "Benutzerdefinierte Orte",
      addCustomLocationAction: "Benutzerdefinierten Ort hinzufügen",
      selected: "Ausgewählt",
      noCustomLocations: "Noch keine benutzerdefinierten Orte.",
    },
  },
  fr: {
    prayerNames: {
      Fajr: "Fajr",
      Sunrise: "Lever du soleil",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
    },
    ui: {
      in: "dans",
      selectCountry: "Choisir le pays",
      selectCity: "Choisir la ville",
      search: "Rechercher...",
      noResults: "Aucun résultat",
      savedLocations: "Lieux favoris",
      noSavedLocations: "Aucun lieu favori.",
      clickStarToSave: "Cliquez sur l'étoile pour ajouter aux favoris.",
      loading: "Chargement des horaires de prière...",
      language: "Langue",
      country: "Pays",
      city: "Ville",
      monthlyPrayerTimes: "Horaires de prière mensuels",
      date: "Date",
      today: "Aujourd'hui",
      close: "Fermer",
      notAvailable: "Vue mensuelle non disponible pour cet emplacement",
      gregorian: "Grégorien",
      hijri: "Hijri",
      calendar: "Calendrier",
      localTime: "Heure locale",
      location: "Lieu",
      addCustomLocation: "Ajouter un lieu personnalisé",
      customLocationTitle: "Lieu personnalisé",
      customLocationSubtitle: "Saisissez une adresse pour vérifier la disponibilité.",
      locationName: "Nom du lieu",
      locationNamePlaceholder: "Ex. Centre-ville",
      latitude: "Latitude",
      longitude: "Longitude",
      checkLocation: "Vérifier le lieu",
      checkingLocation: "Vérification...",
      saveLocation: "Enregistrer le lieu",
      customLocationInvalid: "Veuillez saisir un nom et une adresse valides.",
      customLocationUnavailable: "Les horaires de prière ne sont pas disponibles pour ce lieu.",
      nearbyLocations: "Lieux disponibles à proximité",
      address: "Adresse exacte",
      addressPlaceholder: "Saisissez une adresse complète",
      findAddress: "Rechercher",
      findingAddress: "Recherche...",
      addressNotFound: "Adresse introuvable.",
      addressSuggestions: "Lieux suggérés",
      searchingLocations: "Recherche des lieux...",
      locationsTab: "Lieux",
      customLocationsTab: "Lieux personnalisés",
      addCustomLocationAction: "Ajouter un lieu personnalisé",
      selected: "Sélectionné",
      noCustomLocations: "Aucun lieu personnalisé pour le moment.",
    },
  },
}

export function detectSystemLanguage(): Language {
  if (typeof navigator === "undefined") return "en"
  
  const browserLang = navigator.language.split("-")[0].toLowerCase()
  
  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language
  }
  
  return "en"
}

export function getLanguageFromCountry(countryCode: string): Language {
  return COUNTRY_TO_LANGUAGE[countryCode] || "en"
}

function getLastVowel(word: string): string | null {
  const vowels = "aeıioöuüAEIİOÖUÜ"
  for (let i = word.length - 1; i >= 0; i--) {
    if (vowels.includes(word[i])) {
      return word[i].toLowerCase()
    }
  }
  return null
}

function isBackVowel(vowel: string): boolean {
  return "aıou".includes(vowel)
}

function endsWithVowel(word: string): boolean {
  const vowels = "aeıioöuüAEIİOÖUÜ"
  return vowels.includes(word[word.length - 1])
}

export function getTurkishDativeSuffix(prayerName: string): string {
  const lastVowel = getLastVowel(prayerName)
  if (!lastVowel) return "'a"
  
  if (endsWithVowel(prayerName)) {
    return isBackVowel(lastVowel) ? "'ya" : "'ye"
  } else {
    return isBackVowel(lastVowel) ? "'a" : "'e"
  }
}

export function getTurkishCountdownText(prayerName: string): string {
  const suffix = getTurkishDativeSuffix(prayerName)
  return `${prayerName}${suffix} Kalan Süre`
}

export function getEnglishCountdownText(prayerName: string): string {
  return `Time until ${prayerName}`
}

export function getArabicCountdownText(prayerName: string): string {
  return `الوقت المتبقي حتى ${prayerName}`
}

export function getGermanCountdownText(prayerName: string): string {
  return `Zeit bis ${prayerName}`
}

export function getFrenchCountdownText(prayerName: string): string {
  return `Temps restant jusqu'à ${prayerName}`
}

export function getCountdownText(language: Language, prayerName: string): string {
  switch (language) {
    case "tr":
      return getTurkishCountdownText(prayerName)
    case "en":
      return getEnglishCountdownText(prayerName)
    case "ar":
      return getArabicCountdownText(prayerName)
    case "de":
      return getGermanCountdownText(prayerName)
    case "fr":
      return getFrenchCountdownText(prayerName)
  }
}
