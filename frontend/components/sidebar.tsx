"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Wrench, Users, UserCog, Store, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/shared/hooks/use-auth"
import { canAccessRoute } from "@/shared/lib/route-guards"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
  { name: "Reparaciones", href: "/reparaciones", icon: Wrench },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Usuarios", href: "/usuarios", icon: UserCog },
  { name: "Sucursales", href: "/sucursales", icon: Store },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => (user ? canAccessRoute(user.rol, item.href) : false))

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Store className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Cell</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-6">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Button onClick={logout} variant="outline" className="w-full justify-start gap-3 bg-transparent" size="default">
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
