// navbarInventario.web.ts
// Estilos web responsive para el navbar de inventario (basado en navbarAdmin.web.ts)

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  navBar: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 16,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10000,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      '@media (max-width: 640px)': {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
      },
    }),
  },

  navLogo: {
    width: 40,
    height: 40,
    ...(Platform.OS === 'web' && {
      '@media (min-width: 1024px)': {
        width: 48,
        height: 48,
      },
    }),
  },

  navBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  navBrand: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 12,
    ...(Platform.OS === 'web' && {
      userSelect: 'none',
      '@media (min-width: 1024px)': {
        fontSize: 20,
        letterSpacing: 1.4,
        marginLeft: 16,
      },
    }),
  },

  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  navMenuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    cursor: 'pointer',
    '@media (max-width: 640px)': {
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
  },

  navMenuButtonText: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 24,
    '@media (max-width: 640px)': {
      fontSize: 20,
      lineHeight: 20,
    },
  },

  // Menú horizontal para web
  menuHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  menuItemHorizontal: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'all 0.2s ease',
  },

  menuItemHorizontalHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  menuItemTextHorizontal: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    userSelect: 'none',
  },

  menuItemButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  menuItemButtonHover: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  menuItemButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    userSelect: 'none',
  },

  menuItemButtonTextHover: {
    color: '#000000',
  },

  // Menú desplegable móvil
  menu: {
    position: 'fixed' as any,
    top: 72,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
    '@media (max-width: 640px)': {
      top: 56,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    ':hover': {
      opacity: 0.8,
    },
  },

  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    userSelect: 'none',
  },
});
