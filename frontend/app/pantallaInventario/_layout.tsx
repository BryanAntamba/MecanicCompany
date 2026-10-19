// _layout.tsx (pantallaInventario)
// Layout del grupo pantallaInventario: oculta el header nativo en todas las pantallas del panel de inventario
// Protegido con InventarioGuard (requiere sesión de usuario de inventario en AsyncStorage)

import { Stack } from 'expo-router';
import { InventarioGuard } from '@/components/guards';

export default function InventarioLayout() {
  return (
    <InventarioGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </InventarioGuard>
  );
}
