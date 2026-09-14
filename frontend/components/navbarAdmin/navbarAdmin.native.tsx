// navbarAdmin.native.tsx
// Versión nativa (móvil) de la barra de navegación del admin

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from '@/Styles/navbars/navbarAdmin';

type NavbarAdminProps = {
  onSignOut: () => void;
};

export default function NavbarAdmin({ onSignOut }: NavbarAdminProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGestionPersonal = () => {
    setMenuOpen(false);
    router.push('/Admin/GestionUsuarios' as any);
  };

  const handleGestionUsuarios = () => {
    setMenuOpen(false);
    router.push('/Admin/GestionClienteFinal' as any);
  };

  const handleCerrarSesion = () => {
    setMenuOpen(false);
    onSignOut();
  };

  return (
    <>
      <View style={styles.navBar}>
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          <Text style={styles.navBrand}>PANEL ADMINISTRATIVO</Text>
        </View>

        <View style={styles.navActions}>
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
            <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        </View>
      </View>

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
