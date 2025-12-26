"use client"

import type React from "react"

import { useAuth } from "@/shared/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { canAccessRoute } from "@/shared/lib/route-guards"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (!canAccessRoute(user.rol, pathname)) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || !canAccessRoute(user.rol, pathname)) {
    return null
  }

  return <>{children}</>
}
