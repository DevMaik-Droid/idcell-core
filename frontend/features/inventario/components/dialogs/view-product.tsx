"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DialogViewProductProps {
    isViewModalOpen: boolean;
    setIsViewModalOpen: (open: boolean) => void;
    selectedItem: (typeof inventoryItems)[0] | null;
    handleOpenForm: (item: (typeof inventoryItems)[0]) => void;
    handleEditCompatibility: (item: (typeof inventoryItems)[0]) => void;
}


const DialogViewProduct = ({ isViewModalOpen, setIsViewModalOpen, selectedItem, handleOpenForm, handleEditCompatibility }: DialogViewProductProps) => {
  return (
    <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
                  <Button className="flex-1" onClick={() => handleOpenForm(selectedItem)}>
                    Editar Producto
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => handleEditCompatibility(selectedItem)}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Compatibilidad
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
  )
}

export default DialogViewProduct;