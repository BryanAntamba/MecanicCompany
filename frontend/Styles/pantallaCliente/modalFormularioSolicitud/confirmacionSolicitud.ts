// confirmacionSolicitud.ts
// Estilos para el modal de confirmación de solicitud enviada

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#F1F5F9',
    flex: 1,
  },
  note: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    lineHeight: 20,
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
