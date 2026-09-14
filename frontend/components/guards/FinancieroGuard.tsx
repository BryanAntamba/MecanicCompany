// FinancieroGuard.tsx
// Guardian específico para proteger rutas de financiero
// Verifica que haya sesión de usuario financiero en AsyncStorage

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FinancieroGuardProps {
  children: React.ReactNode;
}

export default function FinancieroGuard({ children }: FinancieroGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkFinancieroAccess();
  }, []);

  const checkFinancieroAccess = async () => {
    try {
      const userData = await AsyncStorage.getItem('financiero_user');
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user.tipoPersonal === 'Financiero') {
          setHasAccess(true);
        } else {
          router.replace('/PantallaCliente' as any);
        }
      } else {
        router.replace('/PantallaCliente' as any);
      }
    } catch (error) {
      console.error('[FinancieroGuard] Error al verificar acceso:', error);
      router.replace('/PantallaCliente' as any);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

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
