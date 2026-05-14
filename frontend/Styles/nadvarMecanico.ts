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

  // Menú desplegable — fluye debajo del navbar (no flotante)
  menu: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  // Cada opción del menú — idéntico al de nadvarCliente (sin borderRadius)
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

  // Texto de la opción activa — subrayado sutil con color blanco brillante
  menuItemTextActive: {
    color: '#FFFFFF',
    opacity: 0.7,
  },

  // Línea divisoria — casi invisible para mantener el estilo limpio del cliente
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
