/**
 * Configuración central de la aplicación
 * 
 * Para cambiar la URL del backend:
 * - Dispositivo físico: usa tu IP local (ej: 192.168.100.64)
 * - Emulador Android: usa 10.0.2.2
 * - Simulador iOS: usa localhost
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ⚠️ IMPORTANTE: Cambia esta IP a la IP local de tu computadora donde corre el backend
const BACKEND_IP = '192.168.1.12';
const BACKEND_PORT = 3000;

/**
 * Obtiene la URL base del backend según el entorno de ejecución
 */
function getApiUrl(): string {
  // Si hay debuggerHost (Expo Go en dispositivo físico), usar esa IP
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    // Extraer solo la IP (sin el puerto de Metro)
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:${BACKEND_PORT}/api`;
  }
  
  // Web - usar IP real en lugar de localhost
  if (Platform.OS === 'web') {
    return `http://${BACKEND_IP}:${BACKEND_PORT}/api`;
  }
  
  // Emulador de Android Studio
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${BACKEND_PORT}/api`;
  }
  
  // Simulador de iOS o fallback
  return `http://localhost:${BACKEND_PORT}/api`;
}

export const API_URL = getApiUrl();

// URL alternativa para desarrollo con IP fija (útil para debugging)
export const API_URL_FIXED = `http://${BACKEND_IP}:${BACKEND_PORT}/api`;

// Configuración de la app
export const APP_CONFIG = {
  name: 'Mecanic Company',
  version: '1.0.0',
  apiTimeout: 10000, // 10 segundos
  apiRetries: 2,
};

// Log para debugging (solo en desarrollo)
if (__DEV__) {
  console.log('🌐 API URL configurada:', API_URL);
  console.log('📍 Platform:', Platform.OS);
  console.log('🔧 Debug Host:', Constants.expoConfig?.hostUri);
}
