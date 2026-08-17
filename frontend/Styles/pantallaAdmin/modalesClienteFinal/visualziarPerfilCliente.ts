// visualizarPerfilCliente.ts
// Estilos para el modal de visualizar perfil de cliente/usuario

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#F1F5F9',
  },
  valueLinea: {
    color: '#10B981',
    fontWeight: '600',
  },
  valueDesconectado: {
    color: '#64748B',
    fontWeight: '600',
  },
  valueSuspendido: {
    color: '#EF4444',
    fontWeight: '600',
  },
  valueActiva: {
    color: '#10B981',
    fontWeight: '600',
  },
  valueInactiva: {
    color: '#EF4444',
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  closeBtnPressed: {
    backgroundColor: '#2563EB',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  closeBtnTextPressed: {
    color: '#FFFFFF',
  },
});
