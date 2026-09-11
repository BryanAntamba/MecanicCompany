// financiero.ts
// Estilos de la pantalla del sistema financiero con diseño de cartillas

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

  // Título y subtítulo principal (estilo sistemaInventario)
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },

  // Botón de análisis avanzado (estilo sistemaInventario - botón blanco)
  btnAnalisisAvanzado: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnAnalisisAvanzadoPressed: {
    backgroundColor: '#2563EB',
  },
  btnAnalisisAvanzadoText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnAnalisisAvanzadoTextPressed: {
    color: '#FFFFFF',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActiva: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  tabTextActiva: {
    color: '#FFFFFF',
  },

  // Filtros (estilo sistemaInventario)
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
    fontSize: 16,
    color: '#F1F5F9',
  },
  dropdown: {
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
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#F1F5F9',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748B',
  },
  dropdownMenu: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#F1F5F9',
  },

  // Resumen de estadísticas (estilo sistemaInventario)
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
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Resultados
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },

  // Contenedor de cartillas (estilo sistemaInventario)
  pagosContainer: {
    gap: 16,
  },

  // Cartilla de pago (estilo sistemaInventario)
  pagoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pagoContent: {
    flex: 1,
  },
  pagoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pagoId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: 0.5,
  },
  pagoEstado: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pagoEstadoPendiente: {
    backgroundColor: '#F59E0B',
    color: '#000000',
  },
  pagoEstadoPagado: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
  },
  pagoMeta: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 6,
  },
  pagoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  costoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  costoLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  costoValue: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  metodoPagoLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  metodoPagoValue: {
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '600',
    marginBottom: 4,
  },
  // Botón registrar pago (estilo sistemaInventario - blanco)
  btnRegistrarPago: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  btnRegistrarPagoPressed: {
    backgroundColor: '#2563EB',
  },
  btnRegistrarPagoText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnRegistrarPagoTextPressed: {
    color: '#FFFFFF',
  },

  // Calendarios
  calendarOverlay: {
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
});
