// visualizarPago.ts
// Estilos para el modal de visualización de pago (basado en registrarPago.ts)

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnPressed: {
    backgroundColor: '#B91C1C',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  pagoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  pagoMeta: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 6,
  },
  infoField: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btnCerrar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCerrarPressed: {
    backgroundColor: '#E2E8F0',
  },
  btnCerrarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnCerrarTextPressed: {
    color: '#1E293B',
  },
  closeBtnBottom: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnBottomPressed: {
    backgroundColor: '#2563EB',
  },
  closeBtnBottomText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  closeBtnBottomTextPressed: {
    color: '#FFFFFF',
  },
  btnReenviar: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnReenviarPressed: {
    backgroundColor: '#2563EB',
  },
  btnReenviarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnReenviarTextPressed: {
    color: '#F1F5F9',
  },
});
