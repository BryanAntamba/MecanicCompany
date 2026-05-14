import { StyleSheet } from 'react-native';

// Estilos del componente NavbarCliente — idénticos a nadvarMecanico.ts
export default StyleSheet.create({

  // Barra de navegación superior
  navBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Imagen del logo
  navLogo: {
    width: 36,
    height: 36,
  },

  // Contenedor del logo + texto de marca
  navBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Texto del nombre de la empresa
  navBrand: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 8,
  },

  // Contenedor de los botones de acción (menú hamburguesa)
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Botón del menú hamburguesa
  navMenuButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },

  // Ícono del menú (☰ o ✕)
  navMenuButtonText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },

  // Menú desplegable flotante por encima del contenido
  menu: {
    position: 'absolute', // Hace que flote
    top: 96,              // Debajo del navbar
    left: 0,
    right: 0,

    zIndex: 9999,         // Prioridad visual alta
    elevation: 20,        // Android

    backgroundColor: 'rgba(17, 24, 39, 0.95)',

    paddingVertical: 12,
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },

  // Cada opción del menú desplegable
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  // Opción activa: sin fondo extra, solo el texto cambia de color
  menuItemActive: {},

  // Texto de cada opción del menú
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Texto de la opción activa — blanco con opacidad reducida
  menuItemTextActive: {
    color: '#FFFFFF',
    opacity: 0.7,
  },

  // Línea divisoria — casi invisible para mantener el estilo limpio
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 4,
    marginHorizontal: 10,
  },

  // Texto de "Cerrar sesión" — mismo color blanco que el resto del menú
  menuItemLogout: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
