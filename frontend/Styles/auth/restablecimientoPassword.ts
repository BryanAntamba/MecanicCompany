
// restablecimientoPaswword.ts
// Estilos de la pantalla restablecimientoPassword.tsx (paso 1 del flujo de
// recuperación de contraseña). Mismo patrón visual que login.ts:
// imagen de fondo + capa oscura + tarjeta semitransparente + animación de entrada.

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Imagen de fondo fondoRestablecer.png que ocupa toda la pantalla
  background: {
    flex: 1, // Ocupa todo el espacio disponible del dispositivo
  },

  // Capa oscura semitransparente encima del fondo para mejorar legibilidad
  // absoluteFillObject: posición absoluta que cubre exactamente todo el espacio del padre
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // Negro al 55% de opacidad
  },

  // KeyboardAvoidingView: ocupa toda la pantalla para gestionar el teclado en iOS
  keyboardView: {
    flex: 1,
  },

  // Contenido del ScrollView con mejor espaciado
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,    
    paddingTop: 50,            // Espacio balanceado arriba
    paddingBottom: 40,
  },

  // Botón regresar - ahora con posición normal, no absoluta
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
  },

  // Tarjeta principal del formulario con fondo azul muy oscuro semitransparente
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Azul muy oscuro al 85% de opacidad
    borderRadius: 24,                           // Bordes muy redondeados
    padding: 28,                                // Relleno interno generoso
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',       // Borde sutil semitransparente
  },

  // Icono transparente de la empresa (iconoTransparente.png) centrado en la tarjeta
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',  // Centrado horizontalmente dentro de la tarjeta
    marginBottom: 24,     // Separación inferior respecto al título
  },

  // Título "¿OLVIDASTE TU CONTRASEÑA?" en mayúsculas
  title: {
    color: '#F8FAFC',    // Blanco casi puro
    fontSize: 24,
    fontWeight: '800',   // Extra negrita
    textAlign: 'center',
    marginBottom: 8,
  },

  // Instrucción descriptiva debajo del título
  subtitle: {
    color: '#94A3B8',    // Gris azulado para texto secundario
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Campo de texto para ingresar el correo electrónico
  input: {
    backgroundColor: '#111827', // Fondo oscuro del campo
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    color: '#F8FAFC',            // Texto blanco
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 14,            // Separación inferior respecto al botón
  },

  // Texto de error debajo de un campo — rojo pequeño
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Campo con error — borde rojo
  inputError: {
    borderColor: '#EF4444',
  },

  // Botón "Restablecer contraseña" — blanco en reposo
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',        // Centra el texto del botón horizontalmente
    marginBottom: 16,            // Separación inferior respecto al enlace volver
  },

  // Estado presionado del botón — azul
  buttonPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón — negro en reposo
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Texto del botón al presionar — blanco
  buttonTextPressed: {
    color: '#FFFFFF',
  },

  // Fila del enlace "← Volver al inicio de sesión" centrado
  backRow: {
    alignItems: 'center',        // Centra el enlace horizontalmente
    paddingVertical: 4,
  },

  // Texto del enlace volver — blanco
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
