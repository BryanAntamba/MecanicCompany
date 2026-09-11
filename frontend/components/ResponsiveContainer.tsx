// ResponsiveContainer.tsx
// Componente wrapper que centra el contenido en pantallas grandes
// Mantiene el diseño original en móvil sin cambios

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export default function ResponsiveContainer({ 
  children
}: ResponsiveContainerProps) {
  const { maxWidth, isMobile } = useResponsive();

  // En móvil: renderizar directamente sin wrapper
  if (isMobile) {
    return <>{children}</>;
  }

  // En pantallas grandes: centrar con ancho máximo
  // TypeScript necesita que maxWidth sea del tipo correcto
  const containerStyle = typeof maxWidth === 'number' 
    ? { maxWidth } 
    : { maxWidth: '100%' as const };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, containerStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0b1120',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
});

// También exportar como named export para compatibilidad
export { ResponsiveContainer };
