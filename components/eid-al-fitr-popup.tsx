"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Language } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-store"

const EID_AL_FITR_CAMPAIGN_KEY = "salahnow-eid-al-fitr-2026-dismissed"
const OPEN_DELAY_MS = 900

const popupCopy: Record<
  Language,
  {
    title: string
    message: string
    button: string
  }
> = {
  en: {
    title: "Eid Mubarak",
    message: "May Eid al-Fitr bring peace to your home, acceptance to your prayers, and barakah to the days ahead.",
    button: "Ameen",
  },
  tr: {
    title: "Ramazan Bayramınız Mübarek Olsun",
    message: "Ramazan Bayramı evinize huzur, dualarınıza kabul ve gelecek günlerinize bereket getirsin.",
    button: "Amin",
  },
  ar: {
    title: "عيد مبارك",
    message: "نسأل الله أن يحمل عيد الفطر إلى بيتكم السكينة، وأن يتقبل دعاءكم، ويبارك لكم فيما هو آت.",
    button: "آمين",
  },
  de: {
    title: "Gesegnetes Fest zum Eid al-Fitr",
    message: "Möge Eid al-Fitr Frieden in euer Zuhause bringen, eure Gebete annehmen lassen und die kommenden Tage mit Segen füllen.",
    button: "Amin",
  },
  fr: {
    title: "Aïd Moubarak",
    message: "Que l'Aïd al-Fitr apporte la paix dans votre foyer, l'acceptation de vos prières et la bénédiction pour les jours à venir.",
    button: "Amine",
  },
  az: {
    title: "Fitr Bayramınız Mübarək",
    message: "Fitr bayramı evinizə rahatlıq, dualarınıza qəbul və qarşıdakı günlərə bərəkət gətirsin.",
    button: "Amin",
  },
  id: {
    title: "Selamat Idulfitri",
    message: "Semoga Idulfitri membawa kedamaian ke rumahmu, diterimanya doa-doamu, dan keberkahan untuk hari-hari yang akan datang.",
    button: "Amin",
  },
  it: {
    title: "Buon Eid al-Fitr",
    message: "Che Eid al-Fitr porti pace nella tua casa, accettazione alle tue preghiere e benedizione ai giorni che verranno.",
    button: "Amen",
  },
  es: {
    title: "Feliz Eid al-Fitr",
    message: "Que Eid al-Fitr lleve paz a tu hogar, aceptación a tus oraciones y bendición a los días que vienen.",
    button: "Amen",
  },
}

function loadDismissedState() {
  if (typeof window === "undefined") return false

  try {
    return localStorage.getItem(EID_AL_FITR_CAMPAIGN_KEY) === "true"
  } catch {
    return false
  }
}

export function EidAlFitrPopup() {
  const { language } = useLanguage()
  const [open, setOpen] = React.useState(false)

  const copy = popupCopy[language] ?? popupCopy.en

  const closePopup = React.useCallback(() => {
    setOpen(false)

    try {
      localStorage.setItem(EID_AL_FITR_CAMPAIGN_KEY, "true")
    } catch {
      // Ignore storage failures and just close the popup.
    }
  }, [])

  React.useEffect(() => {
    if (loadDismissedState()) return

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, OPEN_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup()
      }
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, closePopup])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            onClick={closePopup}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto w-[min(92vw,32rem)] -translate-y-1/2 overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_38%),linear-gradient(160deg,rgba(11,27,24,0.98),rgba(7,10,18,0.98))] shadow-[0_32px_120px_rgba(0,0,0,0.6)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="eid-popup-title"
          >
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)]" />

            <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-amber-300/14 blur-2xl" />
            <div className="absolute right-8 top-12 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl" />

            {[0, 1, 2, 3].map((index) => (
              <motion.span
                key={index}
                className="absolute block rounded-full bg-amber-100/80"
                style={{
                  width: index % 2 === 0 ? 5 : 3,
                  height: index % 2 === 0 ? 5 : 3,
                  top: `${18 + index * 16}%`,
                  left: `${index % 2 === 0 ? 15 + index * 18 : 70 - index * 8}%`,
                }}
                animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.35, 1] }}
                transition={{ duration: 2.8 + index * 0.4, repeat: Number.POSITIVE_INFINITY }}
              />
            ))}

            <div className="relative px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close Eid celebration popup"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              </div>

              <div className="mb-7 flex items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <motion.div
                    className="absolute h-28 w-28 rounded-full bg-amber-200/95 shadow-[0_0_40px_rgba(251,191,36,0.35)]"
                    animate={{ scale: [1, 1.04, 1], opacity: [0.92, 1, 0.92] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="absolute left-[44%] top-[18%] h-24 w-24 rounded-full bg-[#081018]" />

                  <motion.div
                    className="absolute inset-3 rounded-full border border-amber-200/12"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />

                  <div className="absolute bottom-4 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
                </div>
              </div>

              <div className="space-y-3 text-center">
                <h2 id="eid-popup-title" className="text-3xl font-semibold tracking-[0.08em] text-white sm:text-[2.2rem]">
                  {copy.title}
                </h2>
                <p className="mx-auto max-w-md text-sm leading-7 text-white/74 sm:text-[15px]">
                  {copy.message}
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  type="button"
                  onClick={closePopup}
                  className="min-w-36 rounded-full bg-amber-200 px-6 text-[#0a1110] shadow-[0_10px_40px_rgba(251,191,36,0.3)] transition-transform hover:scale-[1.02] hover:bg-amber-100"
                >
                  {copy.button}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
