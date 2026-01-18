"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Location01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { useLocation } from "@/lib/store"
import { useLanguage } from "@/lib/language-store"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { SettingsPanel } from "@/components/settings-panel"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { favorites, currentLocation, setLocation, removeFavorite } = useLocation()
  const { setOpenMobile, state } = useSidebar()
  const { t } = useLanguage()

  const handleLocationSelect = (location: typeof currentLocation) => {
    setLocation(location)
    setOpenMobile(false)
  }

  const isCurrentLocation = (location: typeof currentLocation) => {
    return location.city === currentLocation.city && location.countryCode === currentLocation.countryCode
  }

  const formatLocationName = (location: typeof currentLocation) => {
    if (location.addressLabel) return location.city
    return location.city
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shrink-0">
                  <Image src="/icons/icon.png" alt="Salah[Now]" width={32} height={32} className="size-8 object-contain" />
                </div>
                <span className="font-semibold group-data-[collapsible=icon]:hidden">Salah[Now]</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {state === "expanded" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>{t.ui.savedLocations}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favorites.length === 0 ? (
                    <div className="px-2 py-4 text-xs text-muted-foreground text-center">
                      {t.ui.noSavedLocations}
                      <br />
                      {t.ui.clickStarToSave}
                    </div>
                  ) : (
                    favorites.map((item) => (
                      <SidebarMenuItem key={`${item.city}-${item.countryCode}`}>
                        <SidebarMenuButton 
                          onClick={() => handleLocationSelect(item)}
                          className={cn(
                            isCurrentLocation(item) && "bg-sidebar-accent"
                          )}
                        >
                          <HugeiconsIcon icon={Location01Icon} size={16} className="shrink-0" />
                          <span className="flex flex-1 flex-col truncate">
                            <span className="truncate">{formatLocationName(item)}</span>
                            <span className="truncate text-[11px] text-muted-foreground">
                              {t.ui.country}: {item.country}
                            </span>
                          </span>
                        </SidebarMenuButton>
                        <SidebarMenuAction
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFavorite(item)
                          }}
                          showOnHover
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={12} />
                        </SidebarMenuAction>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>{t.ui.settings}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SettingsPanel />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
