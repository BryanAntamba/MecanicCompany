/**
 * Wrapper de expo-av para móvil
 * Re-exporta el componente Video nativo
 */

import { Video as ExpoVideo, ResizeMode as ExpoResizeMode } from 'expo-av';

export const Video = ExpoVideo;
export const ResizeMode = ExpoResizeMode;
