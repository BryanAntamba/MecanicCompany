// _layout.tsx (SeccionFinanciero)
// Layout del grupo SeccionFinanciero: oculta el header nativo en todas las pantallas del panel financiero
// Protegido con FinancieroGuard (requiere sesión de usuario financiero en AsyncStorage)

import { Stack } from 'expo-router';
import { FinancieroGuard } from '@/components/guards';

export default function FinancieroLayout() {
  return (
    <FinancieroGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </FinancieroGuard>
  );
}
