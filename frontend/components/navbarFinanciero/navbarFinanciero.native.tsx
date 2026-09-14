// ─────────────────────────────────────────────────────────────────────────────
// navbarFinanciero.tsx
// Barra de navegación exclusiva del sistema financiero.
// Muestra el logo de la empresa, el nombre "SISTEMA FINANCIERO" y menú hamburguesa
// con opción de cerrar sesión.
// ─────────────────────────────────────────────────────────────────────────────

// Componente Image optimizado de expo-image (mejor rendimiento que el nativo)
import { Image } from 'expo-image';

// Hook de navegación de Expo Router
import { useRouter } from 'expo-router';

// useState para controlar el estado del menú
import { useState } from 'react';

// Componentes de React Native necesarios para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar financiera
import styles from '@/Styles/navbars/navbarFinanciero';

// Tipo de las props: recibe el callback de cierre de sesión
type NavbarFinancieroProps = {
  onSignOut: () => void; // Función que ejecuta el cierre de sesión (redirige al login)
};

// Componente funcional de la navbar financiera
export default function NavbarFinanciero({ onSignOut }: NavbarFinancieroProps) {
  // Hook de navegación
  const router = useRouter();
  
  // Estado: controla si el menú hamburguesa está abierto (true) o cerrado (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // ── MANEJADORES DE OPCIONES DEL MENÚ ──

  // Opción "Reportes": navega a Financiero.tsx (pagos pendientes)
  const handleReportes = () => {
    setMenuOpen(false);
    router.push('/SeccionFinanciero/financiero' as any);
  };

  // Opción "Historial": navega a historial.tsx
  const handleHistorial = () => {
    setMenuOpen(false);
    router.push('/SeccionFinanciero/historial' as any);
  };

  // Opción "Cerrar Sesión": cierra menú y ejecuta callback
  const handleCerrarSesion = () => {
    setMenuOpen(false);
    onSignOut();
  };

  return (
    <>
      {/* Barra de navegación superior */}
      <View style={styles.navBar}>

        {/* Grupo izquierdo: logo de la empresa + nombre del panel */}
        <View style={styles.navBrandGroup}>
          {/* Logo de la empresa cargado desde los assets locales */}
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"  // No recorta la imagen, la ajusta dentro del espacio
            style={styles.navLogo}
          />
          {/* Nombre del sistema financiero */}
          <Text style={styles.navBrand}>PANEL FINANCIERO</Text>
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
          <Pressable style={styles.menuItem} onPress={handleReportes}>
            <Text style={styles.menuItemText}>Reportes</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleHistorial}>
            <Text style={styles.menuItemText}>Historial</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleCerrarSesion}>
            <Text style={styles.menuItemText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
