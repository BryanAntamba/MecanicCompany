// Estilos del footer del cliente
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Contenedor principal del footer
  footer: {
    backgroundColor: '#0a0a0a',  // Un poco más oscuro que el fondo del index (#000000)
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',   // Borde sutil en la parte superior
    marginTop: 0,                // Pegado al contenido anterior
  },

  // Texto de derechos de autor
  copyrightText: {
    color: '#94A3B8',            // Gris claro para el texto
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 600,               // Limita el ancho en pantallas grandes
  },

  // Botón para regresar arriba - BLANCO con texto negro (estilo SOLICITA TU CITA)
  scrollTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',  // Fondo blanco
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 6,
    minWidth: 220,
  },

  // Estado pressed del botón - AZUL
  scrollTopButtonPressed: {
    backgroundColor: '#2563EB',  // Azul al presionar
  },

  // Ícono de flecha hacia arriba - DESPUÉS del texto
  scrollTopIcon: {
    marginLeft: 8,               // Margen a la izquierda (después del texto)
  },

  // Texto del botón - NEGRO en reposo
  scrollTopText: {
    color: '#000000',            // Texto negro
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Texto pressed - BLANCO
  scrollTopTextPressed: {
    color: '#FFFFFF',            // Blanco al presionar
  },
});
