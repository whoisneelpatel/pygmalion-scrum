"use client"

import type React from "react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarNavigation, useSidebar } from "@/components/sidebar"
import { IconLayoutDashboard, IconUsers, IconClipboardList, IconUser } from "@tabler/icons-react"

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <IconLayoutDashboard size={20} strokeWidth={1.5} />,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: <IconUsers size={20} strokeWidth={1.5} />,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: <IconClipboardList size={20} strokeWidth={1.5} />,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <IconUser size={20} strokeWidth={1.5} />,
  },
]

function MainContent({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar()

  return (
    <main
      className="flex-1 transition-[margin] duration-200 ease-linear"
      style={{ marginLeft: expanded ? "300px" : "80px" }}
    >
      {children}
    </main>
  )
}

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
        <MainContent>{children}</MainContent>
      </Sidebar>
    </div>
  )
}

