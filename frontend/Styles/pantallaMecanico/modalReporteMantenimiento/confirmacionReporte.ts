// confirmacionReporte.ts
// Estilos para el modal de confirmación de envío de reporte (basado en visualizarPerfilMecanico.ts)

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  infoContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#F1F5F9',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  field: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  costoTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelarPressed: {
    backgroundColor: '#E2E8F0',
  },
  btnCancelarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
    textAlign: 'center',
  },
  btnCancelarTextPressed: {
    color: '#1E293B',
  },
  btnEnviar: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEnviarPressed: {
    backgroundColor: '#2563EB',
  },
  btnEnviarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  btnEnviarTextPressed: {
    color: '#F1F5F9',
  },
});
