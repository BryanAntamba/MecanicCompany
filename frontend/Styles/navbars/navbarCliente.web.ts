import { StyleSheet, Platform } from 'react-native';

/**
 * Estilos optimizados para Web del NavbarCliente
 * - Navbar horizontal con opciones visibles (sin menú hamburguesa en pantallas grandes)
 * - Diseño completamente responsivo para todas las pantallas
 * - Hover effects para mejor UX
 */

export default StyleSheet.create({
  // Barra de navegación superior - completamente responsive
  navBar: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 16,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10000,
    // Sombra sutil para web
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      '@media (max-width: 640px)': {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
      },
      '@media (min-width: 1440px)': {
        paddingHorizontal: 60,
        paddingTop: 20,
        paddingBottom: 20,
      },
      '@media (min-width: 1920px)': {
        paddingHorizontal: 100,
        paddingTop: 24,
        paddingBottom: 24,
      },
    }),
  },

  // Logo - responsive completo
  navLogo: {
    width: 40,
    height: 40,
    ...(Platform.OS === 'web' && {
      '@media (max-width: 480px)': {
        width: 32,
        height: 32,
      },
      '@media (min-width: 481px) and (max-width: 640px)': {
        width: 36,
        height: 36,
      },
      '@media (min-width: 768px)': {
        width: 44,
        height: 44,
      },
      '@media (min-width: 1024px)': {
        width: 48,
        height: 48,
      },
    }),
  },

  // Contenedor del logo + texto
  navBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },

  // Texto del nombre de la empresa - responsive completo
  navBrand: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 12,
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (max-width: 480px)': {
        fontSize: 14,
        letterSpacing: 0.8,
        marginLeft: 8,
      },
      '@media (min-width: 481px) and (max-width: 640px)': {
        fontSize: 16,
        letterSpacing: 1.0,
        marginLeft: 10,
      },
      '@media (min-width: 768px)': {
        fontSize: 19,
        letterSpacing: 1.3,
        marginLeft: 14,
      },
      '@media (min-width: 1024px)': {
        fontSize: 20,
        letterSpacing: 1.4,
        marginLeft: 16,
      },
    }),
  },

  // Contenedor de acciones - en web muestra menú horizontal
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Espaciado entre elementos
    ...(Platform.OS === 'web' && {
      '@media (max-width: 640px)': {
        gap: 4,
      },
      '@media (min-width: 1440px)': {
        gap: 12,
      },
    }),
  },

  // Botón hamburguesa - responsive
  navMenuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    cursor: 'pointer',
    ...(Platform.OS === 'web' && {
      '@media (max-width: 640px)': {
        paddingHorizontal: 8,
        paddingVertical: 6,
      },
    }),
  },

  navMenuButtonText: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 24,
    ...(Platform.OS === 'web' && {
      '@media (max-width: 640px)': {
        fontSize: 20,
        lineHeight: 20,
      },
    }),
  },

  // Menú horizontal para web - responsive
  menuHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...(Platform.OS === 'web' && {
      '@media (min-width: 1440px)': {
        gap: 8,
      },
      '@media (min-width: 1920px)': {
        gap: 12,
      },
    }),
  },

  // Items del menú horizontal - responsive
  menuItemHorizontal: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    ...(Platform.OS === 'web' && {
      '@media (min-width: 1440px)': {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      '@media (min-width: 1920px)': {
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
    }),
  },

  // Hover effect para items horizontales
  menuItemHorizontalHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Texto de items horizontales - responsive
  menuItemTextHorizontal: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (min-width: 1440px)': {
        fontSize: 17,
      },
      '@media (min-width: 1920px)': {
        fontSize: 19,
      },
    }),
  },

  // Botón login/logout - responsive
  menuItemButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...(Platform.OS === 'web' && {
      '@media (min-width: 1440px)': {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 2.5,
      },
      '@media (min-width: 1920px)': {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderWidth: 3,
      },
    }),
  },

  menuItemButtonHover: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  menuItemButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (min-width: 1440px)': {
        fontSize: 17,
      },
      '@media (min-width: 1920px)': {
        fontSize: 19,
      },
    }),
  },

  menuItemButtonTextHover: {
    color: '#000000',
  },

  // Menú desplegable (móvil) - MISMO DISEÑO QUE MÓVIL NATIVO
  menu: {
    position: 'absolute',
    top: 72, // Debajo del navbar
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
      '@media (max-width: 640px)': {
        top: 56,
        paddingVertical: 10,
        paddingHorizontal: 14,
      },
      '@media (min-width: 768px)': {
        top: 80,
        paddingVertical: 14,
        paddingHorizontal: 18,
      },
    }),
  },

  // Items del menú desplegable - MISMO DISEÑO QUE MÓVIL NATIVO
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    ...(Platform.OS === 'web' && {
      '@media (max-width: 640px)': {
        paddingVertical: 10,
        paddingHorizontal: 8,
      },
      '@media (min-width: 768px)': {
        paddingVertical: 14,
        paddingHorizontal: 12,
      },
      ':hover': {
        opacity: 0.8,
      },
    }),
  },

  menuItemActive: {
    backgroundColor: 'transparent', // Sin fondo, solo texto
  },

  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (max-width: 640px)': {
        fontSize: 14,
      },
      '@media (min-width: 768px)': {
        fontSize: 16,
      },
    }),
  },

  menuItemTextActive: {
    color: '#FFFFFF',
    opacity: 0.7,
  },

  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
    marginHorizontal: 10,
    ...(Platform.OS === 'web' && {
      '@media (max-width: 640px)': {
        marginVertical: 6,
        marginHorizontal: 8,
      },
      '@media (min-width: 768px)': {
        marginVertical: 10,
        marginHorizontal: 12,
      },
    }),
  },

  menuItemLogout: {
    color: '#FFFFFF',  // Mismo color que los demás items
    fontSize: 15,
    fontWeight: '600',
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (max-width: 640px)': {
        fontSize: 14,
      },
      '@media (min-width: 768px)': {
        fontSize: 16,
      },
    }),
  },
});
