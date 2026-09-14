// RoleGuard.tsx
// Componente guardian que protege rutas verificando que el usuario tenga el rol correcto
// Debe usarse DESPUÉS de AuthGuard (asume que ya hay token válido)
// Si el rol no coincide, redirige automáticamente a /PantallaCliente

import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[]; // ej: ['Mecánico'], ['Administrador'], ['Inventario', 'Financiero']
  requireAdmin?: boolean; // Si true, requiere esAdmin === true
}

export default function RoleGuard({ children, allowedRoles, requireAdmin = false }: RoleGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario (no debería pasar si AuthGuard está antes)
    if (!user) {
      router.replace('/PantallaCliente' as any);
      return;
    }

    // Verificar si requiere ser Admin
    if (requireAdmin && !user.esAdmin) {
      console.warn('[RoleGuard] Acceso denegado: Se requiere rol de Administrador');
      router.replace('/PantallaCliente' as any);
      return;
    }

    // Verificar si el tipoPersonal del usuario está en los roles permitidos
    if (allowedRoles.length > 0 && user.tipoPersonal) {
      const hasRole = allowedRoles.includes(user.tipoPersonal);
      if (!hasRole) {
        console.warn(`[RoleGuard] Acceso denegado: Se requiere uno de estos roles: ${allowedRoles.join(', ')}`);
        router.replace('/PantallaCliente' as any);
      }
    }
  }, [user, allowedRoles, requireAdmin, router]);

  // Si no hay usuario, mostrar pantalla de carga (se redirigirá en el useEffect)
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Verificar Admin
  if (requireAdmin && !user.esAdmin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Verificar rol
  if (allowedRoles.length > 0 && user.tipoPersonal) {
    const hasRole = allowedRoles.includes(user.tipoPersonal);
    if (!hasRole) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      );
    }
  }

  // Si pasa todas las validaciones, renderizar la pantalla protegida
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
