/**
 * Wrapper de expo-image-picker para móvil
 * Re-exporta las funciones nativas
 */

import * as ImagePicker from 'expo-image-picker';

export const MediaTypeOptions = ImagePicker.MediaTypeOptions;
export const launchImageLibraryAsync = ImagePicker.launchImageLibraryAsync;
export const requestMediaLibraryPermissionsAsync = ImagePicker.requestMediaLibraryPermissionsAsync;
export const requestCameraPermissionsAsync = ImagePicker.requestCameraPermissionsAsync;

export type ImagePickerOptions = ImagePicker.ImagePickerOptions;
export type ImagePickerResult = ImagePicker.ImagePickerResult;
