// _layout.tsx (SeccionMecanico)
// Layout del grupo SeccionMecanico: oculta el header nativo en todas las pantallas del panel del mecánico
// Protegido con AuthGuard (requiere token) y RoleGuard (requiere tipoPersonal === 'Mecánico')

import { Stack } from 'expo-router';
import { AuthGuard, RoleGuard } from '@/components/guards';

export default function MecanicoLayout() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['Mecánico']}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </RoleGuard>
    </AuthGuard>
  );
}
