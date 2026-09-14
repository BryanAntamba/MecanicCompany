// ─────────────────────────────────────────────────────────────────────────────
// navbarInventario.tsx
// Selector de plataforma para la navbar de inventario
// Carga la versión web o nativa según la plataforma
// ─────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';
import NavbarInventarioWeb from './navbarInventario.web';
import NavbarInventarioNative from './navbarInventario.native';

type NavbarInventarioProps = {
  onSignOut: () => void;
};

export default function NavbarInventario(props: NavbarInventarioProps) {
  return Platform.OS === 'web' 
    ? <NavbarInventarioWeb {...props} /> 
    : <NavbarInventarioNative {...props} />;
}
