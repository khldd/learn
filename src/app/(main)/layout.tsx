"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Enrollments", href: "/enrollments", icon: GraduationCap },
]

// Sidebar now accepts `darkMode` as a prop
function Sidebar({ isOpen, onClose, darkMode }: { isOpen: boolean; onClose: () => void; darkMode: boolean }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r-2 border-primary/10 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 tech-grid slide-in-left",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b-2 border-primary/10">
          <div className="flex items-center space-x-3 fade-in">
            {/* Conditionally render logo based on darkMode prop */}
            <img src={darkMode ? "/logoDark.png" : "/logo.png"} alt="Learn" className="h-8 hover-lift" />
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-primary mr-1 icon-float" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover-lift"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name} className="stagger-fade">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 relative group hover-lift",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg glow-on-hover"
                        : "text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/10",
                    )}
                    onClick={() => {
                      onClose()
                      const element = document.querySelector(`[href="${item.href}"]`)
                      element?.classList.add("micro-bounce")
                      setTimeout(() => element?.classList.remove("micro-bounce"), 400)
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    {item.name}
                    {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent data-flow"></div>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}

// TopBar accepts `darkMode` and `toggleDarkMode` as props
function TopBar({
  onMenuClick,
  darkMode,
  toggleDarkMode,
}: {
  onMenuClick: () => void
  darkMode: boolean
  toggleDarkMode: () => void
}) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-card border-b-2 border-primary/10 flex items-center justify-between px-6 tech-grid slide-in-right">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-all duration-200 hover-lift"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3 text-sm connected-accent">
          <span className="font-medium">Learning Management System</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="hover:bg-primary/10 hover-lift">
          {darkMode ? <Sun className="h-4 w-4 icon-float" /> : <Moon className="h-4 w-4 icon-float" />}
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-primary/10 relative hover-lift">
          <Bell className="h-4 w-4 icon-float" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent animate-pulse"></div>
        </Button>
        <div className="flex items-center space-x-3 hover-lift">
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold relative glow-on-hover transition-all duration-300">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent animate-pulse"></div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-green-500 mr-1 animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="hover:bg-red-50 hover:text-red-600 hover-lift transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 tech-grid">
          <div className="container mx-auto px-6 py-8 fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoute>
          <Suspense fallback={null}>
            <MainLayoutContent>{children}</MainLayoutContent>
          </Suspense>
        </ProtectedRoute>
      </AuthProvider>
    </QueryClientProvider>
  )
}