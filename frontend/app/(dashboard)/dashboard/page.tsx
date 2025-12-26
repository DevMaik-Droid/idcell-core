"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  Wrench,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import { useAuth } from "@/shared/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, sucursal } = useAuth()

  if (user?.rol === "admin") {
    return <AdminDashboard user={user} sucursal={sucursal} />
  }

  if (user?.rol === "encargado") {
    return <EncargadoDashboard user={user} sucursal={sucursal} />
  }

  if (user?.rol === "tecnico") {
    return <TecnicoDashboard user={user} sucursal={sucursal} />
  }

  if (user?.rol === "vendedor") {
    return <VendedorDashboard user={user} sucursal={sucursal} />
  }

  return null
}

function AdminDashboard({ user, sucursal }: any) {
  const stats = [
    { name: "Total Productos", value: "450", icon: Package, change: "+5%", positive: true },
    { name: "Ventas del Mes", value: "$12,450", icon: DollarSign, change: "+12%", positive: true },
    { name: "Reparaciones Activas", value: "18", icon: Wrench, change: "-2%", positive: false },
    { name: "Total Usuarios", value: "8", icon: Users, change: "+1", positive: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Administrador</h1>
        <p className="text-muted-foreground">
          Vista completa del sistema • {sucursal?.nombre || "Todas las sucursales"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"} flex items-center gap-1 mt-1`}
              >
                <TrendingUp className="h-3 w-3" />
                {stat.change} vs mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Sucursales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Sucursal Centro", "Sucursal Norte"].map((branch) => (
              <div key={branch} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{branch}</p>
                  <p className="text-xs text-muted-foreground">Ventas: $6,225 • Inventario: 225 items</p>
                </div>
                <Badge variant="secondary">Activa</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Carlos R.", role: "encargado", status: "En línea" },
              { name: "María L.", role: "tecnico", status: "En línea" },
              { name: "Juan P.", role: "tecnico", status: "Desconectado" },
            ].map((u) => (
              <div key={u.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                </div>
                <Badge variant={u.status === "En línea" ? "default" : "secondary"}>{u.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EncargadoDashboard({ user, sucursal }: any) {
  const stats = [
    { name: "Inventario Disponible", value: "225", icon: Package, alert: false },
    { name: "Ventas de Hoy", value: "$1,850", icon: DollarSign, alert: false },
    { name: "Reparaciones Pendientes", value: "8", icon: Clock, alert: true },
    { name: "Clientes Atendidos", value: "12", icon: Users, alert: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel del Encargado</h1>
        <p className="text-muted-foreground">Gestión operativa de {sucursal?.nombre || "la sucursal"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className={stat.alert ? "border-orange-300" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? "text-orange-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.alert && (
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Requiere atención
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { product: "iPhone 15 Pro Max", price: "$1,200", status: "Completada" },
              { product: "Samsung S24 Ultra", price: "$950", status: "Completada" },
              { product: "Funda + Protector", price: "$45", status: "Completada" },
            ].map((sale, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{sale.product}</p>
                  <p className="text-xs text-muted-foreground">{sale.price}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {sale.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reparaciones Urgentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { device: "iPhone 12", issue: "Pantalla rota", time: "2h" },
              { device: "Samsung A54", issue: "Batería", time: "5h" },
              { device: "Xiaomi 13", issue: "Cámara", time: "1d" },
            ].map((repair, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200"
              >
                <div>
                  <p className="font-medium">{repair.device}</p>
                  <p className="text-xs text-muted-foreground">{repair.issue}</p>
                </div>
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {repair.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TecnicoDashboard({ user, sucursal }: any) {
  const stats = [
    { name: "Mis Reparaciones", value: "5", icon: Wrench, alert: false },
    { name: "Pendientes", value: "3", icon: Clock, alert: true },
    { name: "Completadas Hoy", value: "2", icon: CheckCircle, alert: false },
    { name: "Tiempo Promedio", value: "45min", icon: TrendingUp, alert: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel del Técnico</h1>
        <p className="text-muted-foreground">Gestión de reparaciones • {sucursal?.nombre || "Mi sucursal"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className={stat.alert ? "border-blue-300" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? "text-blue-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Reparaciones Activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              id: "REP-001",
              device: "iPhone 12 Pro",
              issue: "Cambio de pantalla",
              priority: "Alta",
              status: "En proceso",
            },
            {
              id: "REP-003",
              device: "Samsung Galaxy S21",
              issue: "Reemplazo de batería",
              priority: "Media",
              status: "Pendiente",
            },
            {
              id: "REP-005",
              device: "Xiaomi Redmi Note 10",
              issue: "Reparación cámara",
              priority: "Media",
              status: "En proceso",
            },
          ].map((repair) => (
            <div key={repair.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{repair.device}</p>
                  <p className="text-sm text-muted-foreground">{repair.issue}</p>
                </div>
                <Badge
                  variant={repair.priority === "Alta" ? "destructive" : "secondary"}
                  className={repair.priority === "Alta" ? "bg-red-100 text-red-800" : ""}
                >
                  {repair.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground font-medium">{repair.id}</span>
                <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                  {repair.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function VendedorDashboard({ user, sucursal }: any) {
  const stats = [
    { name: "Mis Ventas Hoy", value: "$450.00", icon: DollarSign },
    { name: "Productos en Stock", value: "210", icon: Package },
    { name: "Clientes Registrados", value: "5", icon: Users },
    { name: "Reparaciones Recibidas", value: "2", icon: Wrench },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">¡Hola, Vendedor!</h1>
        <p className="text-sm text-muted-foreground">Panel de ventas rápidas • {sucursal?.nombre}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-none border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-none border-border/60">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">Productos más vendidos hoy</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 px-0">
            <div className="space-y-1">
              {[
                { name: "iPhone 15 Case", sold: 4, stock: 12, price: "$25" },
                { name: "Cargador USB-C 20W", sold: 3, stock: 45, price: "$19" },
                { name: "Protector de Pantalla", sold: 2, stock: 80, price: "$10" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.stock} unidades en stock</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{item.price}</p>
                    <p className="text-[11px] text-green-600 font-medium">{item.sold} vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-[13px] h-9 shadow-none border-border/60 bg-transparent"
            >
              <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
              Nueva Venta
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-[13px] h-9 shadow-none border-border/60 bg-transparent"
            >
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              Registrar Cliente
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-[13px] h-9 shadow-none border-border/60 bg-transparent"
            >
              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
              Ver Catálogo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
