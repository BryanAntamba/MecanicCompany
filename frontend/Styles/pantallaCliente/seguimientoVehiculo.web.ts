// seguimientoVehiculo.web.ts
// Estilos web para la pantalla de seguimiento vehicular

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  scrollContent: {
    flexGrow: 1,
    overflow: 'visible',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0b1120',
    overflow: 'visible',
    '@media (min-width: 768px)': {
      paddingHorizontal: 40,
    },
    '@media (min-width: 1024px)': {
      paddingHorizontal: 60,
    },
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    '@media (min-width: 768px)': {
      fontSize: 36,
    },
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    '@media (min-width: 768px)': {
      fontSize: 18,
      lineHeight: 28,
    },
  },
  filterContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    overflow: 'visible',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
    marginTop: 16,
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
  filterRowContainer: {
    flexDirection: 'row',
    gap: 12,
    overflow: 'visible',
    '@media (max-width: 640px)': {
      flexDirection: 'column',
      gap: 16,
    },
  },
  filterColumn: {
    flex: 1,
    zIndex: 1,
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
    minHeight: 44,
    cursor: 'pointer',
  },
  filterDropdownText: {
    fontSize: 16,
    color: '#F1F5F9',
    flex: 1,
    marginRight: 8,
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
    minHeight: 48,
    cursor: 'pointer',
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
  dateInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F1F5F9',
  },
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
    '@media (min-width: 768px)': {
      minWidth: '30%',
    },
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryPendiente: {
    color: '#EF4444',
  },
  summaryEnProceso: {
    color: '#F59E0B',
  },
  summaryCompletado: {
    color: '#10B981',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  solicitudesContainer: {
    gap: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },
  solicitudCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    flex: 1,
    minWidth: 300,
    maxWidth: 'calc(50% - 8px)',
    '@media (max-width: 768px)': {
      maxWidth: 'none',
      minWidth: 'auto',
      flex: 'none',
      width: '100%',
    },
  },
  solicitudTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 4,
  },
  solicitudSubtitulo: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 16,
  },
  solicitudDetalle: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detalleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    width: 100,
  },
  detalleValor: {
    flex: 1,
    fontSize: 14,
    color: '#F1F5F9',
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 16,
  },
  estadoPendiente: {
    backgroundColor: '#FEE2E2',
  },
  estadoEnProceso: {
    backgroundColor: '#FEF3C7',
  },
  estadoCompletado: {
    backgroundColor: '#D1FAE5',
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  verDetallesButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    cursor: 'pointer',
  },
  verDetallesButtonPressed: {
    backgroundColor: '#2563EB',
  },
  verDetallesButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  verDetallesButtonTextPressed: {
    color: '#FFFFFF',
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
    cursor: 'pointer',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#F1F5F9',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    zIndex: 9999,
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
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    cursor: 'pointer',
  },
  calendarCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
});
