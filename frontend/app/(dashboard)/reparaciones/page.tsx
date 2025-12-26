"use client"

import { useState } from "react"
import { Plus, Eye, Wrench, Clock, CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReparacion, setSelectedReparacion] = useState<Reparacion | null>(null)
  const [componentesModal, setComponentesModal] = useState<ComponenteUsado[]>([])

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
    console.log("[v0] Componentes guardados para reparación:", selectedReparacion.id, componentesModal)
    setSelectedReparacion(null)
    setComponentesModal([])
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

  const stats = {
    pendientes: reparaciones.filter((r) => r.estado === "pendiente").length,
    en_proceso: reparaciones.filter((r) => r.estado === "en_proceso").length,
    terminadas: reparaciones.filter((r) => r.estado === "terminado").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reparaciones</h1>
          <p className="text-muted-foreground mt-1">Gestión de órdenes de servicio técnico</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Reparación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Orden de Reparación</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setIsDialogOpen(false)
              }}
              className="grid gap-4 py-4"
            >
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Juan Pérez - +1234567890</SelectItem>
                    <SelectItem value="2">Maria G. - +0987654321</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipo</Label>
                <Input required placeholder="Ej. iPhone 13 Pro" />
              </div>
              <div className="space-y-2">
                <Label>Problema Reportado</Label>
                <textarea
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Descripción del fallo..."
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Estimado (Opcional)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <Button type="submit" className="w-full">
                Generar Orden
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Proceso</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.en_proceso}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terminadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terminadas}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
                <TableHead>Problema</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Componentes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reparaciones.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-mono text-xs">#{rep.id}</TableCell>
                  <TableCell className="font-medium">{rep.cliente_nombre}</TableCell>
                  <TableCell className="text-sm">{rep.equipo}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {rep.problema_reportado}
                  </TableCell>
                  <TableCell>{getEstadoBadge(rep.estado)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rep.tecnico_nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Package className="h-3 w-3" />
                      {rep.componentes_usados.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedReparacion(rep)
                        setComponentesModal(rep.componentes_usados)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReparacion} onOpenChange={(open) => !open && setSelectedReparacion(null)}>
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
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-semibold">{selectedReparacion.cliente_nombre}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Equipo</Label>
                  <p className="font-semibold">{selectedReparacion.equipo}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Estado</Label>
                  <div>{getEstadoBadge(selectedReparacion.estado)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Técnico Asignado</Label>
                  <p className="font-semibold">{selectedReparacion.tecnico_nombre}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Problema Reportado</Label>
                <p className="text-sm">{selectedReparacion.problema_reportado}</p>
              </div>

              {selectedReparacion.diagnostico && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Diagnóstico</Label>
                  <p className="text-sm">{selectedReparacion.diagnostico}</p>
                </div>
              )}

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Componentes Utilizados</Label>
                  <Select onValueChange={agregarComponente}>
                    <SelectTrigger className="w-[250px]">
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

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {componentesModal.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No hay componentes registrados aún</p>
                  ) : (
                    componentesModal.map((comp) => (
                      <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{comp.nombre}</p>
                          <p className="text-xs text-muted-foreground">${comp.precio} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => actualizarCantidad(comp.id, comp.cantidad - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-semibold">{comp.cantidad}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => actualizarCantidad(comp.id, comp.cantidad + 1)}
                          >
                            +
                          </Button>
                          <span className="ml-2 font-semibold text-primary">${comp.precio * comp.cantidad}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold">Total Componentes</span>
                  <span className="text-xl font-bold text-primary">
                    ${componentesModal.reduce((sum, c) => sum + c.precio * c.cantidad, 0).toFixed(2)}
                  </span>
                </div>

                <Button className="w-full" onClick={guardarComponentes}>
                  Guardar Componentes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
