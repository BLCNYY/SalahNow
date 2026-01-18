"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-store"

interface Option {
  value: string
  label: string
}

interface PopupSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  placeholder?: string
  icon?: React.ReactNode
  title?: string
}

export function PopupSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select",
  icon,
  title,
}: PopupSelectProps) {
  const { t } = useLanguage()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(lower))
  }, [options, search])

  const handleOpen = () => {
    setOpen(true)
    setSearch("")
  }

  const handleClose = () => {
    setOpen(false)
    setSearch("")
  }

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    handleClose()
  }

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

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

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation truncate"
      >
        {icon}
        <span className="truncate">{selectedOption?.label || placeholder}</span>
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
                <span className="text-lg font-semibold flex-1">{title || placeholder}</span>
              </div>

              <div className="px-4 py-3 border-b border-border">
                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.ui.search}
                    className="w-full h-11 pl-11 pr-4 bg-muted/50 rounded-xl text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
                {filteredOptions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {t.ui.noResults}
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-6 py-4 text-left text-base touch-manipulation hover:bg-muted/50 transition-colors",
                          option.value === value && "text-primary"
                        )}
                      >
                        <span>{option.label}</span>
                        {option.value === value && (
                          <HugeiconsIcon icon={Tick01Icon} size={20} className="text-primary shrink-0" />
                        )}
                      </button>
                    ))}
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
