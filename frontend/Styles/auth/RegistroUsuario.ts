// RegistroUsuario.ts
// Estilos de la pantalla registroUsuario.tsx (registro de nuevos usuarios).
// Patrón visual: mismo diseño que login.tsx con imagen de fondo + capa oscura
// pero adaptado para formulario más largo con múltiples campos

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Imagen de fondo que ocupa toda la pantalla
  background: {
    flex: 1,
  },

  // KeyboardAvoidingView: ocupa toda la pantalla para gestionar el desplazamiento del teclado
  keyboardView: {
    flex: 1,
  },

  // Contenido del ScrollView con padding para el formulario
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
    backgroundColor: 'rgba(28, 33, 47, 0.9)',
    borderRadius: 20,
  },

  // Contenedor del logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  // Logo de la empresa - mismo tamaño que login
  logo: {
    width: 140,
    height: 140,
    borderRadius: 24,
  },

  // Título "Registro de Usuario"
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Subtítulo descriptivo
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Contenedor del formulario con fondo semitransparente
  formContainer: {
    backgroundColor: 'rgba(28, 33, 47, 0.85)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(43, 54, 70, 0.6)',
  },

  // Label de cada campo del formulario
  fieldLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },

  // Campo de texto base
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 14,
  },

  // Campo con error — borde rojo
  inputError: {
    borderColor: '#EF4444',
  },

  // Campo de fecha especial con flexDirection row para alinear texto e ícono
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Texto de fecha cuando está seleccionada
  dateText: {
    color: '#F8FAFC',
    fontSize: 15,
  },

  // Placeholder de fecha cuando no está seleccionada
  datePlaceholder: {
    color: '#94A3B8',
    fontSize: 15,
  },

  // Fila que contiene el input de contraseña + botón ojo
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
    paddingRight: 14,
  },

  // Input de contraseña dentro de la fila
  passwordInput: {
    flex: 1,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  // Botón del ícono ojo
  eyeBtn: {
    padding: 4,
  },

  // Texto de error debajo de un campo
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Botón principal "Registrarse" — blanco en reposo
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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

  // Error general — centrado debajo del botón
  errorTextCentered: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
});
