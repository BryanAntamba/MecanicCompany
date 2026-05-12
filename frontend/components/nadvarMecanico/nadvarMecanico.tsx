// Componente de barra de navegación para la sección del mecánico
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/Styles/nadvarMecanico';

// Props: indica qué pestaña está activa para resaltarla en el menú
type NavbarMecanicoProps = {
  activeTab: 'reportes' | 'historial'; // Pestaña actualmente visible
};

// Navbar del mecánico: logo "ECANIC", menú hamburguesa con Reportes, Historial y Cerrar sesión
export default function NavbarMecanico({ activeTab }: NavbarMecanicoProps) {
  const router = useRouter();

  // Estado: controla si el menú hamburguesa está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el menú y redirige al login (cierre de sesión)
  const cerrarSesion = () => {
    setMenuOpen(false);
    router.replace('/(auth)/login' as any);
  };

  return (
    <>
      {/* Barra superior: logo + botón hamburguesa */}
      <View style={styles.navBar}>
        <View style={styles.navBrandGroup}>
          <Image
            source={require('../../assets/images/Icono.png')}
            contentFit="contain"
            style={styles.navLogo}
          />
          {/* Título corto de la app para el mecánico */}
          <Text style={styles.navBrand}>ECANIC</Text>
        </View>
        <View style={styles.navActions}>
          {/* Botón hamburguesa: alterna entre ☰ y ✕ según el estado del menú */}
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
            <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Menú desplegable: solo visible cuando menuOpen === true */}
      {menuOpen && (
        <View style={styles.menu}>

          {/* Opción Reportes: navega a la pantalla de reportes de clientes */}
          <Pressable
            style={[styles.menuItem, activeTab === 'reportes' && styles.menuItemActive]}
            onPress={() => {
              setMenuOpen(false);
              router.replace('/SeccionMecanico/ReportesClientes' as any);
            }}
          >
            {/* Texto resaltado en azul si es la pestaña activa */}
            <Text style={[styles.menuItemText, activeTab === 'reportes' && styles.menuItemTextActive]}>
              Reportes
            </Text>
          </Pressable>

          {/* Opción Historial: navega al historial de mantenimientos */}
          <Pressable
            style={[styles.menuItem, activeTab === 'historial' && styles.menuItemActive]}
            onPress={() => {
              setMenuOpen(false);
              router.replace('/SeccionMecanico/historial' as any);
            }}
          >
            <Text style={[styles.menuItemText, activeTab === 'historial' && styles.menuItemTextActive]}>
              Historial
            </Text>
          </Pressable>

          {/* Línea divisoria entre opciones de navegación y cerrar sesión */}
          <View style={styles.menuDivider} />

          {/* Opción Cerrar sesión: en rojo para diferenciarse visualmente */}
          <Pressable style={styles.menuItem} onPress={cerrarSesion}>
            <Text style={styles.menuItemLogout}>Cerrar sesión</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
