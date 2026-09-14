// AuthGuard.tsx
// Componente guardian que protege rutas verificando que el usuario tenga token válido
// Si no hay token, redirige automáticamente a /PantallaCliente
// Muestra pantalla de carga mientras verifica la autenticación (bootstrapping)

import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { token, bootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que termine el bootstrapping (carga de sesión guardada)
    if (bootstrapping) return;

    // Si no hay token, redirigir a pantalla principal del cliente
    if (!token) {
      router.replace('/PantallaCliente' as any);
    }
  }, [token, bootstrapping, router]);

  // Mostrar pantalla de carga mientras verifica autenticación
  if (bootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

  // Si no hay token, mostrar pantalla vacía (se redirigirá en el useEffect)
  if (!token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Si hay token válido, renderizar la pantalla protegida
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0b1120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#CBD5E1',
    marginTop: 16,
  },
});
