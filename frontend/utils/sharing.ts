/**
 * Wrapper de expo-sharing para móvil
 * Re-exporta las funciones nativas
 */

import * as Sharing from 'expo-sharing';

export const isAvailableAsync = Sharing.isAvailableAsync;
export const shareAsync = Sharing.shareAsync;
