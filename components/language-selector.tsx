"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { LanguageCircleIcon, Tick01Icon, Cancel01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { useLanguage } from "@/lib/language-store"
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, Language } from "@/lib/i18n"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open, isMobile])

  React.useEffect(() => {
    if (!isMobile && open) {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, isMobile])

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setOpen(false)
  }

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground touch-manipulation"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon icon={LanguageCircleIcon} size={20} />
          <span className="sr-only">{t.ui.language}</span>
        </Button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[85vw] max-w-sm bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="text-lg font-semibold">{t.ui.language}</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground touch-manipulation rounded-full hover:bg-muted/50"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={20} />
                  </button>
                </div>

                <div className="py-2 max-h-[60vh] overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleSelect(lang)}
                      className={cn(
                        "w-full flex items-center justify-between px-5 py-4 text-left text-lg touch-manipulation active:bg-muted/50 transition-colors",
                        lang === language && "text-primary"
                      )}
                    >
                      <span>{LANGUAGE_NAMES[lang]}</span>
                      {lang === language && (
                        <HugeiconsIcon icon={Tick01Icon} size={20} className="text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <HugeiconsIcon icon={LanguageCircleIcon} size={16} />
        <span className="text-sm">{LANGUAGE_NAMES[language]}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} className={cn("transition-transform", open && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors",
                  lang === language && "text-primary"
                )}
              >
                <span>{LANGUAGE_NAMES[lang]}</span>
                {lang === language && (
                  <HugeiconsIcon icon={Tick01Icon} size={16} className="text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
