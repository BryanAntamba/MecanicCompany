// ─────────────────────────────────────────────────────────────────────────────
// nadvarAdmin.tsx
// Barra de navegación exclusiva del panel de administración.
// Muestra el logo de la empresa, el nombre "ECANIC ADMIN" y menú hamburguesa
// con opciones de navegación y cerrar sesión.
// ─────────────────────────────────────────────────────────────────────────────

// Componente Image optimizado de expo-image (mejor rendimiento que el nativo)
import { Image } from 'expo-image';

// Hook de navegación de Expo Router
import { useRouter } from 'expo-router';

// useState para controlar el estado del menú
import { useState } from 'react';

// Componentes de React Native necesarios para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar del admin
import styles from '@/Styles/navbars/navbarAdmin';

// Tipo de las props: recibe el callback de cierre de sesión
type NavbarAdminProps = {
  onSignOut: () => void; // Función que ejecuta el cierre de sesión (redirige al login)
};

// Componente funcional de la navbar del admin
export default function NavbarAdmin({ onSignOut }: NavbarAdminProps) {
  // Hook de navegación
  const router = useRouter();
  
  // Estado: controla si el menú hamburguesa está abierto (true) o cerrado (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // ── MANEJADORES DE OPCIONES DEL MENÚ ──

  // Opción "Gestión de Personal": navega a GestionUsuarios
  const handleGestionPersonal = () => {
    setMenuOpen(false);
    router.push('/Admin/GestionUsuarios' as any);
  };

  // Opción "Gestión de Usuarios": navega a GestionClienteFinal
  const handleGestionUsuarios = () => {
    setMenuOpen(false);
    router.push('/Admin/GestionClienteFinal' as any);
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
          {/* Nombre del panel administrativo */}
          <Text style={styles.navBrand}>PANEL ADMINISTRATIVO</Text>
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
          <Pressable style={styles.menuItem} onPress={handleGestionPersonal}>
            <Text style={styles.menuItemText}>Gestión de Personal</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleGestionUsuarios}>
            <Text style={styles.menuItemText}>Gestión de Usuarios</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleCerrarSesion}>
            <Text style={styles.menuItemText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
