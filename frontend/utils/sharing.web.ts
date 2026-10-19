/**
 * Wrapper de expo-sharing para web
 * En web, usamos la API de navegador para compartir o descargar
 */

export const isAvailableAsync = async (): Promise<boolean> => {
  // Verificar si el navegador soporta la API de compartir
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

export const shareAsync = async (url: string, options?: any): Promise<void> => {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await (navigator as any).share({
        url,
        title: options?.dialogTitle || 'Compartir',
      });
    } catch (error) {
      // Si falla o el usuario cancela, abrir en nueva pestaña
      window.open(url, '_blank');
    }
  } else {
    // Fallback: abrir en nueva pestaña
    window.open(url, '_blank');
  }
};
