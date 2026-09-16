// ReportesClientes.web.ts
// Estilos web responsive para la pantalla de gestión de solicitudes del panel mecánico

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  
  // Botones de registro - Ajustados para web
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  registerBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
    minWidth: 250,
    '@media (max-width: 640px)': {
      width: '100%',
      maxWidth: '100%',
    },
  },
  registerBtnPressed: {
    backgroundColor: '#2563EB',
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  registerBtnTextPressed: {
    color: '#FFFFFF',
  },

  // Contenedor de filtros
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
  
  // Fila de filtros - Responsive lado a lado
  filterRowContainer: {
    flexDirection: 'row',
    gap: 12,
    '@media (max-width: 1024px)': {
      flexDirection: 'column',
      gap: 0,
    },
  },
  filterColumn: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterHalf: {
    flex: 1,
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
    flex: 1,
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
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    flex: 1,
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

  // Resumen de tarjetas
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
    '@media (max-width: 640px)': {
      minWidth: '100%',
    },
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Contenedor de solicitudes - Base
  solicitudesContainer: {
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },

  // Cartilla de solicitud - Base (estilos inline en JSX para responsive)
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgePendiente: {
    backgroundColor: '#FEE2E2',
  },
  badgeProceso: {
    backgroundColor: '#FEF3C7',
  },
  badgeCompletado: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnPrimary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    cursor: 'pointer',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
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
    cursor: 'pointer',
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
  btnEnviarReporte: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnEnviarReportePressed: {
    backgroundColor: '#059669',
  },
  btnEnviarReporteLocked: {
    backgroundColor: '#6B7280',
  },
  btnEnviarReporteText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnEnviarReporteTextPressed: {
    color: '#F1F5F9',
  },

  // Botón Generar Autorización
  btnGenerarAutorizacion: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
    cursor: 'pointer',
  },
  btnGenerarAutorizacionPressed: {
    backgroundColor: '#2563EB',
  },
  btnGenerarAutorizacionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnGenerarAutorizacionTextPressed: {
    color: '#F1F5F9',
  },

  btnEnviarReporteTextLocked: {
    color: '#D1D5DB',
  },

  // Modales de calendario
  modalOverlay: {
    flex: 1,
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
});
