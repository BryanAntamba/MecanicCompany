// confirmacionRegistro.ts
// Estilos del modal de confirmación de registro exitoso
// Estilo similar al contenedor del login con fondo azul oscuro semitransparente

import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Contenedor del modal que ocupa toda la pantalla con fondo semitransparente
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // Tarjeta del modal centrada - mismo estilo que login
  modalContent: {
    backgroundColor: 'rgba(28, 33, 47, 0.95)', // Mismo azul oscuro que login
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(43, 54, 70, 0.6)', // Mismo borde que login
    minWidth: 300,
    maxWidth: 340,
  },

  // Contenedor del ícono de check con fondo verde circular
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Título del modal "Registro exitoso"
  title: {
    color: '#F8FAFC', // Mismo blanco que login
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },

  // Mensaje descriptivo del modal
  message: {
    color: '#94A3B8', // Mismo gris azulado que login
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
