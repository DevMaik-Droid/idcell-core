"use client"
import { useState } from "react"
import { Plus, Search, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { cn } from "@/shared/lib/utils"

const celularesDisponibles = [
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S24+",
  "Samsung Galaxy S24",
  "Samsung Galaxy S23 Ultra",
  "Xiaomi 13 Pro",
  "Xiaomi 13",
  "Xiaomi 12 Pro",
  "Google Pixel 8 Pro",
  "Google Pixel 8",
]

const inventoryItems = [
  {
    id: 1,
    nombre: "iPhone 15 Pro Max",
    categoria: "Smartphones",
    stock: 12,
    precioVenta: 1199.0,
    precioCompra: 999.0,
    imagen: "/iphone-15-pro-max-titanium.png",
    descripcion: "Último modelo de Apple con chip A17 Pro",
    atributos: { color: "Titanio Azul", memoria: "256GB", estado: "Nuevo" },
    compatibilidad: [],
  },
  {
    id: 2,
    nombre: "Samsung Galaxy S24 Ultra",
    categoria: "Smartphones",
    stock: 8,
    precioVenta: 1099.0,
    precioCompra: 899.0,
    imagen: "/samsung-galaxy-s24-ultra-black.jpg",
    descripcion: "Potente smartphone con S Pen incluido",
    atributos: { color: "Negro Titanio", memoria: "512GB", estado: "Nuevo" },
    compatibilidad: [],
  },
  {
    id: 3,
    nombre: "Pantalla OLED para iPhone 14",
    categoria: "Repuestos",
    stock: 5,
    precioVenta: 180.0,
    precioCompra: 120.0,
    imagen: "/iphone-14-screen-replacement.jpg",
    descripcion: "Pantalla OLED original de alta calidad",
    atributos: { tipo: "OLED", calidad: "Original", garantia: "6 meses" },
    compatibilidad: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14"],
  },
  {
    id: 4,
    nombre: "AirPods Pro 2",
    categoria: "Accesorios",
    stock: 15,
    precioVenta: 249.0,
    precioCompra: 199.0,
    imagen: "/apple-airpods-pro-2-white.jpg",
    descripcion: "Audífonos con cancelación de ruido activa",
    atributos: { color: "Blanco", conectividad: "Bluetooth 5.3", bateria: "30h" },
    compatibilidad: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14", "iPhone 13"],
  },
  {
    id: 5,
    nombre: "Xiaomi 13 Pro",
    categoria: "Smartphones",
    stock: 10,
    precioVenta: 799.0,
    precioCompra: 649.0,
    imagen: "/xiaomi-13-pro-ceramic-white.jpg",
    descripcion: "Flagship de Xiaomi con cámara Leica",
    atributos: { color: "Blanco Cerámico", memoria: "256GB", estado: "Nuevo" },
    compatibilidad: [],
  },
  {
    id: 6,
    nombre: "Cargador USB-C 65W Universal",
    categoria: "Accesorios",
    stock: 25,
    precioVenta: 39.99,
    precioCompra: 25.0,
    imagen: "/usb-c-65w-fast-charger-white.jpg",
    descripcion: "Cargador rápido compatible con todos los dispositivos USB-C",
    atributos: { potencia: "65W", puertos: "2x USB-C", certificacion: "GaN" },
    compatibilidad: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15",
      "Samsung Galaxy S24 Ultra",
      "Samsung Galaxy S24+",
      "Samsung Galaxy S24",
      "Xiaomi 13 Pro",
      "Google Pixel 8 Pro",
    ],
  },
]

export default function InventarioPage() {
  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [compatibilidadEdit, setCompatibilidadEdit] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleEditCompatibility = (item: (typeof inventoryItems)[0]) => {
    setSelectedItem(item)
    setCompatibilidadEdit(item.compatibilidad || [])
    setIsEditMode(true)
  }

  const toggleCompatibilidad = (celular: string) => {
    if (compatibilidadEdit.includes(celular)) {
      setCompatibilidadEdit(compatibilidadEdit.filter((c) => c !== celular))
    } else {
      setCompatibilidadEdit([...compatibilidadEdit, celular])
    }
  }

  const guardarCompatibilidad = () => {
    if (!selectedItem) return
    console.log("[v0] Compatibilidad guardada para producto:", selectedItem.id, compatibilidadEdit)
    // Actualizar el item con la nueva compatibilidad
    selectedItem.compatibilidad = compatibilidadEdit
    setIsEditMode(false)
    setSelectedItem(null)
  }

  const filteredItems = inventoryItems.filter((item) => item.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu catálogo de productos y existencias</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
            onClick={() => {
              setSelectedItem(item)
              setIsEditMode(false)
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-muted">
              <Image
                src={item.imagen || "/placeholder.svg"}
                alt={item.nombre}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge
                  className={cn(
                    "font-semibold",
                    item.stock < 10 ? "bg-destructive text-destructive-foreground" : "bg-background/90 backdrop-blur",
                  )}
                >
                  {item.stock} u.
                </Badge>
              </div>
              {item.compatibilidad && item.compatibilidad.length > 0 && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur gap-1">
                    <Smartphone className="h-3 w-3" />
                    {item.compatibilidad.length}
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {item.nombre}
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {item.categoria}
                </Badge>
                <span className="text-lg font-bold text-primary">${item.precioVenta.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedItem && !isEditMode}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null)
            setIsEditMode(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={selectedItem.imagen || "/placeholder.svg"}
                    alt={selectedItem.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedItem.compatibilidad && selectedItem.compatibilidad.length > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Compatible con:</Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.compatibilidad.map((celular) => (
                        <Badge key={celular} variant="secondary" className="text-xs">
                          {celular}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedItem.nombre}</DialogTitle>
                  </DialogHeader>
                  <Badge variant="outline" className="mt-2">
                    {selectedItem.categoria}
                  </Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">{selectedItem.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Precio Venta</Label>
                    <p className="text-2xl font-bold text-primary">${selectedItem.precioVenta.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Stock</Label>
                    <p className="text-2xl font-bold">
                      {selectedItem.stock} <span className="text-sm font-normal text-muted-foreground">unidades</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="font-semibold">Especificaciones</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedItem.atributos).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground capitalize">{key}</Label>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button className="flex-1">Editar Producto</Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCompatibility(selectedItem)
                    }}
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Compatibilidad
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditMode}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditMode(false)
            setSelectedItem(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Configurar Compatibilidad
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold">{selectedItem.nombre}</p>
                <p className="text-sm text-muted-foreground">{selectedItem.categoria}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Selecciona los dispositivos compatibles:</Label>
                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto p-2">
                  {celularesDisponibles.map((celular) => (
                    <div key={celular} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={celular}
                        checked={compatibilidadEdit.includes(celular)}
                        onCheckedChange={() => toggleCompatibilidad(celular)}
                      />
                      <label htmlFor={celular} className="text-sm font-medium leading-none cursor-pointer flex-1">
                        {celular}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {compatibilidadEdit.length} dispositivo(s) seleccionado(s)
                </p>
                <Button onClick={guardarCompatibilidad}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
