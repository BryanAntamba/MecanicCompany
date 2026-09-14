/**
 * navbarMecanico.web.tsx
 * Versión optimizada para WEB de la barra de navegación del mecánico
 * 
 * Características:
 * - Menú horizontal en pantallas grandes (>=1024px)
 * - Menú hamburguesa en pantallas pequeñas (<1024px)
 * - Hover effects
 * - Diseño responsivo
 */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, Text, View, Dimensions } from 'react-native';
import styles from '@/Styles/navbars/navbarMecanico.web';

type NavbarMecanicoProps = {
  onSignOut: () => void;
};

export default function NavbarMecanico({ onSignOut }: NavbarMecanicoProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Detectar tamaño de pantalla
  const [isWideScreen, setIsWideScreen] = useState(() => {
    const { width } = Dimensions.get('window');
    return width >= 1024;
  });

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      const isWide = width >= 1024;
      setIsWideScreen(isWide);
      if (isWide && menuOpen) {
        setMenuOpen(false);
      }
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription?.remove();
  }, [menuOpen]);

  // Manejadores
  const handleReportes = () => {
    setMenuOpen(false);
    router.push('/SeccionMecanico/ReportesClientes' as any);
  };

  const handleHistorial = () => {
    setMenuOpen(false);
    router.push('/SeccionMecanico/historial' as any);
  };

  const handleCerrarSesion = () => {
    setMenuOpen(false);
    onSignOut();
  };

  // Estado hover
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Barra de navegación */}
      <View style={styles.navBar}>
        {/* Logo + Nombre */}
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>PANEL MECÁNICO</Text>
        </View>

        {/* Menú horizontal o hamburguesa */}
        <View style={styles.navActions}>
          {isWideScreen ? (
            // Menú horizontal para pantallas grandes
            <View style={styles.menuHorizontal}>
              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'reportes' && styles.menuItemHorizontalHover
                ]}
                onPress={handleReportes}
                onHoverIn={() => setHoveredItem('reportes')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Reportes</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuItemHorizontal,
                  hoveredItem === 'historial' && styles.menuItemHorizontalHover
                ]}
                onPress={handleHistorial}
                onHoverIn={() => setHoveredItem('historial')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={styles.menuItemTextHorizontal}>Historial</Text>
              </Pressable>

              {/* Botón de Cerrar Sesión */}
              <Pressable
                style={({ pressed }) => [
                  styles.menuItemButton,
                  (hoveredItem === 'logout' || pressed) && styles.menuItemButtonHover
                ]}
                onPress={handleCerrarSesion}
                onHoverIn={() => setHoveredItem('logout')}
                onHoverOut={() => setHoveredItem(null)}
              >
                <Text style={[
                  styles.menuItemButtonText,
                  (hoveredItem === 'logout') && styles.menuItemButtonTextHover
                ]}>
                  Cerrar Sesión
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
      )}
    </>
  );
}
