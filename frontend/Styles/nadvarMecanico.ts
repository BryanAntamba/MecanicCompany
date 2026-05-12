// Estilos de la barra de navegación del mecánico (NavbarMecanico)
// Mismo patrón visual que nadvarCliente.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Barra superior: fondo negro, elementos en fila
  navBar: {
    paddingTop: 48,              // Espacio para la barra de estado del dispositivo
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Logo de la empresa
  navLogo: { width: 36, height: 36 },

  // Contenedor del logo + nombre "ECANIC"
  navBrandGroup: { flexDirection: 'row', alignItems: 'center' },

  // Texto "ECANIC" junto al logo
  navBrand: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 8,
  },

  // Contenedor del botón hamburguesa
  navActions: { flexDirection: 'row', alignItems: 'center' },

  // Botón hamburguesa con área de toque generosa
  navMenuButton: { paddingHorizontal: 6, paddingVertical: 6 },

  // Ícono ☰ / ✕ del botón hamburguesa
  navMenuButtonText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },

  // Menú desplegable flotante sobre el contenido
  menu: {
    position: 'absolute',
    top: 76,                     // Justo debajo de la navbar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 8,
  },

  // Cada opción del menú
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  // Opción activa resaltada con fondo azul semitransparente
  menuItemActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },

  // Texto de cada opción del menú
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Texto de la opción activa en azul
  menuItemTextActive: {
    color: '#2563EB',
  },

  // Línea divisoria entre opciones de navegación y cerrar sesión
  menuDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 4,
    marginHorizontal: 10,
  },

  // Texto de "Cerrar sesión" en rojo para diferenciarse visualmente
  menuItemLogout: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
