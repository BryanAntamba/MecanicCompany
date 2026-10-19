// navbarAdmin.tsx
// Punto de entrada que selecciona la versión correcta según la plataforma

import { Platform } from 'react-native';

// Tipo de las props
export type NavbarAdminProps = {
  onSignOut: () => void;
};

// Importar la versión correcta según la plataforma
const NavbarAdmin = Platform.OS === 'web' 
  ? require('./navbarAdmin.web').default
  : require('./navbarAdmin.native').default;

export default NavbarAdmin;
