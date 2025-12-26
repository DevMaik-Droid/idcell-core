"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/shared/hooks/use-auth"
import { Store, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

const STATIC_USERS = [
  { email: "admin@cell.com", password: "admin123", rol: "admin" as const, sucursal_id: "1" },
  { email: "encargado@cell.com", password: "encargado123", rol: "encargado" as const, sucursal_id: "1" },
  { email: "tecnico@cell.com", password: "tecnico123", rol: "tecnico" as const, sucursal_id: "1" },
  { email: "vendedor@cell.com", password: "vendedor123", rol: "vendedor" as const, sucursal_id: "1" },
]

export default function LoginPage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const foundUser = STATIC_USERS.find((u) => u.email === formData.email && u.password === formData.password)

    if (foundUser) {
      setTimeout(() => {
        const mockUser = {
          id: foundUser.email,
          email: foundUser.email,
          rol: foundUser.rol,
          sucursal_id: foundUser.sucursal_id,
        }
        const mockToken = "mock-jwt-token-" + Date.now()
        login(mockUser, mockToken)
        setLoading(false)
      }, 500)
    } else {
      setError("Credenciales incorrectas. Por favor intenta de nuevo.")
      setLoading(false)
    }
  }

  const handleQuickLogin = (userType: "admin" | "encargado" | "tecnico" | "vendedor") => {
    const user = STATIC_USERS.find((u) => u.rol === userType)
    if (user) {
      setFormData({ email: user.email, password: user.password })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">Bienvenido a Cell</CardTitle>
            <CardDescription className="text-sm">Ingresa tus credenciales para continuar</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@cell.com"
                required
                className="h-11"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={loading}>
              {loading ? "Verificando..." : "Entrar al Sistema"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="bg-background px-3">Accesos directos</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["admin", "encargado", "tecnico", "vendedor"].map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickLogin(role as any)}
                  className="text-[11px] h-8 font-medium capitalize"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
