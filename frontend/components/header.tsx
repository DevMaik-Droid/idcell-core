"use client"

import { useAuth } from "@/shared/hooks/use-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { user, sucursal, sucursales, setActiveSucursal } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
      <div className="flex items-center gap-4">
        {sucursales.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Sucursal:</span>
            <Select value={sucursal?.id} onValueChange={setActiveSucursal}>
              <SelectTrigger className="h-9 w-[220px]">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {sucursales.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-foreground">{user?.email}</span>
            <Badge variant="secondary" className="text-xs font-medium capitalize">
              {user?.rol || "Usuario"}
            </Badge>
          </div>
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
