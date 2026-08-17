// eliminacionExitosa.ts
// Estilos para el modal de eliminación exitosa

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  nombreDestacado: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonPressed: {
    backgroundColor: '#2563EB',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  closeButtonTextPressed: {
    color: '#FFFFFF',
  },
});
