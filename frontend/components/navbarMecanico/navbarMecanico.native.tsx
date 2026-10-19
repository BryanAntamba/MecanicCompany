// navbarMecanico.native.tsx
// Versión NATIVA (móvil) de la barra de navegación del mecánico

import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/Styles/navbars/navbarMecanico';

type NavbarMecanicoProps = {
  onSignOut: () => void;
};

export default function NavbarMecanico({ onSignOut }: NavbarMecanicoProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <>
      {/* Barra de navegación superior */}
      <View style={styles.navBar}>
        {/* Grupo izquierdo: logo + nombre */}
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>PANEL MECÁNICO</Text>
        </View>

        {/* Grupo derecho: botón hamburguesa */}
        <View style={styles.navActions}>
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
            <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Menú desplegable */}
      {menuOpen && (
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
