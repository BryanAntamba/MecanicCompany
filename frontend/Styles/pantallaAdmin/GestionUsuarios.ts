// GestionUsuarios.ts
// Estilos para la pantalla de gestión de usuarios y mecánicos

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
  
  // Botones de registro
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  registerBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnPressed: {
    backgroundColor: '#2563EB',
  },
  registerBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  registerBtnTextPressed: {
    color: '#FFFFFF',
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
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Cartillas de usuarios
  usuariosContainer: {
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userFoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F172A',
    marginRight: 16,
  },
  userFotoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  userMeta: {
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
    color: '#0F172A',
  },
  // Estados de conexión
  badgeLinea: {
    backgroundColor: '#D1FAE5', // Verde claro
  },
  badgeDesconectado: {
    backgroundColor: '#E2E8F0', // Gris claro
  },
  badgeSuspendido: {
    backgroundColor: '#FEE2E2', // Rojo claro
  },
  // Rol (colores como texto oscuro sobre fondo claro)
  badgeRolMecanico: {
    backgroundColor: '#E9D5FF', // Morado claro
  },
  badgeRolAdmin: {
    backgroundColor: '#DBEAFE', // Azul claro
  },
  // Botones
  // Botón principal (Ver Perfil)
  btnPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnPerfilPressed: {
    backgroundColor: '#2563EB',
  },
  btnPerfilText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnPerfilTextPressed: {
    color: '#FFFFFF',
  },
  // Botones secundarios (verticales, uno abajo del otro)
  btnSecundario: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnSecundarioText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnSecundarioTextPressed: {
    color: '#F1F5F9',
  },
  // Botón Editar
  btnEdit: {
    backgroundColor: '#3B82F6',
  },
  btnEditPressed: {
    backgroundColor: '#2563EB',
  },
  // Botón Eliminar
  btnDelete: {
    backgroundColor: '#EF4444',
  },
  btnDeletePressed: {
    backgroundColor: '#DC2626',
  },
  // Botón Toggle Cuenta
  btnToggleOn: {
    backgroundColor: '#F59E0B',
  },
  btnToggleOnPressed: {
    backgroundColor: '#D97706',
  },
  btnToggleOff: {
    backgroundColor: '#10B981',
  },
  btnToggleOffPressed: {
    backgroundColor: '#059669',
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
});
