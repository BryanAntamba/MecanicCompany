// ─────────────────────────────────────────────────────────────────────────────
// navbarFinanciero.tsx
// Selector de plataforma para la navbar de financiero
// Carga la versión web o nativa según la plataforma
// ─────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';
import NavbarFinancieroWeb from './navbarFinanciero.web';
import NavbarFinancieroNative from './navbarFinanciero.native';

type NavbarFinancieroProps = {
  onSignOut: () => void;
};

export default function NavbarFinanciero(props: NavbarFinancieroProps) {
  return Platform.OS === 'web' 
    ? <NavbarFinancieroWeb {...props} /> 
    : <NavbarFinancieroNative {...props} />;
}
