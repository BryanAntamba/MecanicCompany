// Componente Tabs de Expo Router: define la navegación por pestañas del grupo (tabs)
import { Tabs } from 'expo-router';

// React es necesario para que JSX funcione correctamente en este archivo
import React from 'react';

// Layout del grupo (tabs): configura la barra de pestañas para todas las pantallas del grupo
export default function TabLayout() {
  return (
    // Tabs: contenedor de navegación por pestañas de Expo Router
    <Tabs
      screenOptions={{
        headerShown: false,              // Oculta el header nativo en todas las pantallas del grupo
        tabBarStyle: { display: 'none' }, // Oculta completamente la barra de pestañas inferior
      }}                                 // (no se necesita porque la app usa su propia navbar)
    >
      {/* Pantalla principal del grupo: apunta al archivo index.tsx */}
      <Tabs.Screen
        name="index"                     // Nombre de la ruta (corresponde a app/(tabs)/index.tsx)
        options={{ title: 'Home' }}      // Título de la pestaña (no visible porque tabBarStyle está oculto)
      />
    </Tabs>
  );
}
