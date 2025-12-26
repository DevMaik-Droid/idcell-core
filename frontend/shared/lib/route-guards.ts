import type { Role } from "@/shared/hooks/use-auth"

export const routePermissions: Record<string, Role[]> = {
  "/dashboard": ["admin", "encargado", "tecnico", "vendedor"],
  "/inventario": ["admin", "encargado", "vendedor"],
  "/ventas": ["admin", "encargado", "vendedor"],
  "/reparaciones": ["admin", "encargado", "tecnico"],
  "/clientes": ["admin", "encargado", "vendedor"],
  "/usuarios": ["admin"],
  "/sucursales": ["admin"],
}

export function canAccessRoute(rol: Role, route: string): boolean {
  // Encontrar la base de la ruta (ej. /inventario/nuevo -> /inventario)
  const baseRoute = Object.keys(routePermissions).find((r) => route.startsWith(r))

  if (!baseRoute) return true // Rutas públicas o no definidas

  const allowedRoles = routePermissions[baseRoute]
  return allowedRoles.includes(rol)
}
