// _layout.tsx (raíz)
// Layout principal de la aplicación. Es el primer archivo que Expo Router carga.
// Define el proveedor de tema, el navegador Stack raíz y la barra de estado.
// Todas las pantallas de la app están anidadas dentro de este layout.


// DarkTheme: tema oscuro de React Navigation (fondos oscuros, textos claros)
// DefaultTheme: tema claro de React Navigation (fondos claros, textos oscuros)
// ThemeProvider: componente que aplica el tema a todos los navegadores hijos
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Stack: navegador en pila de Expo Router (cada pantalla se apila sobre la anterior)
import { Stack } from 'expo-router';

// StatusBar: controla el estilo de la barra de estado del dispositivo (hora, batería, etc.)
import { StatusBar } from 'expo-status-bar';

// Importación necesaria para que react-native-reanimated funcione correctamente.
// Debe importarse lo antes posible en el árbol de componentes.
import 'react-native-reanimated';

// Hook personalizado que detecta si el dispositivo está en modo oscuro o claro
import { useColorScheme } from '@/hooks/use-color-scheme';


// CONFIGURACIÓN DE EXPO ROUTER

// unstable_settings: configuración especial de Expo Router.
// anchor: define la pantalla inicial cuando la app se abre por primera vez.
// '(tabs)' significa que la app arranca en el grupo de pestañas (index.tsx).
export const unstable_settings = {
  anchor: '(tabs)',
};


// COMPONENTE PRINCIPAL

export default function RootLayout() {
  // Obtiene el esquema de color actual del dispositivo: 'dark' | 'light' | null
  const colorScheme = useColorScheme();

  return (
    // ThemeProvider aplica el tema a todos los navegadores y componentes hijos.
    // Si el dispositivo está en modo oscuro usa DarkTheme, si no usa DefaultTheme.
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      {/* Stack raíz: navegador en pila que contiene todas las rutas de la app.
          screenOptions={{ headerShown: false }} oculta el header nativo en TODAS
          las pantallas por defecto, evitando que aparezca el nombre de la ruta. */}
      <Stack screenOptions={{ headerShown: false }}>

        {/* Grupo (tabs): pantalla principal del cliente (index.tsx).
            headerShown: false redundante pero explícito para mayor claridad. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Grupo (auth): agrupa todas las pantallas de autenticación.
            headerShown: false oculta el header en todo el grupo. */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Pantalla de login: acceso oculto activado con 10 taps en el logo. */}
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />

        {/* Pantalla de restablecimiento de contraseña: paso 1 del flujo de recuperación. */}
        <Stack.Screen name="(auth)/restablecimientoPassword" options={{ headerShown: false }} />

        {/* Pantalla de código de verificación: paso 2 del flujo de recuperación.
            (Reservada para uso futuro cuando se implemente el envío de código por SMS) */}
        <Stack.Screen name="(auth)/codigoVerificacion" options={{ headerShown: false }} />

        {/* Pantalla de cambio de contraseña: paso final del flujo de recuperación. */}
        <Stack.Screen name="(auth)/cambiarPassword" options={{ headerShown: false }} />

        {/* Grupo Admin: panel de administración (GestionMecanicos).
            Solo accesible con las credenciales de admin@mecanic.com */}
        <Stack.Screen name="Admin" options={{ headerShown: false }} />

        {/* Pantalla modal genérica: se presenta como modal (desliza desde abajo en iOS).
            presentation: 'modal' activa la animación de modal nativo.
            title: 'Modal' es el título del header (visible porque headerShown no está en false aquí). */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

      </Stack>

      {/* StatusBar controla el estilo de la barra de estado del dispositivo.
          style="auto" adapta automáticamente el color de los íconos (claro/oscuro)
          según el tema activo del dispositivo. */}
      <StatusBar style="auto" />

    </ThemeProvider>
  );
}
