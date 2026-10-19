/**
 * navbarCliente.web.tsx
 * Versión optimizada para WEB de la barra de navegación del cliente
 * 
 * Características:
 * - Menú horizontal en pantallas grandes
 * - Menú hamburguesa en pantallas pequeñas (< 768px)
 * - Hover effects
 * - Diseño responsivo
 */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCliente } from '@/context/ClienteContext';
import { useState, useEffect } from 'react';
import { Pressable, Text, View, Dimensions } from 'react-native';
import styles from '@/Styles/navbars/navbarCliente';

type NavbarClienteProps = {
  onScrollToAbout: () => void;
  onScrollToTop?: () => void;
};

export default function NavbarCliente({ onScrollToAbout, onScrollToTop }: NavbarClienteProps) {
  const router = useRouter();
  const { estaLogueado, cerrarSesionCliente } = useCliente();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Inicializar basado en el ancho actual con breakpoint estándar
  const [isWideScreen, setIsWideScreen] = useState(() => {
    const { width } = Dimensions.get('window');
    return width >= 1024; // Cambio a 1024px para que aparezca en tablets
  });

  // Detectar tamaño de pantalla con breakpoint
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      // Cambiar a menú hamburguesa en pantallas menores a 1024px
      const isWide = width >= 1024;
      setIsWideScreen(isWide);
      console.log('Window width:', width, 'isWideScreen:', isWide); // Debug
      // Cerrar menú móvil si se agranda la pantalla
      if (isWide && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Ejecutar inmediatamente al montar
    updateLayout();
    
    const subscription = Dimensions.addEventListener('change', updateLayout);
    
    return () => subscription?.remove();
  }, [menuOpen]);

  // Manejadores
  const handleInicio = () => {
    setMenuOpen(false);
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      router.push('/PantallaCliente' as any);
    }
  };

  const handleContactanos = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/Contactanos' as any);
  };

  const handleSoporte = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/soporte' as any);
  };

  const handleSeguimiento = () => {
    setMenuOpen(false);
    router.push('/PantallaCliente/SeguimientoVehiculo' as any);
  };

  const handleNosotros = () => {
    setMenuOpen(false);
    if (onScrollToAbout) {
      onScrollToAbout();
    } else {
      router.push('/PantallaCliente' as any);
    }
  };

  const handleLogin = () => {
    setMenuOpen(false);
    router.push('/(auth)/login' as any);
  };

  const handleCerrarSesion = () => {
    setMenuOpen(false);
    router.replace({ pathname: '/(auth)/login', params: { fromLogout: 'true' } } as any);
    cerrarSesionCliente();
  };

  // Estado hover para cada item (solo en web)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Barra de navegación */}
      <View style={styles.navBar}>
        {/* Logo + Nombre */}
        <Pressable 
          style={styles.navBrandGroup}
          onPress={handleInicio}
        >
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>MECANIC COMPANY</Text>
        </Pressable>

        {/* Menú horizontal (pantallas grandes) o hamburguesa (móvil) */}
        <View style={styles.navActions}>
          {isWideScreen ? (
            // Menú horizontal para pantallas grandes
            <View style={styles.menuHorizontal}>
              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'inicio' && styles.menuItemHorizontalHover
                ]}
                onPress={handleInicio}
                onHoverIn={() => setHoveredItem('inicio')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Inicio</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'contactanos' && styles.menuItemHorizontalHover
                ]}
                onPress={handleContactanos}
                onHoverIn={() => setHoveredItem('contactanos')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Contáctanos</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'soporte' && styles.menuItemHorizontalHover
                ]}
                onPress={handleSoporte}
                onHoverIn={() => setHoveredItem('soporte')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Soporte</Text>
              </Pressable>

              {estaLogueado && (
                <Pressable
                  style={[
                    styles.menuItemHorizontal,
                    hoveredItem === 'seguimiento' && styles.menuItemHorizontalHover
                  ]}
                  onPress={handleSeguimiento}
                  onHoverIn={() => setHoveredItem('seguimiento')}
                  onHoverOut={() => setHoveredItem(null)}
                >
                  <Text style={styles.menuItemTextHorizontal}>Seguimiento</Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'nosotros' && styles.menuItemHorizontalHover
                ]}
                onPress={handleNosotros}
                onHoverIn={() => setHoveredItem('nosotros')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Nosotros</Text>
              </Pressable>

              {/* Botón de Login/Logout - Blanco con borde, blanco sólido al hover */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItemButton,
                  (hoveredItem === 'auth' || pressed) && styles.menuItemButtonHover
                ]}
                onPress={estaLogueado ? handleCerrarSesion : handleLogin}
                onHoverIn={() => setHoveredItem('auth')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={[
                  styles.menuItemButtonText,
                  (hoveredItem === 'auth') && styles.menuItemButtonTextHover
                ]}>
                  {estaLogueado ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                </Text>
              </Pressable>
            </View>
          ) : (
            // Botón hamburguesa para pantallas pequeñas
            <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
              <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Menú desplegable (solo en pantallas pequeñas) */}
      {!isWideScreen && menuOpen && (
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
      )}
    </>
  );
}
