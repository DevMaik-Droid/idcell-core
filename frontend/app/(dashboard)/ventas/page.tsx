"use client"

import { useState, useMemo, Suspense } from "react"
import { ShoppingCart, TrendingUp, DollarSign, Package, Search, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

const productos = [
  {
    id: 1,
    nombre: "iPhone 15 Pro Max",
    categoria: "Smartphones",
    precio: 1199,
    stock: 12,
    imagen: "/iphone-15-pro-max-titanium.png",
  },
  {
    id: 2,
    nombre: "Samsung Galaxy S24 Ultra",
    categoria: "Smartphones",
    precio: 1099,
    stock: 8,
    imagen: "/samsung-galaxy-s24-ultra-black.jpg",
  },
  {
    id: 3,
    nombre: "AirPods Pro 2",
    categoria: "Accesorios",
    precio: 249,
    stock: 15,
    imagen: "/apple-airpods-pro-2-white.jpg",
  },
  {
    id: 4,
    nombre: "Xiaomi 13 Pro",
    categoria: "Smartphones",
    precio: 799,
    stock: 10,
    imagen: "/xiaomi-13-pro-ceramic-white.jpg",
  },
  {
    id: 5,
    nombre: "Pantalla iPhone 14",
    categoria: "Repuestos",
    precio: 180,
    stock: 5,
    imagen: "/iphone-14-screen-replacement.jpg",
  },
  {
    id: 6,
    nombre: "Cargador USB-C 65W",
    categoria: "Accesorios",
    precio: 39.99,
    stock: 25,
    imagen: "/usb-c-65w-fast-charger-white.jpg",
  },
]

const ventasHistorial = [
  {
    id: "V-1024",
    fecha: "2024-03-20 14:30",
    cliente: "Mostrador",
    productos: "iPhone 15 (1), Case (2)",
    vendedor: "admin",
    total: 950,
  },
  {
    id: "V-1023",
    fecha: "2024-03-20 12:15",
    cliente: "Juan Pérez",
    productos: "Samsung S24 (1)",
    vendedor: "admin",
    total: 1099,
  },
  {
    id: "V-1022",
    fecha: "2024-03-20 10:45",
    cliente: "Mostrador",
    productos: "AirPods Pro (1)",
    vendedor: "encargado",
    total: 249,
  },
]

function VentasContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<(typeof productos)[0] | null>(null)
  const [cart, setCart] = useState<Array<{ product: (typeof productos)[0]; quantity: number }>>([])

  const filteredProducts = useMemo(() => {
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const addToCart = (product: (typeof productos)[0]) => {
    const existing = cart.find((item) => item.product.id === product.id)
    if (existing) {
      setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0)

  const handleCompleteSale = () => {
    console.log("[v0] Venta completada:", { cart, total: cartTotal })
    setCart([])
    alert(`Venta completada por $${cartTotal.toFixed(2)}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
        <p className="text-muted-foreground mt-1">Sistema de punto de venta y registro de operaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+3 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,420</div>
            <p className="text-xs text-muted-foreground mt-1">+12% desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$701</div>
            <p className="text-xs text-muted-foreground mt-1">-2% desde ayer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Buscar Productos
            </CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer rounded-lg border p-3 transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-muted mb-3">
                    <Image
                      src={product.imagen || "/placeholder.svg"}
                      alt={product.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {product.nombre}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">${product.precio}</p>
                      <Badge variant={product.stock > 10 ? "secondary" : "destructive"} className="text-xs">
                        {product.stock} u.
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Carrito vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imagen || "/placeholder.svg"}
                        alt={item.product.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.nombre}</p>
                      <p className="text-xs text-muted-foreground">${item.product.precio}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
              >
                Completar Venta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasHistorial.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-mono text-xs">#{venta.id}</TableCell>
                  <TableCell className="text-sm">{venta.fecha}</TableCell>
                  <TableCell>
                    {venta.cliente === "Mostrador" ? (
                      <Badge variant="outline">Mostrador</Badge>
                    ) : (
                      <span className="text-sm">{venta.cliente}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{venta.productos}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{venta.vendedor}</TableCell>
                  <TableCell className="text-right font-semibold">${venta.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProduct && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>{selectedProduct.nombre}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={selectedProduct.imagen || "/placeholder.svg"}
                    alt={selectedProduct.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Categoría</p>
                    <Badge>{selectedProduct.categoria}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precio</p>
                    <p className="text-3xl font-bold text-primary">${selectedProduct.precio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Disponibilidad</p>
                    <p className="text-lg font-semibold">
                      {selectedProduct.stock} unidades{" "}
                      <Badge variant={selectedProduct.stock > 10 ? "secondary" : "destructive"} className="ml-2">
                        {selectedProduct.stock > 10 ? "En Stock" : "Bajo Stock"}
                      </Badge>
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      addToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function VentasPage() {
  return (
    <Suspense fallback={null}>
      <VentasContent />
    </Suspense>
  )
}
