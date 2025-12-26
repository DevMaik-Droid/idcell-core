"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/shared/hooks/use-auth"

interface Sucursal {
  id: string
  nombre: string
  direccion: string
  telefono: string
  activa: boolean
}

export default function SucursalesPage() {
  const { token } = useAuth()
  const [sucursales, setSucursales] = useState<Sucursal[]>([
    {
      id: "1",
      nombre: "Sucursal Centro",
      direccion: "Av. Principal 123, Centro",
      telefono: "+1 234-567-8900",
      activa: true,
    },
    {
      id: "2",
      nombre: "Sucursal Norte",
      direccion: "Calle Norte 456, Zona Norte",
      telefono: "+1 234-567-8901",
      activa: true,
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", direccion: "", telefono: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with API POST /sucursales
    console.log("[v0] Creating sucursal:", formData)
    setIsDialogOpen(false)
    setFormData({ nombre: "", direccion: "", telefono: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sucursales</h1>
          <p className="text-muted-foreground">Administra las sucursales de tu negocio.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Sucursal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  required
                  placeholder="Ej. Sucursal Centro"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  required
                  placeholder="Ej. Av. Principal 123"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  required
                  type="tel"
                  placeholder="+1 234-567-8900"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar Sucursal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sucursales.map((sucursal) => (
              <TableRow key={sucursal.id}>
                <TableCell className="font-medium">{sucursal.nombre}</TableCell>
                <TableCell>{sucursal.direccion}</TableCell>
                <TableCell>{sucursal.telefono}</TableCell>
                <TableCell>
                  <Badge className={sucursal.activa ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {sucursal.activa ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
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
