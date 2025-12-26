// features/inventario/services.ts
import { apiClient } from "@/shared/lib/api-client"
import { Producto } from "./types"

export async function getProductos(sucursalId: string) {
  const { data } = await apiClient.get<Producto[]>(
    `/inventario?sucursal_id=${sucursalId}`
  )
  return data
}
