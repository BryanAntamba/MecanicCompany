// useResponsive.ts
// Hook personalizado para manejar responsive design
// Detecta el ancho de pantalla y proporciona breakpoints

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const BREAKPOINTS = {
  mobile: 768,    // Hasta 768px = móvil (diseño original)
  tablet: 1024,   // 768px - 1024px = tablet
  desktop: 1440,  // 1024px - 1440px = desktop
  wide: 1920,     // 1440px+ = pantallas muy grandes
};

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;

  return {
    width,
    height: dimensions.height,
    
    // Breakpoints
    isMobile: width < BREAKPOINTS.mobile,
    isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop && width < BREAKPOINTS.wide,
    isWide: width >= BREAKPOINTS.wide,
    
    // Ancho máximo del contenedor según pantalla
    // En móvil: sin límite (usa todo el ancho)
    // En pantallas grandes: limita el ancho para mantener legibilidad
    maxWidth: width < BREAKPOINTS.mobile 
      ? '100%' 
      : width < BREAKPOINTS.desktop 
        ? 700 
        : width < BREAKPOINTS.wide 
          ? 900 
          : 1200,
    
    // Helper para aplicar estilos condicionales
    responsive: <T,>(mobile: T, tablet?: T, desktop?: T, wide?: T): T => {
      if (width >= BREAKPOINTS.wide && wide !== undefined) return wide;
      if (width >= BREAKPOINTS.desktop && desktop !== undefined) return desktop;
      if (width >= BREAKPOINTS.mobile && tablet !== undefined) return tablet;
      return mobile;
    },
  };
};
