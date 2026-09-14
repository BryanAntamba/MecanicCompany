/**
 * Wrapper de expo-file-system para web
 * En web, usamos la API de download del navegador
 */

export const documentDirectory = null;

export const downloadAsync = async (uri: string, fileUri: string): Promise<{ uri: string }> => {
  // En web, simplemente abrimos el archivo en una nueva pestaña
  window.open(uri, '_blank');
  return { uri };
};

export const getInfoAsync = async (fileUri: string): Promise<{ exists: boolean; uri: string }> => {
  return { exists: true, uri: fileUri };
};
