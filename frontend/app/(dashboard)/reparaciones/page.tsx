"use client"

import { useState } from "react"
import type React from "react"
import { Plus, Eye, Wrench, Clock, CheckCircle, Package, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/shared/hooks/use-auth"
import { Textarea } from "@/components/ui/textarea"
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

type EstadoReparacion = "pendiente" | "en_proceso" | "terminado" | "entregado"

interface ComponenteUsado {
  id: string
  nombre: string
  cantidad: number
  precio: number
}

interface Reparacion {
  id: string
  cliente_nombre: string
  equipo: string
  problema_reportado: string
  diagnostico?: string
  estado: EstadoReparacion
  tecnico_nombre: string
  costo_estimado?: number
  fecha_creacion: string
  componentes_usados: ComponenteUsado[]
}

const componentesDisponibles = [
  { id: "1", nombre: "Pantalla iPhone 14", precio: 180 },
  { id: "2", nombre: "Batería iPhone 13", precio: 80 },
  { id: "3", nombre: "Cámara trasera Samsung S21", precio: 120 },
  { id: "4", nombre: "Conector de carga USB-C", precio: 25 },
  { id: "5", nombre: "Botón de encendido", precio: 15 },
  { id: "6", nombre: "Altavoz interno", precio: 30 },
]

export default function ReparacionesPage() {
  const { sucursal } = useAuth()
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([
    {
      id: "REP-55",
      cliente_nombre: "Juan Pérez",
      equipo: "Xiaomi Note 11",
      problema_reportado: "Pantalla rota",
      diagnostico: "Reemplazo de display completo",
      estado: "en_proceso",
      tecnico_nombre: "Carlos Ruiz",
      costo_estimado: 120,
      fecha_creacion: "2024-03-20T14:30:00",
      componentes_usados: [{ id: "1", nombre: "Pantalla iPhone 14", cantidad: 1, precio: 180 }],
    },
    {
      id: "REP-54",
      cliente_nombre: "Maria G.",
      equipo: "iPad Air 4",
      problema_reportado: "No carga",
      estado: "pendiente",
      tecnico_nombre: "Ana Torres",
      fecha_creacion: "2024-03-19T10:15:00",
      componentes_usados: [],
    },
    {
      id: "REP-53",
      cliente_nombre: "Pedro López",
      equipo: "iPhone 12",
      problema_reportado: "Batería agotada rápidamente",
      diagnostico: "Reemplazo de batería",
      estado: "terminado",
      tecnico_nombre: "Carlos Ruiz",
      costo_estimado: 80,
      fecha_creacion: "2024-03-18T09:00:00",
      componentes_usados: [{ id: "2", nombre: "Batería iPhone 13", cantidad: 1, precio: 80 }],
    },
  ])

  const [selectedReparacion, setSelectedReparacion] = useState<Reparacion | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [componentesModal, setComponentesModal] = useState<ComponenteUsado[]>([])

  const [formData, setFormData] = useState({
    cliente_nombre: "",
    equipo: "",
    problema_reportado: "",
    diagnostico: "",
    estado: "pendiente" as EstadoReparacion,
    tecnico_nombre: "",
    costo_estimado: 0,
  })

  const handleOpenForm = (rep?: Reparacion) => {
    if (rep) {
      setSelectedReparacion(rep) // Used for logic consistency
      setFormData({
        cliente_nombre: rep.cliente_nombre,
        equipo: rep.equipo,
        problema_reportado: rep.problema_reportado,
        diagnostico: rep.diagnostico || "",
        estado: rep.estado,
        tecnico_nombre: rep.tecnico_nombre,
        costo_estimado: rep.costo_estimado || 0,
      })
      setIsEditMode(true)
    } else {
      setSelectedReparacion(null)
      setFormData({
        cliente_nombre: "",
        equipo: "",
        problema_reportado: "",
        diagnostico: "",
        estado: "pendiente",
        tecnico_nombre: "",
        costo_estimado: 0,
      })
      setIsEditMode(false)
    }
    setIsFormModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedReparacion) {
      setReparaciones(reparaciones.map((r) => (r.id === selectedReparacion.id ? { ...r, ...formData } : r)))
    } else {
      const newRep = {
        id: `REP-${Math.floor(Math.random() * 1000)}`,
        ...formData,
        fecha_creacion: new Date().toISOString(),
        componentes_usados: [],
      }
      setReparaciones([...reparaciones, newRep])
    }
    setIsFormModalOpen(false)
  }

  const handleDelete = () => {
    if (selectedReparacion) {
      setReparaciones(reparaciones.filter((r) => r.id !== selectedReparacion.id))
      setIsDeleteDialogOpen(false)
      setSelectedReparacion(null)
    }
  }

  const agregarComponente = (componenteId: string) => {
    const componente = componentesDisponibles.find((c) => c.id === componenteId)
    if (!componente) return

    const existente = componentesModal.find((c) => c.id === componenteId)
    if (existente) {
      setComponentesModal(componentesModal.map((c) => (c.id === componenteId ? { ...c, cantidad: c.cantidad + 1 } : c)))
    } else {
      setComponentesModal([...componentesModal, { ...componente, cantidad: 1 }])
    }
  }

  const actualizarCantidad = (componenteId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setComponentesModal(componentesModal.filter((c) => c.id !== componenteId))
    } else {
      setComponentesModal(componentesModal.map((c) => (c.id === componenteId ? { ...c, cantidad } : c)))
    }
  }

  const guardarComponentes = () => {
    if (!selectedReparacion) return
    setReparaciones(
      reparaciones.map((r) => (r.id === selectedReparacion.id ? { ...r, componentes_usados: componentesModal } : r)),
    )
    setSelectedReparacion(null)
    setComponentesModal([])
    setIsViewModalOpen(false)
  }

  const getEstadoBadge = (estado: EstadoReparacion) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-warning/20 text-warning-foreground border-warning">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "en_proceso":
        return (
          <Badge className="bg-primary/20 text-primary border-primary">
            <Wrench className="h-3 w-3 mr-1" />
            En Proceso
          </Badge>
        )
      case "terminado":
        return (
          <Badge className="bg-success/20 text-success-foreground border-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terminado
          </Badge>
        )
      case "entregado":
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            Entregado
          </Badge>
        )
    }
  }

  const currentReparaciones = reparaciones.filter((r) => (sucursal?.id === "1" ? true : r.id.includes("55")))

  const stats = {
    pendientes: currentReparaciones.filter((r) => r.estado === "pendiente").length,
    en_proceso: currentReparaciones.filter((r) => r.estado === "en_proceso").length,
    terminadas: currentReparaciones.filter((r) => r.estado === "terminado").length,
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-light tracking-tight">Servicio Técnico</h1>
          <p className="text-muted-foreground">
            Monitoreo de órdenes en <span className="text-primary font-medium">{sucursal?.nombre}</span>
          </p>
        </div>
        <Button
          className="h-11 px-8 rounded-full shadow-sm hover:shadow-md transition-all gap-2"
          onClick={() => handleOpenForm()}
        >
          <Plus className="h-4 w-4" />
          Registrar Reparación
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-none border-border/60 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Diagnóstico</span>
              <Clock className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{stats.pendientes}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Órdenes esperando revisión</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border/60 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">En Proceso</span>
              <Wrench className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{stats.en_proceso}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Órdenes en curso de reparación</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-border/60 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Terminadas</span>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{stats.terminadas}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Órdenes finalizadas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-none overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle>Órdenes de Reparación</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Componentes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReparaciones.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-mono text-xs">#{rep.id}</TableCell>
                  <TableCell className="font-medium">{rep.cliente_nombre}</TableCell>
                  <TableCell className="text-sm">{rep.equipo}</TableCell>
                  <TableCell>{getEstadoBadge(rep.estado)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Package className="h-3 w-3" />
                      {rep.componentes_usados.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedReparacion(rep)
                          setComponentesModal(rep.componentes_usados)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(rep)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          setSelectedReparacion(rep)
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

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedReparacion && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Detalle de Reparación #{selectedReparacion.id}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Cliente</Label>
                  <p className="font-semibold">{selectedReparacion.cliente_nombre}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Equipo</Label>
                  <p className="font-semibold">{selectedReparacion.equipo}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Estado</Label>
                  <div>{getEstadoBadge(selectedReparacion.estado)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Técnico Asignado</Label>
                  <p className="font-semibold">{selectedReparacion.tecnico_nombre}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase">Problema Reportado</Label>
                <p className="text-sm bg-muted/30 p-3 rounded-md">{selectedReparacion.problema_reportado}</p>
              </div>

              {selectedReparacion.diagnostico && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Diagnóstico</Label>
                  <p className="text-sm bg-muted/30 p-3 rounded-md italic">{selectedReparacion.diagnostico}</p>
                </div>
              )}

              <div className="space-y-4 border-t pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <Label className="text-base font-semibold">Componentes Utilizados</Label>
                  <Select onValueChange={agregarComponente}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Agregar componente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {componentesDisponibles.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.nombre} - ${comp.precio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {componentesModal.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 bg-muted/20 rounded-lg">
                      No hay componentes registrados
                    </p>
                  ) : (
                    componentesModal.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{comp.nombre}</p>
                          <p className="text-xs text-muted-foreground">${comp.precio} c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 bg-transparent border-muted-foreground/20"
                              onClick={() => actualizarCantidad(comp.id, comp.cantidad - 1)}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center font-semibold">{comp.cantidad}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 bg-transparent border-muted-foreground/20"
                              onClick={() => actualizarCantidad(comp.id, comp.cantidad + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <span className="w-16 text-right font-bold text-primary">
                            ${(comp.precio * comp.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t px-1">
                  <span className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                    Total Componentes
                  </span>
                  <span className="text-2xl font-black text-primary">
                    ${componentesModal.reduce((sum, c) => sum + c.precio * c.cantidad, 0).toFixed(2)}
                  </span>
                </div>

                <Button className="w-full h-11 rounded-xl shadow-lg" onClick={guardarComponentes}>
                  Actualizar Registro de Partes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Modificar Orden" : "Nueva Orden de Servicio"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Nombre del Cliente</Label>
                <Input
                  required
                  placeholder="Ej. Juan Pérez"
                  value={formData.cliente_nombre}
                  onChange={(e) => setFormData({ ...formData, cliente_nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Equipo</Label>
                <Input
                  required
                  placeholder="Ej. iPhone 13 Pro"
                  value={formData.equipo}
                  onChange={(e) => setFormData({ ...formData, equipo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Técnico Asignado</Label>
                <Input
                  required
                  placeholder="Ej. Carlos Ruiz"
                  value={formData.tecnico_nombre}
                  onChange={(e) => setFormData({ ...formData, tecnico_nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado Inicial</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(val) => setFormData({ ...formData, estado: val as EstadoReparacion })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="terminado">Terminado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Costo Estimado ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.costo_estimado}
                  onChange={(e) => setFormData({ ...formData, costo_estimado: Number(e.target.value) })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Problema Reportado</Label>
                <Textarea
                  required
                  placeholder="Descripción detallada del fallo..."
                  value={formData.problema_reportado}
                  onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Diagnóstico Técnico</Label>
                <Textarea
                  placeholder="Resultados de la revisión inicial..."
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEditMode ? "Actualizar Orden" : "Generar Orden"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente la orden #{selectedReparacion?.id} del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
