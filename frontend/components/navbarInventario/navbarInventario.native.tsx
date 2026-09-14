// ─────────────────────────────────────────────────────────────────────────────
// navbarInventario.tsx
// Barra de navegación exclusiva del sistema de inventario.
// Muestra el logo de la empresa, el nombre "SISTEMA DE INVENTARIO" y menú hamburguesa
// con opción de cerrar sesión.
// ─────────────────────────────────────────────────────────────────────────────

// Componente Image optimizado de expo-image
import { Image } from 'expo-image';

// useRouter: hook de Expo Router para navegar entre pantallas programáticamente
import { useRouter } from 'expo-router';

// useState: estado local del componente (menú abierto/cerrado)
import { useState } from 'react';

// Componentes de React Native para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar de inventario
import styles from '@/Styles/navbars/navbarInventario';

// Tipo de las props del componente
type NavbarInventarioProps = {
  onSignOut: () => void; // Función que ejecuta el cierre de sesión (redirige al login)
};

// Componente funcional de la navbar de inventario
export default function NavbarInventario({ onSignOut }: NavbarInventarioProps) {
  // Hook de navegación
  const router = useRouter();
  
  // Estado: controla si el menú hamburguesa está abierto (true) o cerrado (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // ── MANEJADORES DE OPCIONES DEL MENÚ ──

  // Opción "Cerrar Sesión": cierra menú y ejecuta callback
  const handleCerrarSesion = () => {
    setMenuOpen(false);
    onSignOut();
  };

  return (
    <>
      {/* Barra de navegación superior */}
      <View style={styles.navBar}>

        {/* Grupo izquierdo: logo + nombre del sistema */}
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>PANEL DE INVENTARIO</Text>
        </View>

        {/* Grupo derecho: botón hamburguesa */}
        <View style={styles.navActions}>
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
            <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Menú desplegable */}
      {menuOpen ? (
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={handleCerrarSesion}>
            <Text style={styles.menuItemText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
