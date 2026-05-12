// ─────────────────────────────────────────────────────────────────────────────
// nadvarAdmin.tsx
// Barra de navegación exclusiva del panel de administración.
// Muestra el logo de la empresa, el nombre "ECANIC ADMIN" y el botón
// de cerrar sesión que redirige al login.
// ─────────────────────────────────────────────────────────────────────────────

// Componente Image optimizado de expo-image (mejor rendimiento que el nativo)
import { Image } from 'expo-image';

// Componentes de React Native necesarios para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar del admin
import styles from '@/Styles/nadvarAdmin';

// Tipo de las props: solo recibe el callback de cierre de sesión
type NavbarAdminProps = {
  onSignOut: () => void; // Función que ejecuta el cierre de sesión (redirige al login)
};

// Componente funcional de la navbar del admin
// No tiene estado interno — es completamente controlado por el padre (GestionMecanicos)
export default function NavbarAdmin({ onSignOut }: NavbarAdminProps) {
  return (
    // Barra superior horizontal: logo a la izquierda, botón de sesión a la derecha
    <View style={styles.navBar}>

      {/* Grupo izquierdo: logo de la empresa + nombre del panel */}
      <View style={styles.navBrandGroup}>
        {/* Logo de la empresa cargado desde los assets locales */}
        <Image
          source={require('../../assets/images/Icono.png')}
          contentFit="contain"  // No recorta la imagen, la ajusta dentro del espacio
          style={styles.navLogo}
        />
        {/* Nombre del panel administrativo */}
        <Text style={styles.navBrand}>ECANIC ADMIN</Text>
      </View>

      {/* Grupo derecho: botón de cerrar sesión */}
      <View style={styles.navActions}>
        {/* Pressable con función de estilo: cambia apariencia al presionar */}
        <Pressable
          onPress={onSignOut}  // Ejecuta el callback del padre al presionar
          style={({ pressed }) => [
            styles.navLogoutPressable,
            pressed && styles.navLogoutPressed, // Aplica estilo adicional mientras se presiona
          ]}
        >
          {/* Función hija de Pressable: recibe el estado pressed para cambiar el texto */}
          {({ pressed }) => (
            <Text style={[styles.navLogoutText, pressed && styles.navLogoutTextPressed]}>
              Cerrar sesión
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
