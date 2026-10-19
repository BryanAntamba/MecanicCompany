// InventarioGuard.tsx
// Guardian específico para proteger rutas de inventario
// Usa AuthGuard + RoleGuard con rol === 'inventario'

import { AuthGuard, RoleGuard } from '@/components/guards';

interface InventarioGuardProps {
  children: React.ReactNode;
}

export default function InventarioGuard({ children }: InventarioGuardProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['inventario']}>
        {children}
      </RoleGuard>
    </AuthGuard>
  );
}
