/**
 * navbarInventario.web.tsx
 * Versión optimizada para WEB de la barra de navegación del inventario
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
import styles from '@/Styles/navbars/navbarInventario.web';

type NavbarInventarioProps = {
  onSignOut: () => void;
};

export default function NavbarInventario({ onSignOut }: NavbarInventarioProps) {
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
          <Text style={styles.navBrand}>PANEL DE INVENTARIO</Text>
        </View>

        {/* Menú horizontal (pantallas grandes) o hamburguesa (móvil) */}
        <View style={styles.navActions}>
          {isWideScreen ? (
            // Menú horizontal para pantallas grandes
            <View style={styles.menuHorizontal}>
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
          <Pressable style={styles.menuItem} onPress={handleCerrarSesion}>
            <Text style={styles.menuItemText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
