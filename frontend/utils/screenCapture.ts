/**
 * Wrapper para expo-screen-capture compatible con web
 * En móvil: previene capturas de pantalla
 * En web: no hace nada (las capturas web se manejan a nivel de navegador)
 */

import { Platform } from 'react-native';

let ScreenCapture: any = null;

// Solo importar en móvil
if (Platform.OS !== 'web') {
  ScreenCapture = require('expo-screen-capture');
}

export const preventScreenCaptureAsync = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    // En web no hay forma nativa de prevenir capturas
    console.log('[Web] Screen capture prevention is not supported');
    return;
  }
  
  try {
    await ScreenCapture?.preventScreenCaptureAsync();
  } catch (error) {
    console.warn('Error preventing screen capture:', error);
  }
};

export const allowScreenCaptureAsync = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('[Web] Screen capture allowance is not needed');
    return;
  }
  
  try {
    await ScreenCapture?.allowScreenCaptureAsync();
  } catch (error) {
    console.warn('Error allowing screen capture:', error);
  }
};

export const usePreventScreenCapture = () => {
  if (Platform.OS === 'web') {
    // Hook vacío para web
    return;
  }
  
  try {
    ScreenCapture?.usePreventScreenCapture();
  } catch (error) {
    console.warn('Error in usePreventScreenCapture hook:', error);
  }
};
