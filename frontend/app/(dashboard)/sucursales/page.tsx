"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Pencil, Trash2, MapPin, Phone, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
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

interface Sucursal {
  id: string
  nombre: string
  direccion: string
  telefono: string
  activa: boolean
}

export default function SucursalesPage() {
  const [sucursalesList, setSucursalesList] = useState<Sucursal[]>([
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({ nombre: "", direccion: "", telefono: "" })

  const handleOpenForm = (sucursal?: Sucursal) => {
    if (sucursal) {
      setSelectedSucursal(sucursal)
      setFormData({
        nombre: sucursal.nombre,
        direccion: sucursal.direccion,
        telefono: sucursal.telefono,
      })
      setIsEditMode(true)
    } else {
      setSelectedSucursal(null)
      setFormData({ nombre: "", direccion: "", telefono: "" })
      setIsEditMode(false)
    }
    setIsFormModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedSucursal) {
      setSucursalesList(sucursalesList.map((s) => (s.id === selectedSucursal.id ? { ...s, ...formData } : s)))
    } else {
      const newSucursal = {
        id: (sucursalesList.length + 1).toString(),
        ...formData,
        activa: true,
      }
      setSucursalesList([...sucursalesList, newSucursal])
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = () => {
    if (selectedSucursal) {
      setSucursalesList(sucursalesList.filter((s) => s.id !== selectedSucursal.id))
      setIsDeleteDialogOpen(false)
      setSelectedSucursal(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Nuestras Sedes</h1>
          <p className="text-muted-foreground">Administración de puntos de venta y servicio técnico</p>
        </div>
        <Button
          className="h-11 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2"
          onClick={() => handleOpenForm()}
        >
          <Plus className="h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sucursalesList.map((sucursal) => (
          <Card
            key={sucursal.id}
            className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-md group hover:bg-white transition-all duration-500"
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-lg px-3 py-1 font-bold">
                  Operativa
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight">{sucursal.nombre}</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground leading-snug">
                    <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
                    <span className="font-medium">{sucursal.direccion}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary/60" />
                    <span className="font-bold">{sucursal.telefono}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-xl font-bold bg-accent/50 hover:bg-accent"
                    onClick={() => handleOpenForm(sucursal)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-11 w-11 hover:bg-destructive/10 text-destructive/70"
                    onClick={() => {
                      setSelectedSucursal(sucursal)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight">
              {isEditMode ? "Modificar Sede" : "Registrar Sede"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Nombre de la Sucursal
                </Label>
                <Input
                  required
                  className="h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary font-bold"
                  placeholder="Ej. Sucursal Premium"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Dirección Completa
                </Label>
                <Input
                  required
                  className="h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary font-bold"
                  placeholder="Calle, Ciudad, Zona..."
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                  Teléfono de Contacto
                </Label>
                <Input
                  required
                  type="tel"
                  className="h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-primary font-bold"
                  placeholder="+1 234-567-8900"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 rounded-2xl h-12 font-bold"
                onClick={() => setIsFormModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button type="submit" className="flex-1 rounded-2xl h-12 shadow-xl shadow-primary/20 font-black">
                {isEditMode ? "Actualizar" : "Guardar Sede"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black">¿Clausurar sucursal?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Estás por eliminar permanentemente la{" "}
              <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                {selectedSucursal?.nombre}
              </span>
              . Esta acción es irreversible y afectará a los usuarios vinculados.
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
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
