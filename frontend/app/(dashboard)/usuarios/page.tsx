"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Pencil, Trash2, Shield, User, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/shared/hooks/use-auth"
import type { Role } from "@/shared/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Suspense } from "react"

interface Usuario {
  id: string
  email: string
  rol: Role
  sucursal_id: string
  sucursal_nombre?: string
  activo: boolean
  ultima_conexion?: string
}

function UsuariosContent() {
  const { sucursales } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

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
    {
      id: "4",
      email: "vendedor@cell.com",
      rol: "vendedor",
      sucursal_id: "1",
      sucursal_nombre: "Sucursal Centro",
      activo: true,
      ultima_conexion: "Hoy, 9:00 AM",
    },
  ])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rol: "vendedor" as Role,
    sucursal_id: "1",
  })

  const handleOpenForm = (usuario?: Usuario) => {
    if (usuario) {
      setSelectedUsuario(usuario)
      setFormData({
        email: usuario.email,
        password: "", // No mostramos la contraseña al editar
        rol: usuario.rol,
        sucursal_id: usuario.sucursal_id,
      })
      setIsEditMode(true)
    } else {
      setSelectedUsuario(null)
      setFormData({ email: "", password: "", rol: "vendedor", sucursal_id: "1" })
      setIsEditMode(false)
    }
    setIsFormModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedUsuario) {
      setUsuarios(
        usuarios.map((u) =>
          u.id === selectedUsuario.id
            ? {
                ...u,
                email: formData.email,
                rol: formData.rol,
                sucursal_id: formData.sucursal_id,
                sucursal_nombre: sucursales.find((s) => s.id === formData.sucursal_id)?.nombre,
              }
            : u,
        ),
      )
    } else {
      const newUsuario = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        rol: formData.rol,
        sucursal_id: formData.sucursal_id,
        sucursal_nombre: sucursales.find((s) => s.id === formData.sucursal_id)?.nombre,
        activo: true,
        ultima_conexion: "Nunca",
      }
      setUsuarios([...usuarios, newUsuario])
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = () => {
    if (selectedUsuario) {
      setUsuarios(usuarios.filter((u) => u.id !== selectedUsuario.id))
      setIsDeleteDialogOpen(false)
      setSelectedUsuario(null)
    }
  }

  const getRolBadgeColor = (rol: Role) => {
    switch (rol) {
      case "admin":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
      case "encargado":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "tecnico":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      case "vendedor":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const filteredUsuarios = usuarios.filter((u) => u.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Control de Accesos</h1>
          <p className="text-muted-foreground">Gestión de usuarios y niveles de seguridad</p>
        </div>
        <Button
          className="h-11 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2"
          onClick={() => handleOpenForm()}
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 h-11 rounded-2xl bg-white border-none shadow-sm"
          placeholder="Filtrar por email de usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border-none shadow-2xl shadow-black/5 overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-5 pl-8 text-xs uppercase tracking-widest font-black">Usuario</TableHead>
                <TableHead className="py-5 text-xs uppercase tracking-widest font-black">Nivel / Rol</TableHead>
                <TableHead className="py-5 text-xs uppercase tracking-widest font-black">Sucursal</TableHead>
                <TableHead className="py-5 text-xs uppercase tracking-widest font-black">Última Actividad</TableHead>
                <TableHead className="py-5 pr-8 text-right text-xs uppercase tracking-widest font-black">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id} className="group hover:bg-white/80 transition-all border-muted/20">
                  <TableCell className="py-5 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-bold text-base">{usuario.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant="outline"
                      className={`rounded-lg py-1 px-3 border-none ${getRolBadgeColor(usuario.rol)}`}
                    >
                      <Shield className="h-3 w-3 mr-1.5" />
                      <span className="capitalize">{usuario.rol}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {usuario.sucursal_nombre}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <span className="text-sm font-medium">{usuario.ultima_conexion}</span>
                  </TableCell>
                  <TableCell className="py-5 pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-2xl hover:bg-primary/10 text-primary"
                        onClick={() => handleOpenForm(usuario)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-2xl hover:bg-destructive/10 text-destructive/70"
                        onClick={() => {
                          setSelectedUsuario(usuario)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight">
              {isEditMode ? "Actualizar Perfil" : "Crear Acceso"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Correo Electrónico
                </Label>
                <Input
                  required
                  type="email"
                  className="h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary font-bold"
                  placeholder="usuario@cell.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {!isEditMode && (
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                    Contraseña
                  </Label>
                  <Input
                    required
                    type="password"
                    className="h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                    Rol Asignado
                  </Label>
                  <Select
                    value={formData.rol}
                    onValueChange={(value) => setFormData({ ...formData, rol: value as Role })}
                  >
                    <SelectTrigger className="h-12 bg-muted/40 border-none rounded-2xl focus:ring-primary font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl">
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="encargado">Encargado</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                    Sucursal Base
                  </Label>
                  <Select
                    value={formData.sucursal_id}
                    onValueChange={(value) => setFormData({ ...formData, sucursal_id: value })}
                  >
                    <SelectTrigger className="h-12 bg-muted/40 border-none rounded-2xl focus:ring-primary font-bold">
                      <SelectValue placeholder="Sede..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl">
                      {sucursales.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-2xl h-12 font-bold"
                onClick={() => setIsFormModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 rounded-2xl h-12 shadow-xl shadow-primary/20 font-black">
                {isEditMode ? "Guardar" : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black">¿Eliminar acceso?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Estás a punto de borrar permanentemente el acceso de{" "}
              <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                {selectedUsuario?.email}
              </span>
              . Esta acción desactivará inmediatamente al usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="flex-1 rounded-2xl h-12 border-none bg-muted/60 font-bold">
              Mantener
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 rounded-2xl h-12 bg-destructive hover:bg-destructive/90 text-white border-none font-bold"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function UsuariosPage() {
  return (
    <Suspense fallback={null}>
      <UsuariosContent />
    </Suspense>
  )
}
