
// Contactanos.ts
// Estilos de la pantalla Contactanos.tsx (sección de soporte del cliente).
// Incluye estilos para: logotipo animado, tarjetas de contacto,

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Página raíz — fondo negro para toda la pantalla
  page: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Contenido del ScrollView con espacio inferior para que el último elemento no quede pegado
  scrollContent: {
    paddingBottom: 40,
  },

  // Sección del logotipo: centrada con padding vertical generoso
  logoSection: {
    alignItems: 'center',        // Centra el logo horizontalmente
    paddingVertical: 32,         // Espacio arriba y abajo del logo
    backgroundColor: '#000000',  // Fondo negro para continuidad visual
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
});
