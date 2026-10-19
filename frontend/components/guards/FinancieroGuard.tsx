// FinancieroGuard.tsx
// Guardian específico para proteger rutas de financiero
// Usa AuthGuard + RoleGuard con rol === 'financiero'

import { AuthGuard, RoleGuard } from '@/components/guards';

interface FinancieroGuardProps {
  children: React.ReactNode;
}

export default function FinancieroGuard({ children }: FinancieroGuardProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['financiero']}>
        {children}
      </RoleGuard>
    </AuthGuard>
  );
}
