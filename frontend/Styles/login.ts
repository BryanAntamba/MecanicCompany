
// login.ts
// Estilos de la pantalla login.tsx (inicio de sesión del sistema).
// Patrón visual: imagen de fondo + capa oscura + tarjeta semitransparente
// con animación de entrada desde abajo. Mismo patrón en restablecimiento y cambio.


import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Imagen de fondo fondoLogin.png que ocupa toda la pantalla
  background: {
    flex: 1, // Ocupa todo el espacio disponible del dispositivo
  },

  // Capa oscura semitransparente encima del fondo para mejorar legibilidad del texto
  // absoluteFillObject: posición absoluta que cubre exactamente todo el espacio del padre
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // Negro al 55% de opacidad
  },

  // KeyboardAvoidingView: ocupa toda la pantalla para gestionar el desplazamiento del teclado
  keyboardView: {
    flex: 1,
  },

  // Contenido del ScrollView centrado verticalmente en la pantalla
  scrollContent: {
    flexGrow: 1,              // Permite que el contenido crezca para el centrado vertical
    justifyContent: 'center', // Centra la tarjeta verticalmente
    paddingHorizontal: 24,    // Margen lateral de 24px
    paddingVertical: 48,      // Margen vertical de 48px
  },

  // Tarjeta principal del formulario con fondo azul muy oscuro semitransparente
  card: {
    backgroundColor: 'rgba(28, 33, 47, 0.85)', // Azul muy oscuro al 85% de opacidad
    borderRadius: 24,                           // Bordes muy redondeados
    padding: 28,                                // Relleno interno generoso
    borderWidth: 1,
    borderColor: 'rgba(43, 54, 70, 0.6)',       // Borde sutil semitransparente
  },

  // Logo de la empresa (iconoTransparente.png) centrado en la parte superior de la tarjeta
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',  // Centrado horizontalmente dentro de la tarjeta
    borderRadius: 24,     // Bordes redondeados del logo
    marginBottom: 24,     // Separación inferior respecto al título
  },

  // Título "INICIA SESION" en mayúsculas
  title: {
    color: '#F8FAFC',    // Blanco casi puro
    fontSize: 26,
    fontWeight: '800',   // Extra negrita
    textAlign: 'center',
    marginBottom: 8,
  },

  // Subtítulo descriptivo debajo del título
  subtitle: {
    color: '#94A3B8',    // Gris azulado para texto secundario
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Campo de texto base (correo electrónico)
  input: {
    backgroundColor: '#111827', // Fondo oscuro del campo
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    color: '#F8FAFC',            // Texto blanco
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 14,            // Separación entre campos
  },

  // Fila que contiene el input de contraseña + botón ojo en la misma línea
  // El borde está en la fila para que parezcan un solo elemento visual
  passwordRow: {
    flexDirection: 'row',    // Input y botón ojo en fila horizontal
    alignItems: 'center',    // Centra verticalmente el botón ojo con el input
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
    paddingRight: 14,        // Espacio para el botón ojo a la derecha
  },

  // Input de contraseña dentro de la fila (ocupa todo el espacio menos el botón ojo)
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

  // Fila del enlace "¿Olvidaste tu contraseña?" centrado horizontalmente
  forgotRow: {
    alignItems: 'center',    // Centra el enlace horizontalmente
    marginBottom: 20,        // Separación respecto al botón de login
  },

  // Texto del enlace de recuperación de contraseña — blanco
  forgotText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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

  // Botón principal "Iniciar sesión" — blanco en reposo
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',    // Centra el texto del botón horizontalmente
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
    letterSpacing: 0.5,      // Ligero espaciado entre letras para estilo de botón
  },

  // Texto del botón al presionar — blanco
  buttonTextPressed: {
    color: '#FFFFFF',
  },
});
