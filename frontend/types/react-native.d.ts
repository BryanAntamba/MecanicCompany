/**
 * Extensión de tipos de React Native para soportar media queries en web
 * Esto suprime los warnings de TypeScript en archivos .web.ts
 */

import 'react-native';

declare module 'react-native' {
  export interface TextStyle {
    // Permitir cualquier propiedad que empiece con @media
    [key: `@media ${string}`]: any;
  }

  export interface ViewStyle {
    // Permitir cualquier propiedad que empiece con @media
    [key: `@media ${string}`]: any;
  }

  export interface ImageStyle {
    // Permitir cualquier propiedad que empiece con @media
    [key: `@media ${string}`]: any;
  }
}
