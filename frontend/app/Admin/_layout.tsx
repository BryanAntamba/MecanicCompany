// Componente Stack de Expo Router: define la navegación en pila para el grupo Admin
import { Stack } from 'expo-router';
import { AuthGuard, RoleGuard } from '@/components/guards';

// Layout del grupo Admin: oculta el header nativo en todas las pantallas del panel administrativo
// Protegido con AuthGuard (requiere token) y RoleGuard (requiere esAdmin === true)
export default function AdminLayout() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[]} requireAdmin={true}>
        {/* Stack: navegación en pila donde cada pantalla se apila sobre la anterior
            screenOptions se aplica globalmente a todas las pantallas del grupo Admin */}
        <Stack
          screenOptions={{
            headerShown: false, // Oculta el header nativo en todas las pantallas del grupo
          }}                    // (GestionMecanicos usa su propia NavbarAdmin personalizada)
        />
      </RoleGuard>
    </AuthGuard>
  );
}
