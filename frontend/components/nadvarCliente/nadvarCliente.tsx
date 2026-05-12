// ─────────────────────────────────────────────────────────────────────────────
// nadvarCliente.tsx
// Barra de navegación de la sección del cliente (pantalla principal index.tsx
// y Contactanos.tsx). Incluye un easter egg: 10 taps en el logo abren el login
// oculto para que el admin o mecánico puedan acceder sin que el cliente lo note.
// ─────────────────────────────────────────────────────────────────────────────

// Componente Image optimizado de expo-image
import { Image } from 'expo-image';

// useRouter: hook de Expo Router para navegar entre pantallas programáticamente
import { useRouter } from 'expo-router';

// useState: estado local del componente (menú abierto/cerrado)
// useRef: referencia mutable que persiste entre renders sin causar re-render
import { useState, useRef } from 'react';

// Componentes de React Native para la barra
import { Pressable, Text, View } from 'react-native';

// Hoja de estilos específica de la navbar del cliente
import styles from '@/Styles/nadvarCliente';

// Tipo de las props del componente
type NavbarClienteProps = {
  onScrollToAbout: () => void;  // Callback para hacer scroll a la sección "Nosotros"
  onScrollToTop?: () => void;   // Callback opcional para hacer scroll al inicio de la página
};

// Componente funcional de la navbar del cliente
export default function NavbarCliente({ onScrollToAbout, onScrollToTop }: NavbarClienteProps) {
  // Hook de navegación para redirigir al login oculto o a otras pantallas
  const router = useRouter();

  // Estado: controla si el menú hamburguesa está abierto (true) o cerrado (false)
  const [menuOpen, setMenuOpen] = useState(false);

  // ── EASTER EGG: 10 TAPS EN EL LOGO → LOGIN OCULTO ──

  // Contador de taps en el logo (useRef para no causar re-renders al incrementar)
  const tapCount = useRef(0);

  // Timer que resetea el contador si pasan más de 3 segundos entre taps
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Maneja cada tap en el logo del easter egg
  const handleLogoPress = () => {
    // Cancela el timer anterior para reiniciar el conteo de 3 segundos
    if (tapTimer.current) clearTimeout(tapTimer.current);

    tapCount.current += 1; // Incrementa el contador de taps

    // Si se alcanzaron 10 taps, navega al login oculto
    if (tapCount.current >= 10) {
      tapCount.current = 0;                          // Resetea el contador
      router.push('/(auth)/login' as any);           // Navega al login
      return;                                        // Sale de la función
    }

    // Si no se completaron 10 taps en 3 segundos, resetea el contador
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 3000);
  };

  // ── MANEJADORES DE OPCIONES DEL MENÚ ──

  // Opción "Inicio": hace scroll al top si hay callback, si no navega al index
  const handleInicio = () => {
    setMenuOpen(false);          // Cierra el menú
    if (onScrollToTop) {
      onScrollToTop();           // Usa el callback del padre si existe
    } else {
      router.push('/(tabs)' as any); // Navega al index si no hay callback
    }
  };

  // Opción "Soporte": navega a la pantalla de Contactanos
  const handleSoporte = () => {
    setMenuOpen(false);
    router.push('/SeccionCliente/Contactanos' as any);
  };

  // Opción "Nosotros": hace scroll a la sección si hay callback, si no navega al index
  const handleNosotros = () => {
    setMenuOpen(false);
    if (onScrollToAbout) {
      onScrollToAbout();         // Usa el callback del padre (scroll a las cards)
    } else {
      router.push('/(tabs)' as any);
    }
  };

  return (
    // Fragment: agrupa la barra y el menú sin agregar un nodo extra al árbol
    <>
      {/* Barra de navegación superior */}
      <View style={styles.navBar}>

        {/* Grupo izquierdo: logo (con easter egg) + nombre de la empresa */}
        <View style={styles.navBrandGroup}>
          {/* Pressable envuelve el logo para detectar los taps del easter egg */}
          <Pressable onPress={handleLogoPress}>
            <Image
              source={require('../../assets/images/Icono.png')}
              contentFit="contain"
              style={styles.navLogo}
            />
          </Pressable>
          {/* Nombre de la empresa en la barra */}
          <Text style={styles.navBrand}>ECANIC COMPANY</Text>
        </View>

        {/* Grupo derecho: botón hamburguesa que alterna el menú */}
        <View style={styles.navActions}>
          {/* (v) => !v invierte el estado actual del menú */}
          <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.navMenuButton}>
            {/* Muestra ✕ cuando el menú está abierto, ☰ cuando está cerrado */}
            <Text style={styles.navMenuButtonText}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Menú desplegable: solo se renderiza cuando menuOpen === true
          null evita renderizar nada cuando está cerrado */}
      {menuOpen ? (
        <View style={styles.menu}>
          {/* Opción Inicio */}
          <Pressable style={styles.menuItem} onPress={handleInicio}>
            <Text style={styles.menuItemText}>Inicio</Text>
          </Pressable>
          {/* Opción Soporte → Contactanos */}
          <Pressable style={styles.menuItem} onPress={handleSoporte}>
            <Text style={styles.menuItemText}>Soporte</Text>
          </Pressable>
          {/* Opción Nosotros → scroll a las cards del carrusel */}
          <Pressable style={styles.menuItem} onPress={handleNosotros}>
            <Text style={styles.menuItemText}>Nosotros</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
