// navbarFinanciero.ts
// Estilos de la barra de navegación del sistema financiero.
// Incluye menú hamburguesa con opción de cerrar sesión.

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Barra superior horizontal: fondo negro, logo a la izquierda, menú hamburguesa a la derecha
  navBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#000000', // Fondo negro como navbarCliente
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10000,
    elevation: 21,
  },

  // Logo de la empresa (Icono.png) — tamaño fijo cuadrado
  navLogo: {
    width: 36,
    height: 36,
  },

  // Contenedor del logo + texto "SISTEMA FINANCIERO" en fila horizontal
  navBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',        // Centra verticalmente el logo y el texto
  },

  // Texto "SISTEMA FINANCIERO" junto al logo
  navBrand: {
    color: '#F8FAFC',            // Blanco casi puro
    fontSize: 16,
    fontWeight: '700',           // Negrita
    letterSpacing: 1,            // Espaciado entre letras para estilo de marca
    marginLeft: 8,               // Separación entre el logo y el texto
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
    position: 'absolute',
    top: 96,
    left: 0,
    right: 0,

    zIndex: 9999,
    elevation: 20,

    backgroundColor: 'rgba(17, 24, 39, 0.95)', // Gris oscuro como navbarCliente

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

  // Texto de cada opción del menú
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
