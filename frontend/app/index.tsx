/**
 * index.tsx - Ruta raíz de la aplicación
 * 
 * Este archivo maneja la ruta raíz (/) y redirige automáticamente
 * según el estado de autenticación del usuario.
 * 
 * En web: cuando el usuario accede a http://localhost:8081/
 * En móvil: cuando la app se abre por primera vez
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage helper para soportar sessionStorage en web
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web' && typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }
};

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      // Verificar si hay sesión activa (sessionStorage en web, AsyncStorage en móvil)
      const [token, userStr] = await Promise.all([
        storage.getItem('@mecaniccompany/token'),
        storage.getItem('@mecaniccompany/user'),
      ]);

      console.log('🔍 INDEX.TSX - Token:', token ? 'EXISTS' : 'NULL');
      console.log('🔍 INDEX.TSX - UserStr:', userStr);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 INDEX.TSX - User parsed:', user);
        console.log('👤 INDEX.TSX - rol:', user.rol);
        console.log('👤 INDEX.TSX - tipoPersonal:', user.tipoPersonal);
        console.log('👤 INDEX.TSX - esAdmin:', user.esAdmin);
        
        // Redirigir según el rol (nuevo sistema del backend)
        const rol = user.rol || (user.esAdmin ? 'admin' : user.tipoPersonal?.toLowerCase());
        
        switch (rol) {
          case 'admin':
            console.log('➡️ INDEX.TSX - Redirigiendo a Admin');
            router.replace('/Admin/GestionUsuarios' as any);
            break;
          case 'mecanico':
            console.log('➡️ INDEX.TSX - Redirigiendo a Mecanico');
            router.replace('/SeccionMecanico/ReportesClientes' as any);
            break;
          case 'inventario':
            console.log('➡️ INDEX.TSX - Redirigiendo a Inventario');
            router.replace('/pantallaInventario/sistemaInventario' as any);
            break;
          case 'financiero':
            console.log('➡️ INDEX.TSX - Redirigiendo a Financiero');
            router.replace('/SeccionFinanciero/financiero' as any);
            break;
          case 'cliente':
          default:
            console.log('➡️ INDEX.TSX - Redirigiendo a Cliente (default)');
            router.replace('/PantallaCliente' as any);
        }
      } else {
        console.log('➡️ INDEX.TSX - No hay sesión, redirigiendo a Cliente');
        // No hay sesión, ir a pantalla de cliente
        router.replace('/PantallaCliente' as any);
      }
    } catch (error) {
      console.error('❌ INDEX.TSX - Error:', error);
      // En caso de error, ir a pantalla de cliente
      router.replace('/PantallaCliente' as any);
    } finally {
      setChecking(false);
    }
  };

  // Mostrar loading mientras verifica
  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
