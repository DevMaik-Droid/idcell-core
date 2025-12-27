"use client";
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'

interface dialogProps {
  isFormModalOpen: boolean;
  setIsFormModalOpen: (value: boolean) => void;
  isEditMode: boolean;
  handleSave: () => void;
  formData: any;
  setFormData: (value: any) => void;
}

const DialogRegisterProduct = ({
  isFormModalOpen,
  setIsFormModalOpen,
  isEditMode,
  handleSave,
  formData,
  setFormData,
}: dialogProps) => {
    
  return (
    <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  value={formData?.nombre || ""}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData?.categoria}
                  onValueChange={(val) => setFormData({ ...formData, categoria: val })}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Repuestos">Repuestos</SelectItem>
                    <SelectItem value="Accesorios">Accesorios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Inicial</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData?.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioCompra">Precio Compra ($)</Label>
                <Input
                  id="precioCompra"
                  type="number"
                  step="0.01"
                  value={formData?.precioCompra}
                  onChange={(e) => setFormData({ ...formData, precioCompra: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioVenta">Precio Venta ($)</Label>
                <Input
                  id="precioVenta"
                  type="number"
                  step="0.01"
                  value={formData?.precioVenta}
                  onChange={(e) => setFormData({ ...formData, precioVenta: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData?.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEditMode ? "Guardar Cambios" : "Crear Producto"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default DialogRegisterProduct