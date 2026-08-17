
// Contactanos.ts
// Estilos de la pantalla Contactanos.tsx (sección de soporte del cliente).
// Incluye estilos para: logotipo animado, tarjetas de contacto, dropdown de ubicaciones

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Página raíz — fondo negro para toda la pantalla
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },

  // Contenido del ScrollView con espacio inferior para que el último elemento no quede pegado
  scrollContent: {
    flexGrow: 1, // Permite que el contenido crezca y el footer se quede abajo
  },

  // Sección del logotipo: centrada con padding vertical generoso
  logoSection: {
    alignItems: 'center',        // Centra el logo horizontalmente
    paddingVertical: 32,         // Espacio arriba y abajo del logo
    backgroundColor: '#0b1120',  // Fondo negro para continuidad visual
  },

  // Logotipo de la empresa — grande para impacto visual
  logo: {
    width: 300,
    height: 300,
    borderRadius: 24,            // Bordes redondeados
  },

  // Sección genérica con padding horizontal (usada para contacto y ubicación)
  section: {
    marginTop: 8,
    paddingHorizontal: 16,       // Margen lateral de 16px
    marginBottom: 16,
  },

  // Título de sección centrado (ej: "CONTACTANOS", "Ubicación Mecánica")
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },

  // Subtítulo descriptivo centrado debajo del título
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Tarjeta de contacto: fila horizontal con ícono + texto + flecha
  contactCard: {
    flexDirection: 'row',        // Elementos en fila horizontal
    alignItems: 'center',        // Centra verticalmente todos los elementos
    backgroundColor: '#111827',  // Fondo oscuro de la tarjeta
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,            // Separación entre tarjetas
  },

  // Caja cuadrada que contiene el ícono de contacto (teléfono, WhatsApp, etc.)
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,            // Bordes redondeados de la caja del ícono
    backgroundColor: '#1E293B',  // Fondo ligeramente más claro que la tarjeta
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,             // Separación entre el ícono y el texto
  },

  // Bloque de texto de la tarjeta (etiqueta + valor)
  contactInfo: {
    flex: 1,                     // Ocupa todo el espacio disponible entre el ícono y la flecha
  },

  // Etiqueta pequeña encima del valor (ej: "Teléfono", "WhatsApp")
  contactLabel: {
    color: '#64748B',            // Gris medio para texto secundario
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },

  // Valor principal de la tarjeta (ej: "+593 99 999 9999")
  contactValue: {
    color: '#F8FAFC',            // Blanco para el dato principal
    fontSize: 14,
    fontWeight: '500',
  },

  // Título centrado de la sección de ubicación
  locationTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Dirección del taller centrada debajo del título
  locationAddress: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 22,              // Interlineado para múltiples líneas
    textAlign: 'center',
    marginBottom: 14,
  },

  // Mapa embebido con react-native-maps
  map: {
    height: 300,                 // Altura fija del mapa
    borderRadius: 16,
    overflow: 'hidden',          // Recorta el mapa a los bordes redondeados
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },

  // Botón "Abrir Google Maps" — blanco en reposo
  mapsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },

  // Estado presionado del botón — azul
  mapsButtonPressed: {
    backgroundColor: '#2563EB',
  },

  // Fila interior del botón: ícono de pin + texto en fila horizontal
  mapsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Ícono de pin de ubicación con separación del texto
  mapsButtonIcon: {
    marginRight: 10,
  },

  // Texto del botón — negro en reposo
  mapsButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Texto del botón al presionar — blanco
  mapsButtonTextPressed: {
    color: '#FFFFFF',
  },

  // Estilos para el dropdown de ubicaciones
  dropdownWrapper: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelected: {
    fontSize: 14,
    color: '#F1F5F9',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
  },
  dropdownScrollView: {
    maxHeight: 250,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  dropdownItemActive: {
    backgroundColor: '#1E293B',
  },
  dropdownItemCheck: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#F1F5F9',
    flex: 1,
  },
  locationSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },

  // --- PIE DE PÁGINA (FOOTER) ---
  footer: {
    paddingHorizontal: 20,      // Relleno horizontal
    paddingVertical: 30,        // Relleno vertical
    paddingBottom: 40,          // Espacio adicional para no quedar pegado al menú del teléfono
    backgroundColor: '#000000', // Fondo negro puro igual que el page
  },

  // Texto de derechos de autor
  copyrightText: {
    color: '#CBD5E1',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },

  // Botón "Regresar Arriba" — blanco en reposo
  scrollTopButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // Estado presionado del botón — azul
  scrollTopButtonPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón — negro en reposo
  scrollTopText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 8,
  },

  // Texto del botón al presionar — blanco
  scrollTopTextPressed: {
    color: '#FFFFFF',
  },

  // Ícono del botón
  scrollTopIcon: {
    marginLeft: 4,
  },
});
