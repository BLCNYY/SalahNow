"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Settings01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { SettingsPanel } from "@/components/settings-panel"
import { useLanguage } from "@/lib/language-store"

export function SettingsModal() {
  const { t } = useLanguage()
  const [open, setOpen] = React.useState(false)

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

  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 sm:size-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon icon={Settings01Icon} size={20} />
        <span className="sr-only">{t.ui.settings}</span>
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
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 max-h-[80vh] -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-[520px] sm:-translate-x-1/2"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{t.ui.settings}</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} />
                </button>
              </div>
              <div className="max-h-[calc(80vh-72px)] overflow-y-auto px-5 py-4">
                <SettingsPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
