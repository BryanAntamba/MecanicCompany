/**
 * Wrapper de expo-file-system para móvil
 * Re-exporta las funciones nativas
 */

import * as FileSystem from 'expo-file-system/legacy';

export const documentDirectory = FileSystem.documentDirectory;
export const downloadAsync = FileSystem.downloadAsync;
export const getInfoAsync = FileSystem.getInfoAsync;
export const readAsStringAsync = FileSystem.readAsStringAsync;
export const EncodingType = FileSystem.EncodingType;
