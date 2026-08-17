// detallesSolicitud.ts
// Estilos para el modal de detalles de solicitud

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
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    maxHeight: 400,
  },
  dataRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    color: '#F1F5F9',
  },
  estadoPendiente: {
    color: '#EF4444', // Rojo para PENDIENTE
    fontWeight: 'bold',
  },
  estadoEnProceso: {
    color: '#F59E0B', // Naranja para EN PROCESO
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
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
