// Componente Stack de Expo Router: define la navegación en pila para el grupo Admin
import { Stack } from 'expo-router';

// Layout del grupo Admin: oculta el header nativo en todas las pantallas del panel administrativo
export default function AdminLayout() {
  return (
    // Stack: navegación en pila donde cada pantalla se apila sobre la anterior
    // screenOptions se aplica globalmente a todas las pantallas del grupo Admin
    <Stack
      screenOptions={{
        headerShown: false, // Oculta el header nativo en todas las pantallas del grupo
      }}                    // (GestionMecanicos usa su propia NavbarAdmin personalizada)
    />
  );
}
