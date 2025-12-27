"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, Smartphone, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/shared/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DialogCompatibilidad from "@/features/inventario/components/dialogs/compatibilidad"
import DialogViewProduct from "@/features/inventario/components/dialogs/view-product"
import DialogRegisterProduct from "@/features/inventario/components/dialogs/register-product"

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
  const { sucursal } = useAuth()
  const [items, setItems] = useState(inventoryItems)
  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isCompatibilityMode, setIsCompatibilityMode] = useState(false)
  const [compatibilidadEdit, setCompatibilidadEdit] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "Accesorios",
    stock: 0,
    precioVenta: 0,
    precioCompra: 0,
    descripcion: "",
    imagen: "/placeholder.svg",
    atributos: {} as Record<string, string>,
  })

  const handleOpenForm = (item?: (typeof inventoryItems)[0]) => {
    if (item) {
      setSelectedItem(item)
      setFormData({
        nombre: item.nombre,
        categoria: item.categoria,
        stock: item.stock,
        precioVenta: item.precioVenta,
        precioCompra: item.precioCompra,
        descripcion: item.descripcion,
        imagen: item.imagen,
        atributos: { ...item.atributos },
      })
      setIsEditMode(true)
    } else {
      setSelectedItem(null)
      setFormData({
        nombre: "",
        categoria: "Accesorios",
        stock: 0,
        precioVenta: 0,
        precioCompra: 0,
        descripcion: "",
        imagen: "/placeholder.svg",
        atributos: {},
      })
      setIsEditMode(false)
    }
    setIsFormModalOpen(true)
  }

  const handleDelete = () => {
    if (selectedItem) {
      setItems(items.filter((i) => i.id !== selectedItem.id))
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && selectedItem) {
      setItems(items.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i)))
    } else {
      const newItem = {
        id: Math.max(...items.map((i) => i.id)) + 1,
        ...formData,
        compatibilidad: [],
      }
      setItems([...items, newItem])
    }
    setIsFormModalOpen(false)
  }

  const handleEditCompatibility = (item: (typeof inventoryItems)[0]) => {
    setSelectedItem(item)
    setCompatibilidadEdit(item.compatibilidad || [])
    setIsCompatibilityMode(true)
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
    setItems(items.map((i) => (i.id === selectedItem.id ? { ...i, compatibilidad: compatibilidadEdit } : i)))
    setIsCompatibilityMode(false)
    setSelectedItem(null)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Catálogo Maestro</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de inventario premium • <span className="font-medium text-primary">{sucursal?.nombre}</span>
          </p>
        </div>
        <Button
          className="h-11 px-6 shadow-sm hover:shadow-md transition-all gap-2 rounded-full"
          onClick={() => handleOpenForm()}
        >
          <Plus className="h-4 w-4" />
          Registrar Producto
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
            onClick={() => {
              setSelectedItem(item)
              setIsViewModalOpen(true)
            }}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={item.imagen || "/placeholder.svg"}
                alt={item.nombre}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-foreground backdrop-blur-md border-none px-3 py-1 shadow-sm">
                  {item.stock} disponibles
                </Badge>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  {item.categoria}
                </span>
                <h3 className="text-lg font-medium leading-snug group-hover:text-primary transition-colors">
                  {item.nombre}
                </h3>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xl font-light">${item.precioVenta.toLocaleString()}</span>
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenForm(item)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedItem(item)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <DialogViewProduct
        isViewModalOpen={isViewModalOpen}
        handleOpenForm={handleOpenForm}
        handleEditCompatibility={handleEditCompatibility}
        setIsViewModalOpen={setIsViewModalOpen}
        selectedItem={selectedItem}
      />


      <DialogRegisterProduct
        isFormModalOpen={isFormModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        isEditMode={isEditMode}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />

      <DialogCompatibilidad
        isCompatibilityMode={isCompatibilityMode}
        setIsCompatibilityMode={setIsCompatibilityMode}
        selectedItem={selectedItem}
        compatibilidadEdit={compatibilidadEdit}
        toggleCompatibilidad={toggleCompatibilidad}
        guardarCompatibilidad={guardarCompatibilidad}
        celularesDisponibles={celularesDisponibles}
      />


      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto "{selectedItem?.nombre}" permanentemente del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
