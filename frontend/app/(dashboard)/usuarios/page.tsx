"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/shared/hooks/use-auth"
import type { Role } from "@/shared/hooks/use-auth"

interface Usuario {
  id: string
  email: string
  rol: Role
  sucursal_id: string
  sucursal_nombre?: string
  activo: boolean
  ultima_conexion?: string
}

export default function UsuariosPage() {
  const { token, sucursales } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      email: "admin@cell.com",
      rol: "admin",
      sucursal_id: "1",
      sucursal_nombre: "Sucursal Centro",
      activo: true,
      ultima_conexion: "Hoy, 10:30 AM",
    },
    {
      id: "2",
      email: "encargado@cell.com",
      rol: "encargado",
      sucursal_id: "1",
      sucursal_nombre: "Sucursal Centro",
      activo: true,
      ultima_conexion: "Ayer, 3:15 PM",
    },
    {
      id: "3",
      email: "tecnico@cell.com",
      rol: "tecnico",
      sucursal_id: "2",
      sucursal_nombre: "Sucursal Norte",
      activo: true,
      ultima_conexion: "Hace 2 días",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rol: "tecnico" as Role,
    sucursal_id: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with API POST /usuarios
    console.log("[v0] Creating user:", formData)
    setIsDialogOpen(false)
    setFormData({ email: "", password: "", rol: "tecnico", sucursal_id: "" })
  }

  const getRolBadgeColor = (rol: Role) => {
    switch (rol) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "encargado":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "tecnico":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRolLabel = (rol: Role) => {
    switch (rol) {
      case "admin":
        return "Administrador"
      case "encargado":
        return "Encargado"
      case "tecnico":
        return "Técnico"
      default:
        return rol
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de accesos y roles del sistema.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="usuario@cell.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <Select
                  value={formData.rol}
                  onValueChange={(value) => setFormData({ ...formData, rol: value as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="encargado">Encargado</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sucursal</label>
                <Select
                  value={formData.sucursal_id}
                  onValueChange={(value) => setFormData({ ...formData, sucursal_id: value })}
                >
                  <SelectTrigger>
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
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Conexión</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRolBadgeColor(usuario.rol)}>
                    {getRolLabel(usuario.rol)}
                  </Badge>
                </TableCell>
                <TableCell>{usuario.sucursal_nombre || "-"}</TableCell>
                <TableCell>
                  <Badge className={usuario.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{usuario.ultima_conexion || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
