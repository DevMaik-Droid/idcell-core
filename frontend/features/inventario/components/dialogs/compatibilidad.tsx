import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";

interface dialogProps {
  isCompatibilityMode: boolean;
  setIsCompatibilityMode: (value: boolean) => void;
  selectedItem: (typeof inventoryItems)[0] | null;
  compatibilidadEdit: string[];
  toggleCompatibilidad: (celular: string) => void;
  guardarCompatibilidad: () => void;
  celularesDisponibles: string[];
}

const DialogCompatibilidad = ({
  isCompatibilityMode,
  setIsCompatibilityMode,
  celularesDisponibles,
  selectedItem,
  compatibilidadEdit,
  toggleCompatibilidad,
  guardarCompatibilidad,
}: dialogProps) => {
  return (
    <Dialog open={isCompatibilityMode} onOpenChange={setIsCompatibilityMode}>
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
              <p className="text-sm text-muted-foreground">
                {selectedItem.categoria}
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Selecciona los dispositivos compatibles:
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto p-2">
                {celularesDisponibles.map((celular) => (
                  <div
                    key={celular}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      id={celular}
                      checked={compatibilidadEdit.includes(celular)}
                      onCheckedChange={() => toggleCompatibilidad(celular)}
                    />
                    <label
                      htmlFor={celular}
                      className="text-sm font-medium leading-none cursor-pointer flex-1"
                    >
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
  );
};

export default DialogCompatibilidad;
