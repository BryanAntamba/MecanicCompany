// ClienteGuard.tsx
// Componente guardian que protege rutas que requieren sesión de cliente (@gmail.com)
// Si no hay sesión de cliente, redirige automáticamente a /PantallaCliente

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCliente } from '@/context/ClienteContext';

interface ClienteGuardProps {
  children: React.ReactNode;
}

export default function ClienteGuard({ children }: ClienteGuardProps) {
  const { estaLogueado } = useCliente();
  const router = useRouter();

  useEffect(() => {
    // Si no hay sesión de cliente, redirigir a pantalla principal
    if (!estaLogueado) {
      console.warn('[ClienteGuard] Acceso denegado: Se requiere sesión de cliente');
      router.replace('/PantallaCliente' as any);
    }
  }, [estaLogueado, router]);

  // Si no está logueado, mostrar pantalla de carga (se redirigirá en el useEffect)
  if (!estaLogueado) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Si está logueado, renderizar la pantalla protegida
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0b1120',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
