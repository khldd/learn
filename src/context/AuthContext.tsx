"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const MOCK_USER: User = {
  id: "1",
  email: "admin@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar: undefined,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("auth-user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept any credentials
    if (email && password) {
      const userData = {
        ...MOCK_USER,
        email: email, // Use the provided email
      }

      setUser(userData)
      localStorage.setItem("auth-user", JSON.stringify(userData))
      router.push("/dashboard")
    } else {
      throw new Error("Please enter both email and password")
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("auth-user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
