import { StyleSheet } from 'react-native';

// Estilos exclusivos del componente NavbarCliente
export default StyleSheet.create({

  // Barra de navegación superior
  navBar: {
    paddingTop: 48,              // Espacio para la barra de estado del dispositivo
    paddingHorizontal: 16,       // Relleno lateral
    paddingBottom: 12,           // Espacio inferior
    backgroundColor: '#000000', // Fondo negro
    flexDirection: 'row',        // Elementos en fila horizontal
    alignItems: 'center',        // Alineación vertical centrada
    justifyContent: 'space-between', // Logo a la izquierda, menú a la derecha
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

  // Menú desplegable flotante
  menu: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    zIndex: 20,
  },

  // Cada opción del menú desplegable
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  // Texto de cada opción del menú
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
