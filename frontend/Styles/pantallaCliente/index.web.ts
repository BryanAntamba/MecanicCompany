/**
 * Estilos optimizados para WEB de la pantalla principal del cliente
 * - Elementos más grandes y espaciados para pantallas grandes
 * - Diseño centrado y responsive
 * - Sin afectar la versión móvil
 */

import { StyleSheet, Platform } from 'react-native';

// Exportar las mismas constantes que el móvil
export const HERO_SECTION_HEIGHT = 520;
export const VIDEO_BG_SECTION_HEIGHT = 550;
export const HERO_VIDEO_BLOCK_HEIGHT = HERO_SECTION_HEIGHT + VIDEO_BG_SECTION_HEIGHT;

// Importar los estilos móviles para extenderlos
import mobileStylesModule from './index';

// En web, crear una copia de los estilos móviles y extenderlos
// Solo sobrescribimos los estilos que necesitan cambios
export default StyleSheet.create({
  // --- ESTILOS BASE (heredados, no modificados en web) ---
  page: {
    flex: 1,
    backgroundColor: '#000000',
  },

  scrollContent: {
    flexGrow: 1,
  },

  heroVideoBlock: {
    margin: 0,
    padding: 0,
    height: HERO_VIDEO_BLOCK_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_SECTION_HEIGHT,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  heroSlider: {
    height: HERO_SECTION_HEIGHT,
  },

  heroSlide: {
    height: HERO_SECTION_HEIGHT,
    overflow: 'hidden',
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111827',
  },

  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_SECTION_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  heroTextOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: 'flex-start',
    ...(Platform.OS === 'web' && {
      bottom: 60,
      left: 32,
      right: 32,
      maxWidth: 1200,
      alignSelf: 'center',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        bottom: 30,
        left: 20,
        right: 20,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        bottom: 70,
        left: 40,
        right: 40,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        bottom: 80,
        paddingHorizontal: 60,
        left: 0,
        right: 0,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        bottom: 100,
        paddingHorizontal: 80,
      },
    }),
  },

  heroText: {
    color: '#F8FAFC',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'left',
    marginBottom: 0,
    width: '100%',
    lineHeight: 42,  // Añadir line-height para mejor espaciado
    ...(Platform.OS === 'web' && {
      fontSize: 42,
      lineHeight: 50,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        fontSize: 32,
        lineHeight: 38,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        fontSize: 48,
        lineHeight: 56,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        fontSize: 56,
        lineHeight: 66,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        fontSize: 64,
        lineHeight: 76,
      },
    }),
  },

  heroTitleContainer: {
    width: '100%',
    height: 90,
    marginBottom: 16, // Más espacio para evitar superposición
    ...(Platform.OS === 'web' && {
      height: 150, // Más alto en web para títulos más grandes
      marginBottom: 18,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        height: 120,
        marginBottom: 14,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        height: 160,
        marginBottom: 20,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        height: 180,
        marginBottom: 24,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        height: 200,
        marginBottom: 28,
      },
    }),
  },

  heroTitleAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  heroCaption: {
    color: '#E2E8F0',
    textAlign: 'left',
    fontSize: 15,
    lineHeight: 22,
    width: '100%',
    marginBottom: 20,
    ...(Platform.OS === 'web' && {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 18,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        fontSize: 18,
        lineHeight: 27,
        marginBottom: 28,
        maxWidth: 650,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        fontSize: 20,
        lineHeight: 30,
        marginBottom: 32,
        maxWidth: 750,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        fontSize: 22,
        lineHeight: 33,
        marginBottom: 36,
        maxWidth: 850,
      },
    }),
  },

  heroCitaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: 450,
    width: '100%',
    marginTop: 4,
    cursor: 'pointer',
  },

  heroCitaButtonPressed: {
    backgroundColor: '#2563EB',
  },

  heroCitaButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },

  heroCitaButtonTextPressed: {
    color: '#FFFFFF',
  },

  videoBgSection: {
    position: 'absolute',
    top: HERO_SECTION_HEIGHT,
    left: 0,
    right: 0,
    height: VIDEO_BG_SECTION_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#000000',
  },

  videoBg: {
    ...StyleSheet.absoluteFillObject,
  },

  videoBgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 1,
  },

  videoBgContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 0,
    paddingTop: 20,
    zIndex: 2,
    width: '100%',
  },

  videoBgIcon: {
    width: 260,
    height: 260,
    marginTop: 60,
    marginBottom: 20,
  },

  videoBgSubtitle: {
    width: '85%',
    height: 150,
    marginBottom: 12,
  },

  videoBgPhrase: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    fontStyle: 'italic',
    opacity: 0.95,
    paddingHorizontal: 12,
    marginTop: 8,
  },

  sectionNosotros: {
    marginTop: 50,
    paddingHorizontal: 24, // Padding solo para el subtítulo
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      width: '100%',
      paddingHorizontal: 0, // Sin padding en web
    }),
  },

  aboutSubtituloImg: {
    width: '90%',
    height: 90,
    marginBottom: 24,
    ...(Platform.OS === 'web' && {
      width: '70%',
      height: 120,
      maxWidth: 800,
      marginBottom: 32, // Reducir espacio
      marginHorizontal: 'auto',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        height: 140,
        marginBottom: 36,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        height: 160,
        marginBottom: 40,
      },
    }),
  },

  // --- CARRUSEL DE VEHÍCULOS - OCUPA TODO EL ANCHO ---
  vehicleCarousel: {
    width: '100%',
    height: 320,
    marginTop: 0,
    marginBottom: 32,
    overflow: 'hidden',
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      width: '100%',  // Ocupa todo el ancho
      maxWidth: '100%',  // Sin límite máximo
      height: 350,
      marginTop: 0,
      marginBottom: 40,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        height: 400,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        height: 450,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        height: 500,
      },
    }),
  },

  vehicleSlide: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      height: 350,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        height: 400,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        height: 450,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        height: 500,
      },
    }),
  },

  vehicleImage: {
    width: '100%',
    height: 310,
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      width: '100%',
      height: 330,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        height: 380,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        height: 430,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        height: 480,
      },
    }),
  },

  // --- CARRUSEL DE TARJETAS - SIMPLE, CENTRADO Y RESPONSIVE ---
  aboutCarouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    // @ts-ignore - Media query funciona en React Native Web
    '@media (max-width: 640px)': {
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 12,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 641px)': {
      justifyContent: 'space-between',
      gap: 20,
      paddingHorizontal: 24,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 768px)': {
      gap: 28,
      paddingHorizontal: 40,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 1024px)': {
      gap: 40,
      paddingHorizontal: 60,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 1440px)': {
      gap: 50,
      paddingHorizontal: 80,
    },
  },

  aboutCarouselWrapper: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // @ts-ignore - Media query funciona en React Native Web
    '@media (max-width: 640px)': {
      flex: 1,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 641px)': {
      width: '100%',
      maxWidth: 500,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 768px)': {
      maxWidth: 450,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 1024px)': {
      maxWidth: 480,
    },
    // @ts-ignore - Media query funciona en React Native Web
    '@media (min-width: 1440px)': {
      maxWidth: 550,
    },
  },

  // --- TARJETAS - DISEÑO ORIGINAL + RESPONSIVE PARA PEQUEÑAS ---
  aboutCard: {
      width: 340,
      backgroundColor: '#1E293B',
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#273449',
      padding: 28,
      alignItems: 'center',
      minHeight: 400,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        width: 240,
        padding: 20,
        minHeight: 340,
        borderRadius: 20,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        width: 260,
        padding: 22,
        minHeight: 360,
        borderRadius: 22,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        width: 360,
        padding: 30,
        minHeight: 410,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        width: 380,
        padding: 32,
        minHeight: 420,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        width: 420,
        padding: 36,
        minHeight: 450,
      },
  },

  aboutCardTitle: {
    color: '#F8FAFC',
    fontSize: Platform.OS === 'web' ? 28 : 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 12,
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        fontSize: 20,
        marginBottom: 12,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        fontSize: 22,
        marginBottom: 14,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        fontSize: 30,
        marginBottom: 22,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        fontSize: 32,
        marginBottom: 24,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        fontSize: 34,
        marginBottom: 26,
      },
    }),
  },

  aboutCardText: {
    color: '#CBD5E1',
    fontSize: Platform.OS === 'web' ? 16 : 15,
    lineHeight: Platform.OS === 'web' ? 26 : 24,
    textAlign: 'center',
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        fontSize: 14,
        lineHeight: 22,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        fontSize: 15,
        lineHeight: 24,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        fontSize: 16.5,
        lineHeight: 27,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        fontSize: 17,
        lineHeight: 28,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        fontSize: 18,
        lineHeight: 30,
      },
    }),
  },

  // --- FLECHAS - RESPONSIVE PARA PANTALLAS PEQUEÑAS ---
  aboutArrow: {
    width: Platform.OS === 'web' ? 56 : 40,
    height: Platform.OS === 'web' ? 56 : 40,
    borderRadius: Platform.OS === 'web' ? 28 : 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: Platform.OS === 'web' ? 10 : -1,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      borderWidth: 2,
      borderColor: '#475569',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        width: 60,
        height: 60,
        borderRadius: 30,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        width: 64,
        height: 64,
        borderRadius: 32,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        width: 72,
        height: 72,
        borderRadius: 36,
      },
    }),
  },

  aboutArrowText: {
    color: '#F8FAFC',
    fontSize: Platform.OS === 'web' ? 44 : 32,
    lineHeight: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '300',
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        fontSize: 32,
        lineHeight: 36,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        fontSize: 40,
        lineHeight: 44,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        fontSize: 48,
        lineHeight: 52,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        fontSize: 50,
        lineHeight: 54,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        fontSize: 56,
        lineHeight: 60,
      },
    }),
  },

  aboutArrowHidden: {
    opacity: 0,
  },

  // --- IMAGEN HAMMER (CARRO DE LADO) - COMPLETAMENTE RESPONSIVE ---
  hammerContainer: {
    alignSelf: 'flex-end',
    marginTop: 16,
    marginRight: 0,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      marginTop: 24,
      marginRight: 0,
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        marginTop: 16,
        marginRight: 0,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        marginTop: 20,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px)': {
        marginTop: 32,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        marginTop: 40,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        marginTop: 50,
      },
    }),
  },

  hammerImage: {
    width: 280,
    height: 280,
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 480px)': {
        width: 200,
        height: 200,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 481px) and (max-width: 640px)': {
        width: 260,
        height: 260,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 641px) and (max-width: 767px)': {
        width: 340,
        height: 340,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 768px) and (max-width: 1023px)': {
        width: 400,
        height: 400,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px) and (max-width: 1439px)': {
        width: 460,
        height: 460,
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1440px)': {
        width: 540,
        height: 540,
      },
    }),
  },

  // --- FOOTER - COLOR NEGRO COMO EN MÓVIL ---
  footer: {
    backgroundColor: '#000000', // Negro puro como en móvil
    paddingVertical: Platform.OS === 'web' ? 60 : 48,
    paddingHorizontal: Platform.OS === 'web' ? 40 : 32,
    alignItems: 'center',
  },

  copyrightText: {
    color: '#94A3B8',
    fontSize: Platform.OS === 'web' ? 15 : 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    ...(Platform.OS === 'web' && {
      maxWidth: 700,
    }),
  },

  scrollTopButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      maxWidth: 280,
      cursor: 'pointer',
    }),
  },

  scrollTopButtonPressed: {
    backgroundColor: '#2563EB',
  },

  scrollTopText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },

  scrollTopTextPressed: {
    color: '#FFFFFF',
  },

  scrollTopIcon: {
    marginLeft: 8,
  },

  // --- ESTILOS PARA ICONOS EN BOTONES ---
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonIcon: {
    marginRight: 10,
  },

  // --- RESTO DE ESTILOS (sin cambios entre web y móvil) ---
  section: {
    marginTop: 50,
    paddingHorizontal: 24,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },

  sectionText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },

  form: {
    marginTop: 24,
    paddingHorizontal: 0,
    paddingBottom: 24,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },

  formTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  formSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },

  fieldHalf: {
    flex: 1,
  },

  inputHalf: {
    flex: 1,
  },

  fieldLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 4,
  },

  fieldDescription: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 4,
    lineHeight: 18,
  },

  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 15,
    width: '100%',
  },

  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: -12,
    marginBottom: 12,
    paddingLeft: 4,
  },

  fieldError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },

  formDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
  },

  formDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },

  formDividerText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  dropdown: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  dropdownSelected: {
    color: '#F8FAFC',
    fontSize: 15,
  },

  dropdownPlaceholder: {
    color: '#64748B',
    fontSize: 15,
  },

  dropdownArrow: {
    color: '#94A3B8',
    fontSize: 14,
  },

  dropdownList: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginTop: -8,
    marginBottom: 16,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#334155',
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  dropdownItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  dropdownItemCheck: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
    width: 24,
  },

  dropdownItemText: {
    color: '#F8FAFC',
    fontSize: 15,
    flex: 1,
  },

  locationAddress: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },

  timeScrollList: {
    maxHeight: 180,
  },

  button: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
    ...(Platform.OS === 'web' && {
      maxWidth: 600,
      alignSelf: 'center',
      cursor: 'pointer',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        maxWidth: '100%',
      },
      // @ts-ignore - Media query funciona en React Native Web
      '@media (min-width: 1024px)': {
        maxWidth: 700,
      },
    }),
  },

  buttonPressed: {
    backgroundColor: '#1D4ED8',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },

  buttonTextPressed: {
    color: '#E0E7FF',
  },

  manualText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },

  manualLink: {
    color: '#3B82F6',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 24,
  },

  mapSection: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 40,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },

  mapTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  mapSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },

  mapView: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        maxWidth: '100%',
      },
    }),
  },

  mapsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      cursor: 'pointer',
      // @ts-ignore - Media query funciona en React Native Web
      '@media (max-width: 640px)': {
        maxWidth: '100%',
      },
    }),
  },

  mapsButtonPressed: {
    backgroundColor: '#2563EB',
  },

  mapsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapsButtonIcon: {
    marginRight: 10,
  },

  mapsButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },

  mapsButtonTextPressed: {
    color: '#FFFFFF',
  },

  // Fondo semitransparente del modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Contenedor del calendario dentro del modal
  calendarModal: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },

  calendarWeekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  calendarWeekLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  calendarCellToday: {
    borderWidth: 1,
    borderColor: '#2563EB',
  },

  calendarCellSelected: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },

  calendarCellPast: {
    opacity: 0.25,
  },

  // Estilos de disponibilidad de citas
  calendarCellDisponible: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)', // Verde suave
    borderWidth: 1,
    borderColor: '#22C55E',
  },

  calendarCellMedio: {
    backgroundColor: 'rgba(251, 146, 60, 0.2)', // Naranja suave
    borderWidth: 1,
    borderColor: '#FB923C',
  },

  calendarCellBajo: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Rojo suave
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  calendarCellLleno: {
    backgroundColor: 'rgba(100, 116, 139, 0.3)', // Gris
    borderWidth: 1,
    borderColor: '#64748B',
    opacity: 0.5,
  },

  calendarCellText: {
    color: '#F8FAFC',
    fontSize: 13,
  },

  calendarCellTodayText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  calendarCellSelectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  calendarCellPastText: {
    color: '#475569',
  },

  calendarCloseBtn: {
    marginTop: 14,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  calendarCloseBtnText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  calendarNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarNavText: {
    color: '#F8FAFC',
    fontSize: 22,
    lineHeight: 26,
  },

  calendarMonthLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
