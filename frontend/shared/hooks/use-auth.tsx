"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// <CHANGE> Added "vendedor" role to the Role type
export type Role = "admin" | "encargado" | "tecnico" | "vendedor"

export interface User {
  id: string
  email: string
  rol: Role
  sucursal_id: string
}

export interface Sucursal {
  id: string
  nombre: string
  direccion: string
}

// <CHANGE> Static sucursales data - no API calls
const STATIC_SUCURSALES: Sucursal[] = [
  { id: "1", nombre: "Sucursal Centro", direccion: "Av. Principal 123" },
  { id: "2", nombre: "Sucursal Norte", direccion: "Calle Norte 456" },
  { id: "3", nombre: "Sucursal Sur", direccion: "Av. Sur 789" },
]

interface AuthContextType {
  user: User | null
  token: string | null
  sucursalActivaId: string | null
  sucursal: Sucursal | null
  sucursales: Sucursal[]
  setSucursalActiva: (id: string) => void
  setActiveSucursal: (id: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [sucursalActivaId, setSucursalActivaId] = useState<string | null>(null)
  // <CHANGE> Use static sucursales data instead of API calls
  const [sucursales] = useState<Sucursal[]>(STATIC_SUCURSALES)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // <CHANGE> Simplified initialization with static data only
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    const storedSucursal = localStorage.getItem("active_sucursal")

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setToken(storedToken)
      setUser(parsedUser)
      setSucursalActivaId(storedSucursal || parsedUser.sucursal_id)
    }
    setLoading(false)
  }, [])

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("active_sucursal", user.sucursal_id)
    setToken(token)
    setUser(user)
    setSucursalActivaId(user.sucursal_id)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("active_sucursal")
    setToken(null)
    setUser(null)
    setSucursalActivaId(null)
    router.push("/login")
  }

  const setSucursalActiva = (id: string) => {
    localStorage.setItem("active_sucursal", id)
    setSucursalActivaId(id)
  }

  const setActiveSucursal = setSucursalActiva

  const sucursal = sucursales.find((s) => s.id === sucursalActivaId) || null

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        sucursalActivaId,
        sucursal,
        sucursales,
        setSucursalActiva,
        setActiveSucursal,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
