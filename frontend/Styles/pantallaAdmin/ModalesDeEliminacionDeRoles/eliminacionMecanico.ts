// eliminacionMecanico.ts
// Estilos para el modal de eliminar mecánico

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
    backgroundColor: '#EF4444',
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
    marginBottom: 8,
    lineHeight: 24,
  },
  nombreDestacado: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  advertencia: {
    fontSize: 14,
    color: '#F87171',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCancelarPressed: {
    backgroundColor: '#E2E8F0',
  },
  btnCancelarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnCancelarTextPressed: {
    color: '#1E293B',
  },
  btnEliminar: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnEliminarPressed: {
    backgroundColor: '#DC2626',
  },
  btnEliminarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnEliminarTextPressed: {
    color: '#F1F5F9',
  },
});
