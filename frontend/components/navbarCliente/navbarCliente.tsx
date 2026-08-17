// navbarCliente.tsx
// Barra de navegación de la sección del cliente (pantalla principal index.tsx
// y Contactanos.tsx).

// Componente Image optimizado de expo-image
import { Image } from 'expo-image';

// useRouter: hook de Expo Router para navegar entre pantallas programáticamente
import { useRouter } from 'expo-router';

// Context del cliente para verificar sesión
import { useCliente } from '@/context/ClienteContext';

// useState: estado local del componente (menú abierto/cerrado)
import { useState } from 'react';

// Componentes de React Native para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar del cliente
import styles from '@/Styles/navbars/navbarCliente';

// Tipo de las props del componente
type NavbarClienteProps = {
  onScrollToAbout: () => void;  // Callback para hacer scroll a la sección "Nosotros"
  onScrollToTop?: () => void;   // Callback opcional para hacer scroll al inicio de la página
};

// Componente funcional de la navbar del cliente
export default function NavbarCliente({ onScrollToAbout, onScrollToTop }: NavbarClienteProps) {
  // Hook de navegación
  const router = useRouter();
  
  // Obtener estado y funciones de sesión del cliente
  const { estaLogueado, cerrarSesionCliente } = useCliente();

  // Estado: controla si el menú hamburguesa está abierto (true) o cerrado (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // ── MANEJADORES DE OPCIONES DEL MENÚ ──

  // Opción "Inicio": hace scroll al top si hay callback, si no navega al index
  const handleInicio = () => {
    setMenuOpen(false);
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      router.push('/PantallaCliente' as any);
    }
  };

  // Opción "Contáctanos": navega a la pantalla de Contactanos
  const handleContactanos = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/Contactanos' as any);
  };

  // Opción "Soporte": navega a la pantalla de soporte
  const handleSoporte = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/soporte' as any);
  };

  // Opción "Seguimiento del Vehículo": navega a la pantalla de seguimiento
  const handleSeguimiento = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/SeguimientoVehiculo' as any);
  };

  // Opción "Nosotros": hace scroll a la sección si hay callback
  const handleNosotros = () => {
    setMenuOpen(false);
    if (onScrollToAbout) {
      onScrollToAbout();
    } else {
      router.push('/PantallaCliente' as any);
    }
  };

  // Opción "Iniciar Sesión": navega al login
  const handleLogin = () => {
    setMenuOpen(false);
    router.push('/(auth)/login' as any);
  };
  
  // Opción "Cerrar Sesión": cierra sesión y va al login limpiando todo el historial
  const handleCerrarSesion = () => {
    setMenuOpen(false);
    // Navegar primero para evitar parpadeo por re-render
    router.replace({ pathname: '/(auth)/login', params: { fromLogout: 'true' } } as any);
    // Cerrar sesión en segundo plano (no esperar con await)
    cerrarSesionCliente();
  };

  return (
    <>
      {/* Barra de navegación superior */}
      <View style={styles.navBar}>

        {/* Grupo izquierdo: logo + nombre de la empresa */}
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>MECANIC COMPANY</Text>
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
          <Pressable style={styles.menuItem} onPress={handleInicio}>
            <Text style={styles.menuItemText}>Inicio</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleContactanos}>
            <Text style={styles.menuItemText}>Contáctanos</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleSoporte}>
            <Text style={styles.menuItemText}>Soporte</Text>
          </Pressable>
          {estaLogueado && (
            <Pressable style={styles.menuItem} onPress={handleSeguimiento}>
              <Text style={styles.menuItemText}>Seguimiento del Vehículo</Text>
            </Pressable>
          )}
          <Pressable style={styles.menuItem} onPress={handleNosotros}>
            <Text style={styles.menuItemText}>Nosotros</Text>
          </Pressable>
          {estaLogueado ? (
            <Pressable style={styles.menuItem} onPress={handleCerrarSesion}>
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.menuItem} onPress={handleLogin}>
              <Text style={styles.menuItemText}>Iniciar Sesión</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </>
  );
}
