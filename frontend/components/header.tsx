"use client"
import { useAuth } from "@/shared/hooks/use-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, CreditCard, Bell, Shield, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Header() {
  const { user, sucursal, sucursales, setActiveSucursal, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const commissionPercent = user?.ventasHoy && user?.metaVentas ? (user.ventasHoy / user.metaVentas) * 100 : 0
  const extraCommission = commissionPercent >= 100 ? (user?.ventasHoy || 0) * 0.05 : 0

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {sucursales.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium text-muted-foreground">Sucursal:</span>
            <Select value={sucursal?.id} onValueChange={setActiveSucursal}>
              <SelectTrigger className="h-9 w-[160px] md:w-[220px]">
                <SelectValue placeholder="Sucursal" />
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

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-full flex items-center gap-3 px-2 hover:bg-accent/50 transition-colors"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground leading-none">
                  {user?.nombre || user?.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase mt-1 tracking-wider">
                  {user?.rol || "Usuario"}
                </span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/20 transition-all hover:border-primary/50">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} alt={user?.email || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2 p-1">
                <p className="text-sm font-bold leading-none">{user?.nombre || user?.email?.split("@")[0]}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-tighter bg-primary/10 text-primary border-primary/20"
                  >
                    {user?.rol} • {sucursal?.nombre || "Sin sede"}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div className="px-2 py-3 bg-muted/30 rounded-md mx-1 my-1 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Rendimiento Hoy
                </span>
                <span className="text-xs font-bold text-primary">${user?.ventasHoy?.toLocaleString()}</span>
              </div>
              <Progress value={commissionPercent} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Comisión acumulada:</span>
                <span className="text-xs font-bold text-secondary flex items-center gap-0.5">
                  <DollarSign className="h-3 w-3" />
                  {(user?.comisionHoy || 0).toLocaleString()}
                </span>
              </div>
              {extraCommission > 0 && (
                <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between animate-pulse">
                  <span className="text-[9px] font-bold text-secondary uppercase">¡Bono Extra Activo!</span>
                  <span className="text-[10px] font-bold text-secondary">+${extraCommission.toLocaleString()}</span>
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setShowProfile(true)}>
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setShowSettings(true)}>
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                <span>Facturación</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2">
                <Bell className="mr-2 h-4 w-4 text-primary" />
                <span>Notificaciones</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer py-2">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                <span>Seguridad</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px] border-primary/20 bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Perfil de Usuario
            </DialogTitle>
            <DialogDescription>Gestiona tu información personal y visualiza tus estadísticas.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-muted/20 border border-border/50">
              <Avatar className="h-20 w-20 border-4 border-primary/10">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                <AvatarFallback className="text-xl">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-lg">{user?.nombre}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md border border-border/50 bg-muted/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Ventas Totales</p>
                <p className="text-lg font-bold text-primary">${user?.ventasHoy?.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-md border border-border/50 bg-muted/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Comisión</p>
                <p className="text-lg font-bold text-secondary">${(user?.comisionHoy || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px] border-primary/20 bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Configuración
            </DialogTitle>
            <DialogDescription>Ajusta las preferencias de tu cuenta y la interfaz.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
              <span className="text-sm font-medium">Notificaciones por correo</span>
              <Badge>Activado</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
              <span className="text-sm font-medium">Modo Oscuro Automático</span>
              <Badge variant="outline">Sistema</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
