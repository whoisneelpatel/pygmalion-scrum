"use client"

import type React from "react"

import { Sidebar, SidebarContent, SidebarHeader, SidebarNavigation } from "@/components/sidebar"
import { IconLayoutDashboard, IconUsers, IconClipboardList, IconUser } from "@tabler/icons-react"

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: IconUsers,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: IconClipboardList,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: IconUser,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar>
        <SidebarContent>
          <SidebarHeader />
          <SidebarNavigation items={navigationItems} />
        </SidebarContent>
      </Sidebar>

      {children}
    </div>
  )
}

