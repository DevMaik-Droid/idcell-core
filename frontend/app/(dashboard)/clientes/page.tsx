"use client"

import { Label } from "@/components/ui/label"
import { Suspense } from "react"

import type React from "react"
import { useState } from "react"
import { Plus, Pencil, Trash2, Phone, Mail, Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
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

interface Cliente {
  id: string
  nombre: string
  telefono: string
  email?: string
  direccion?: string
  ultima_visita?: string
}

function ClientesContent() {
  const { sucursal } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "1",
      nombre: "Juan Pérez",
      telefono: "+1 234-567-8900",
      email: "juan.perez@email.com",
      direccion: "Calle Principal 123",
      ultima_visita: "2024-03-20",
    },
    {
      id: "2",
      nombre: "Maria González",
      telefono: "+1 234-567-8901",
      email: "maria.g@email.com",
      ultima_visita: "2024-03-19",
    },
    {
      id: "3",
      nombre: "Carlos Ruiz",
      telefono: "+1 234-567-8902",
      email: "carlos.ruiz@email.com",
      direccion: "Av. Norte 456",
      ultima_visita: "2024-03-15",
    },
  ])

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
  })

  const handleOpenForm = (cliente?: Cliente) => {
    if (cliente) {
      setSelectedCliente(cliente)
      setFormData({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email || "",
        direccion: cliente.direccion || "",
      })
      setIsEditMode(true)
    } else {
      setSelectedCliente(null)
      setFormData({ nombre: "", telefono: "", email: "", direccion: "" })
      setIsEditMode(false)
    }
    setIsFormModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedCliente) {
      setClientes(clientes.map((c) => (c.id === selectedCliente.id ? { ...c, ...formData } : c)))
    } else {
      const newCliente = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        ultima_visita: new Date().toISOString().split("T")[0],
      }
      setClientes([...clientes, newCliente])
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = () => {
    if (selectedCliente) {
      setClientes(clientes.filter((c) => c.id !== selectedCliente.id))
      setIsDeleteDialogOpen(false)
      setSelectedCliente(null)
    }
  }

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.telefono.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight">Directorio de Clientes</h1>
          <p className="text-muted-foreground">
            Gestión centralizada para <span className="text-primary font-medium">{sucursal?.nombre}</span>
          </p>
        </div>
        <Button
          className="h-11 px-8 rounded-full shadow-lg hover:shadow-xl transition-all gap-2"
          onClick={() => handleOpenForm()}
        >
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 h-11 rounded-xl bg-white shadow-sm border-muted-foreground/10"
          placeholder="Buscar por nombre, teléfono o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border-none shadow-xl shadow-black/5 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-4 pl-6 text-xs uppercase tracking-wider font-bold">Nombre</TableHead>
                <TableHead className="py-4 text-xs uppercase tracking-wider font-bold">Contacto</TableHead>
                <TableHead className="py-4 text-xs uppercase tracking-wider font-bold">Dirección</TableHead>
                <TableHead className="py-4 text-xs uppercase tracking-wider font-bold">Última Visita</TableHead>
                <TableHead className="py-4 pr-6 text-right text-xs uppercase tracking-wider font-bold">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="group hover:bg-primary/[0.02] transition-colors border-muted/20">
                  <TableCell className="py-4 pl-6">
                    <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {cliente.nombre}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-primary/70" />
                        <span className="font-medium">{cliente.telefono}</span>
                      </div>
                      {cliente.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {cliente.direccion ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[200px]">{cliente.direccion}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50 italic">Sin dirección</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{cliente.ultima_visita || "No registrada"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-accent/50 hover:bg-accent"
                        onClick={() => handleOpenForm(cliente)}
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-destructive/10 text-destructive/70 hover:text-destructive"
                        onClick={() => {
                          setSelectedCliente(cliente)
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
          {filteredClientes.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">No se encontraron clientes para esta búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {isEditMode ? "Actualizar Perfil" : "Nuevo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                  Nombre Completo
                </Label>
                <Input
                  required
                  className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Teléfono</Label>
                  <Input
                    required
                    type="tel"
                    className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                    placeholder="+1 234-567-8900"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                    placeholder="cliente@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                  Dirección Física
                </Label>
                <Input
                  className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                  placeholder="Calle Principal 123"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-xl h-12"
                onClick={() => setIsFormModalOpen(false)}
              >
                Descartar
              </Button>
              <Button type="submit" className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20">
                {isEditMode ? "Guardar Cambios" : "Registrar Cliente"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl p-8 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black">¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              Esta acción borrará permanentemente a{" "}
              <span className="font-bold text-foreground">{selectedCliente?.nombre}</span> de la base de datos de
              clientes. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl h-12 border-none bg-muted/50 hover:bg-muted">
              Mantener Cliente
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 rounded-xl h-12 bg-destructive hover:bg-destructive/90 text-white border-none"
            >
              Eliminar Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ClientesPage() {
  return (
    <Suspense fallback={null}>
      <ClientesContent />
    </Suspense>
  )
}
