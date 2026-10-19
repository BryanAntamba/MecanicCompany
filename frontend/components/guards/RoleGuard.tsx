// RoleGuard.tsx
// Componente guardian que protege rutas verificando que el usuario tenga el rol correcto
// Debe usarse DESPUÉS de AuthGuard (asume que ya hay token válido)
// Si el rol no coincide, redirige automáticamente a /PantallaCliente

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // ej: ['admin'], ['mecanico'], ['inventario', 'financiero']
  requireAdmin?: boolean; // Si true, requiere rol === 'admin'
}

export default function RoleGuard({ children, allowedRoles = [], requireAdmin = false }: RoleGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario (no debería pasar si AuthGuard está antes)
    if (!user) {
      console.warn('[RoleGuard] No hay usuario');
      router.replace('/PantallaCliente' as any);
      return;
    }

    console.log('[RoleGuard] Verificando acceso - user.rol:', user.rol, 'requireAdmin:', requireAdmin, 'allowedRoles:', allowedRoles);

    // Verificar si requiere ser Admin
    if (requireAdmin && user.rol !== 'admin') {
      console.warn(`[RoleGuard] Acceso denegado: Se requiere rol admin. Usuario tiene: ${user.rol}`);
      router.replace('/PantallaCliente' as any);
      return;
    }

    // Verificar si el rol del usuario está en los roles permitidos
    if (allowedRoles.length > 0) {
      const hasRole = allowedRoles.includes(user.rol);
      if (!hasRole) {
        console.warn(`[RoleGuard] Acceso denegado: Se requiere uno de estos roles: ${allowedRoles.join(', ')}. Usuario tiene: ${user.rol}`);
        router.replace('/PantallaCliente' as any);
        return;
      }
    }

    console.log('[RoleGuard] ✅ Acceso permitido');
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
  if (requireAdmin && user.rol !== 'admin') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Verificar rol
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.rol);
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
