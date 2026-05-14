import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Imagen de fondo que ocupa toda la pantalla
  background: {
    flex: 1,
  },

  // Capa oscura semitransparente sobre el fondo para mejorar la legibilidad
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },

  // KeyboardAvoidingView ocupa toda la pantalla
  keyboardView: {
    flex: 1,
  },

  // Contenido del ScrollView centrado verticalmente
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  // Tarjeta principal del formulario
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },

  // Logo de la empresa centrado en la tarjeta
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 24,
  },

  // Título "CÓDIGO DE VERIFICACIÓN"
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Instrucción debajo del título
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Campo de texto para ingresar el código
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 8,       // Espaciado amplio para que los dígitos se lean como código
    textAlign: 'center',    // Centra el código dentro del campo
    marginBottom: 14,
  },

  // Texto de error debajo del campo
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

  // Botón "Verificar código" — blanco en reposo
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
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

  // Texto del enlace volver
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
