// reenvioReporte.ts
// Estilos para el modal de reenvío exitoso (basado en reporteExitoso.ts)

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
    marginBottom: 16,
    lineHeight: 24,
  },
  nombreDestacado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  correoDestacado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 24,
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
    backgroundColor: '#E2E8F0',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  closeButtonTextPressed: {
    color: '#1E293B',
  },
});
