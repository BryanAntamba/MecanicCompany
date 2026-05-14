
// cambiarPassword.ts
// Estilos de la pantalla cambiarPassword.tsx (paso final del flujo de recuperación).
// Mismo patrón visual que login.ts y restablecimientoPaswword.ts:
// imagen de fondo + capa oscura + tarjeta semitransparente + animación de entrada.


import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Imagen de fondo que ocupa toda la pantalla (fondoCodigoVerificacion.png)
  background: {
    flex: 1, // Ocupa todo el espacio disponible
  },

  // Capa oscura semitransparente encima del fondo para mejorar legibilidad
  // absoluteFillObject: posición absoluta que cubre todo el espacio del padre
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // Negro al 55% de opacidad
  },

  // KeyboardAvoidingView: ocupa toda la pantalla para gestionar el teclado
  keyboardView: {
    flex: 1,
  },

  // Contenido del ScrollView: centrado verticalmente con padding
  scrollContent: {
    flexGrow: 1,              // Permite que el contenido crezca para centrado vertical
    justifyContent: 'center', // Centra la tarjeta verticalmente en la pantalla
    paddingHorizontal: 24,    // Margen lateral de 24px
    paddingVertical: 48,      // Margen vertical de 48px
  },

  // Tarjeta principal del formulario con fondo azul muy oscuro semitransparente
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Azul muy oscuro al 85% de opacidad
    borderRadius: 24,                           // Bordes muy redondeados
    padding: 28,                                // Relleno interno generoso
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',       // Borde sutil semitransparente
  },

  // Icono transparente de la empresa centrado en la parte superior de la tarjeta
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',  // Centrado horizontalmente
    marginBottom: 24,     // Separación inferior respecto al título
  },

  // Título "NUEVA CONTRASEÑA" en mayúsculas
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
    marginBottom: 20,
  },

  // Etiqueta encima de cada campo de contraseña
  label: {
    color: '#CBD5E1',    // Gris claro
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,       // Pequeño margen izquierdo para alineación visual
  },

  // Fila que contiene el input de contraseña + botón ojo en la misma línea
  // El borde está en la fila, no en el input, para que parezcan un solo elemento
  passwordRow: {
    flexDirection: 'row',    // Input y botón en fila horizontal
    alignItems: 'center',    // Centra verticalmente el botón ojo
    backgroundColor: '#111827', // Fondo oscuro del campo
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,        // Separación entre campos
    paddingRight: 14,        // Espacio para el botón ojo a la derecha
  },

  // Input de contraseña dentro de la fila (ocupa todo el espacio menos el botón)
  passwordInput: {
    flex: 1,                 // Ocupa todo el ancho disponible menos el botón ojo
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  // Botón del ícono ojo (mostrar/ocultar contraseña)
  eyeBtn: {
    padding: 4,              // Área de toque mínima alrededor del ícono
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

  // Botón principal "Guardar contraseña" — blanco en reposo
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
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

  // Fila del enlace "← Volver atrás" centrado
  backRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },

  // Texto del enlace volver — blanco
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Mensaje de éxito inline — verde, se muestra debajo del botón sin modal
  successText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
});
