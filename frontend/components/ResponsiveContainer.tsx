// ResponsiveContainer.tsx
// Componente wrapper simple que mantiene el fondo negro consistente

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export default function ResponsiveContainer({ 
  children
}: ResponsiveContainerProps) {
  // Simplemente renderizar los children sin modificaciones
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

// También exportar como named export para compatibilidad
export { ResponsiveContainer };
