// features/inventario/hooks.ts
import { useQuery } from "@tanstack/react-query"
import { getProductos } from "./services"

export function useProductos(sucursalId: string) {
  return useQuery({
    queryKey: ["productos", sucursalId],
    queryFn: () => getProductos(sucursalId),
    staleTime: 1000 * 60 * 5,
  })
}
