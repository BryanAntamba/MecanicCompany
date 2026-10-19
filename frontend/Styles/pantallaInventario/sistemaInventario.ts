// sistemaInventario.ts
// Estilos para la pantalla de gestión de inventario

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

  // Botón Ingresar Producto
  ingresarBtn: {
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
  ingresarBtnPressed: {
    backgroundColor: '#2563EB',
  },
  ingresarBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  ingresarBtnTextPressed: {
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
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F1F5F9',
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
    flex: 1,
    fontSize: 16,
    color: '#F1F5F9',
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
  summaryCardWide: {
    minWidth: '100%',
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

  // Productos
  productosContainer: {
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },
  productCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  productMeta: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 6,
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
  productCompatibility: {
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '600',
    marginBottom: 4,
  },
  productYears: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  productExtra: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockText: {
    fontSize: 15,
    color: '#F1F5F9',
  },
  stockBadge: {
    fontSize: 14,
    fontWeight: '700',
  },
  precioLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  precioText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 16,
  },
  botonesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  // Botón primario (VER DETALLES)
  btnPrimario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnPrimarioPressed: {
    backgroundColor: '#2563EB',
  },
  btnPrimarioText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  btnPrimarioTextPressed: {
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
  // Botón Toggle - Activar
  btnToggleOn: {
    backgroundColor: '#F59E0B',
  },
  btnToggleOnPressed: {
    backgroundColor: '#D97706',
  },
  // Botón Toggle - Desactivar
  btnToggleOff: {
    backgroundColor: '#10B981',
  },
  btnToggleOffPressed: {
    backgroundColor: '#059669',
  },
});