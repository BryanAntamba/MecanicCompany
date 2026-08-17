// ReportesClientes.ts
// Estilos para la pantalla de gestión de solicitudes del panel mecánico

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Página raíz
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },

  // ScrollView principal
  scroll: {
    flex: 1,
  },

  // Contenido del ScrollView
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  // Título principal de la pantalla
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  // Filtros
  filterContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#F1F5F9',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterHalf: {
    flex: 1,
    zIndex: 1,
  },
  filterDropdown: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterDropdownText: {
    fontSize: 16,
    color: '#F1F5F9',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748B',
  },
  dropdownList: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 180,
    zIndex: 1000,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  dropdownItemActive: {
    backgroundColor: '#1E293B',
  },
  dropdownItemCheck: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#F1F5F9',
  },
  dateButton: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#F1F5F9',
  },

  // Resumen
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Cartillas de solicitudes
  solicitudesContainer: {
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Estados de solicitud
  badgePendiente: {
    backgroundColor: '#EF4444', // Rojo
  },
  badgeProceso: {
    backgroundColor: '#F59E0B', // Naranja
  },
  badgeCompletado: {
    backgroundColor: '#10B981', // Verde
  },

  // Botones de acción
  btnPrimary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnPrimaryPressed: {
    backgroundColor: '#2563EB',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnPrimaryTextPressed: {
    color: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnSecondaryPressed: {
    backgroundColor: '#2563EB',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  btnSecondaryTextPressed: {
    color: '#F1F5F9',
  },
  btnDelete: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnDeletePressed: {
    backgroundColor: '#DC2626',
  },
  btnDeleteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnDeleteTextPressed: {
    color: '#F1F5F9',
  },

  // Botón Enviar Factura
  btnEnviarReporte: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnEnviarReporteLocked: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  btnEnviarReportePressed: {
    backgroundColor: '#059669',
  },
  btnEnviarReporteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnEnviarReporteTextLocked: {
    color: '#64748B',
  },
  btnEnviarReporteTextPressed: {
    color: '#F1F5F9',
  },

  // Modales de calendario
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavBtn: {
    padding: 8,
  },
  calendarNavText: {
    fontSize: 32,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  calendarMonthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  calendarWeekLabel: {
    width: '14%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarCellSelected: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  calendarCellText: {
    fontSize: 14,
    color: '#F1F5F9',
  },
  calendarCellSelectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  calendarCloseBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  calendarCloseBtnPressed: {
    backgroundColor: '#2563EB',
  },
  calendarCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  calendarCloseBtnTextPressed: {
    color: '#FFFFFF',
  },
  calendarCancelBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  calendarCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },

  // Estilos para historial.tsx - Tarjetas de registros
  rowCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 8,
  },
  clientMeta: {
    fontSize: 13,
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnEdit: {
    backgroundColor: '#3B82F6',
  },
  btnEditPressed: {
    backgroundColor: '#2563EB',
  },
  btnEditText: {
    color: '#FFFFFF',
  },
  btnSend: {
    backgroundColor: '#7C3AED',
  },
  btnSendPressed: {
    backgroundColor: '#6D28D9',
  },
  btnSendText: {
    color: '#FFFFFF',
  },
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnIcon: {
    marginRight: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Estilos para modal de detalles
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalHeaderTextBlock: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  closeBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnPressed: {
    backgroundColor: '#DC2626',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sendModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionFirst: {
    marginTop: 0,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#F1F5F9',
    marginBottom: 12,
  },

  // Estilos para modal de reenvío de reporte
  sendModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendModalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  sendModalBody: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  sendModalHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 16,
  },
  sendModalBtns: {
    width: '100%',
    gap: 10,
  },
  sendModalBtnSend: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendModalBtnSendPressed: {
    backgroundColor: '#2563EB',
  },
  sendModalBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  sendModalBtnCancel: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendModalBtnCancelPressed: {
    backgroundColor: '#1E293B',
  },
  sendModalBtnCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
});

