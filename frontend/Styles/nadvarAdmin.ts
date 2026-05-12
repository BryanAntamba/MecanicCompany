
// nadvarAdmin.ts
// Estilos de la barra de navegación del panel de administración (NavbarAdmin).
// Misma base visual que nadvarCliente.ts pero sin menú hamburguesa:
// solo logo + nombre + botón de cerrar sesión.


import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Barra superior horizontal: fondo negro, logo a la izquierda, botón a la derecha
  navBar: {
    paddingTop: 48,              // Espacio para la barra de estado del dispositivo (hora, batería)
    paddingHorizontal: 16,       // Margen lateral de 16px
    paddingBottom: 12,           // Espacio inferior de la barra
    backgroundColor: '#000000', // Fondo negro para toda la barra
    flexDirection: 'row',        // Logo y botón en fila horizontal
    alignItems: 'center',        // Centra verticalmente todos los elementos
    justifyContent: 'space-between', // Logo a la izquierda, botón a la derecha
  },

  // Logo de la empresa (Icono.png) — tamaño fijo cuadrado
  navLogo: {
    width: 36,
    height: 36,
  },

  // Contenedor del logo + texto "ECANIC ADMIN" en fila horizontal
  navBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',        // Centra verticalmente el logo y el texto
  },

  // Texto "ECANIC ADMIN" junto al logo
  navBrand: {
    color: '#F8FAFC',            // Blanco casi puro
    fontSize: 16,
    fontWeight: '700',           // Negrita
    letterSpacing: 1,            // Espaciado entre letras para estilo de marca
    marginLeft: 8,               // Separación entre el logo y el texto
  },

  // Contenedor del botón de cerrar sesión (alineado a la derecha)
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Botón "Cerrar sesión" en estado normal — borde sutil semitransparente
  navLogoutPressable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,             // Bordes ligeramente redondeados
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.35)', // Borde blanco al 35% de opacidad
  },

  // Texto del botón "Cerrar sesión" en estado normal — blanco
  navLogoutText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Estado presionado del botón — fondo rojo para indicar acción destructiva
  navLogoutPressed: {
    backgroundColor: '#dc2626',  // Rojo de peligro/acción destructiva
    borderColor: '#dc2626',      // Borde del mismo color para coherencia visual
  },

  // Texto del botón al presionar — blanco puro (contraste sobre fondo rojo)
  navLogoutTextPressed: {
    color: '#FFFFFF',
  },
});
