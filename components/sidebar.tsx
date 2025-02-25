"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { useState, createContext, useContext, useEffect } from "react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import { IconMenu2, IconX, IconLogout } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

interface Links {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarContextProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Renamed to SidebarRoot to avoid naming conflicts
const SidebarRoot = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true)
  return <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
}

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const { expanded, setExpanded } = useSidebar()
  const controls = useAnimation()
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string } | null>(null)

  useEffect(() => {
    // Get user data from the auth token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1]

    if (token) {
      try {
        const userData = JSON.parse(Buffer.from(token, "base64").toString())
        setUser(userData)
      } catch (error) {
        console.error("Error parsing auth token:", error)
      }
    }
  }, [])

  useEffect(() => {
    controls.start({
      width: expanded ? 300 : 80,
      transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
    })
  }, [expanded, controls])

  const handleSignOut = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex h-screen border-r border-zinc-200 bg-white fixed left-0 top-0 z-30"
        animate={controls}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
      >
        <div className="flex flex-col flex-1 gap-4 p-4">
          {children}

          {/* User Profile Section */}
          {user && (
            <div className="mt-auto border-t border-zinc-200 pt-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  {user.firstName?.[0]}
                </div>
                <AnimatePresence mode="wait">
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-2 py-2 mt-2 w-full rounded-lg text-red-600 hover:bg-red-50"
              >
                <IconLogout size={20} />
                <AnimatePresence mode="wait">
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button onClick={() => setExpanded(true)} className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg">
          <IconMenu2 size={20} />
        </button>

        <AnimatePresence>
          {expanded && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpanded(false)}
                className="fixed inset-0 bg-black z-40"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-[300px] bg-white z-50 p-4"
              >
                <div className="flex justify-end mb-4">
                  <button onClick={() => setExpanded(false)}>
                    <IconX size={20} />
                  </button>
                </div>
                {children}
                {/* Mobile User Profile Section */}
                {user && (
                  <div className="mt-auto border-t border-zinc-200 pt-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                        {user.firstName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-2 py-2 mt-2 w-full rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <IconLogout size={20} />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

const SidebarHeader = () => {
  const { expanded } = useSidebar()

  return (
    <div className="flex items-center px-2">
      <span className="font-bold text-xl flex-none">P</span>
      <motion.div initial={false} animate={{ width: expanded ? "auto" : 0 }} className="overflow-hidden flex">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="font-medium text-lg whitespace-nowrap ml-[1px]"
        >
          ygmalion Wealth
        </motion.span>
      </motion.div>
    </div>
  )
}

const SidebarNavigation = ({ items }: { items: Links[] }) => {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-4">
      {items.map((item) => (
        <SidebarItem key={item.href} item={item} active={pathname === item.href} />
      ))}
    </nav>
  )
}

const SidebarItem = ({ item, active }: { item: Links; active: boolean }) => {
  const { expanded } = useSidebar()

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-2 py-2 rounded-lg relative group",
        "text-zinc-600 hover:text-zinc-900",
        active && "text-zinc-900 bg-zinc-100",
      )}
    >
      <div className="w-8 h-8 flex items-center justify-center">{item.icon}</div>
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

// Single export statement with all components
export {
  SidebarRoot as Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarNavigation,
  useSidebar,
  SidebarRoot as SidebarProvider,
}

