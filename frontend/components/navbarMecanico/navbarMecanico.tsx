// navbarMecanico.tsx
// Componente selector de plataforma para la barra de navegación del mecánico

import { Platform } from 'react-native';

// Importar versiones específicas de plataforma
import NavbarMecanicoWeb from './navbarMecanico.web';
import NavbarMecanicoNative from './navbarMecanico.native';

// Props
type NavbarMecanicoProps = {
  onSignOut: () => void;
};

// Seleccionar componente según plataforma
const NavbarMecanico = Platform.select({
  web: NavbarMecanicoWeb,
  default: NavbarMecanicoNative,
});

export default NavbarMecanico as React.ComponentType<NavbarMecanicoProps>;
