/**
 * navbarFinanciero.web.tsx
 * Versión optimizada para WEB de la barra de navegación del financiero
 * Basado en navbarAdmin.web.tsx
 * 
 * Características:
 * - Menú horizontal en pantallas grandes
 * - Menú hamburguesa en pantallas pequeñas (< 1024px)
 * - Hover effects
 * - Diseño responsivo
 */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, Text, View, Dimensions } from 'react-native';
import styles from '@/Styles/navbars/navbarFinanciero.web';

type NavbarFinancieroProps = {
  onSignOut: () => void;
};

export default function NavbarFinanciero({ onSignOut }: NavbarFinancieroProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Inicializar basado en el ancho actual con breakpoint estándar
  const [isWideScreen, setIsWideScreen] = useState(() => {
    const { width } = Dimensions.get('window');
    return width >= 1024;
  });

  // Detectar tamaño de pantalla con breakpoint
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      const isWide = width >= 1024;
      setIsWideScreen(isWide);
      // Cerrar menú móvil si se agranda la pantalla
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
    router.push('/SeccionFinanciero/financiero' as any);
  };

  const handleHistorial = () => {
    setMenuOpen(false);
    router.push('/SeccionFinanciero/historial' as any);
  };

  const handleCerrarSesion = () => {
    setMenuOpen(false);
    onSignOut();
  };

  // Estado hover para cada item (solo en web)
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
          <Text style={styles.navBrand}>PANEL FINANCIERO</Text>
        </View>

        {/* Menú horizontal (pantallas grandes) o hamburguesa (móvil) */}
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

              {/* Botón de Cerrar Sesión - Blanco con borde, blanco sólido al hover */}
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
