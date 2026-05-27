// Estilos compartidos entre ReportesClientes.tsx e historial.tsx
// Contiene estilos de tarjetas, botones de acción y modales
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Página raíz — fondo azul muy oscuro
  page: { flex: 1, backgroundColor: '#0b1120' },

  // ScrollView principal
  scroll: { flex: 1 },

  // Contenido del ScrollView con padding
  scrollContent: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },

  // Título principal de la pantalla — centrado
  screenTitle: {
    color: '#F8FAFC', fontSize: 24, fontWeight: '800', marginBottom: 6,
    letterSpacing: -0.5, textAlign: 'center',
  },

  // Subtítulo descriptivo — centrado
  screenSubtitle: { color: '#64748B', fontSize: 14, marginBottom: 20, textAlign: 'center' },

  // ── TARJETA DE CLIENTE / HISTORIAL ──

  // Tarjeta individual de cada registro — fondo casi negro
  rowCard: {
    backgroundColor: '#060D1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },

  // Nombre del cliente en la tarjeta
  clientName: { color: '#F8FAFC', fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },

  // Fila de metadata: ícono FontAwesome + texto informativo
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  // Ícono de metadata con ancho fijo para alinear todos los textos
  metaIcon: {
    width: 18,
    marginRight: 6,
  },

  // Texto de metadata (teléfono, vehículo, estado)
  clientMeta: { color: '#94A3B8', fontSize: 13, lineHeight: 18, flex: 1 },

  // Fila interior de un botón: ícono + texto alineados horizontalmente
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Ícono dentro de un botón con separación del texto
  btnIcon: {
    marginRight: 6,
  },

  // Línea divisoria entre la info de la tarjeta y los botones de acción
  divider: { height: 1, backgroundColor: '#1E293B', marginVertical: 12 },

  // Contenedor de los botones de acción (wrap para múltiples filas)
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },

  // Estilo base de cada botón de acción
  actionBtn: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1.5, marginRight: 10, marginBottom: 10,
  },

  // Texto base de cada botón de acción
  actionBtnText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },

  // Botón Editar — azul
  btnEdit: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  btnEditPressed: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  btnEditText: { color: '#FFFFFF' },
  btnEditTextPressed: { color: '#FFFFFF' },

  // Botón Eliminar — rojo
  btnDelete: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  btnDeletePressed: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
  btnDeleteText: { color: '#FFFFFF' },
  btnDeleteTextPressed: { color: '#FFFFFF' },

  // Botón Registro mantenimiento — verde
  btnMaint: { backgroundColor: '#059669', borderColor: '#047857' },
  btnMaintPressed: { backgroundColor: '#047857', borderColor: '#065f46' },
  btnMaintText: { color: '#FFFFFF' },
  btnMaintTextPressed: { color: '#FFFFFF' },

  // Botón Editar mantenimiento — naranja
  btnEditMaint: { backgroundColor: '#D97706', borderColor: '#B45309' },
  btnEditMaintPressed: { backgroundColor: '#B45309', borderColor: '#92400E' },
  btnEditMaintText: { color: '#FFFFFF' },
  btnEditMaintTextPressed: { color: '#FFFFFF' },

  // Botón Enviar reporte — morado (activo)
  btnSend: { backgroundColor: '#7C3AED', borderColor: '#6D28D9' },
  btnSendPressed: { backgroundColor: '#6D28D9', borderColor: '#5B21B6' },
  btnSendText: { color: '#FFFFFF' },
  btnSendTextPressed: { color: '#FFFFFF' },

  // Botón Enviar reporte bloqueado — gris semitransparente (sin mantenimiento registrado)
  btnSendLocked: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.5,              // Visualmente deshabilitado
  },
  btnSendLockedText: { color: '#64748B' },

  // MODAL GENÉRICO

  // Fondo semitransparente del modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center', padding: 16,
  },

  // Tarjeta principal del modal — mismo color que las tarjetas
  modalCard: {
    width: '100%', maxHeight: '90%', backgroundColor: '#060D1A',
    borderRadius: 22, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 12,
  },

  // Cabecera del modal: título + subtítulo + botón cerrar
  modalHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16,
    backgroundColor: '#060D1A', borderBottomWidth: 1, borderBottomColor: '#1E293B',
  },

  // Bloque de texto de la cabecera (título + subtítulo)
  modalHeaderTextBlock: { flex: 1, paddingRight: 12 },

  // Título del modal
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 4 },

  // Subtítulo del modal
  modalSubtitle: { color: '#64748B', fontSize: 13, lineHeight: 18 },

  // Botón cerrar (X) — rojo con X blanca
  closeBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#DC2626',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#B91C1C',
  },
  closeBtnPressed: { backgroundColor: '#B91C1C' },
  closeBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: -1 },

  // Contenido scrolleable del modal
  modalScrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 },

  // Sección dentro del modal
  modalSection: { marginTop: 22 },

  // Primera sección del modal (sin margen superior extra)
  modalSectionFirst: { marginTop: 10 },

  // Título de cada sección del modal (estilo etiqueta en mayúsculas)
  modalSectionTitle: {
    color: '#64748B', fontSize: 11, fontWeight: '800', letterSpacing: 1.4,
    textTransform: 'uppercase', marginBottom: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(51,65,85,0.65)',
  },

  // Etiqueta encima de cada campo del formulario
  label: {
    color: '#94A3B8', fontSize: 12, fontWeight: '700',
    marginBottom: 8, marginTop: 14, letterSpacing: 0.2,
  },

  // Primera etiqueta de una sección (sin margen superior)
  labelFirstInSection: { marginTop: 0 },

  // Texto de ayuda debajo de una etiqueta
  labelHint: { color: '#475569', fontSize: 12, lineHeight: 17, marginBottom: 10 },

  // Campo de texto del formulario
  input: {
    backgroundColor: 'rgba(15,23,42,0.9)', borderWidth: 1.5,
    borderColor: 'rgba(71,85,105,0.65)', borderRadius: 14,
    color: '#F8FAFC', paddingVertical: 14, paddingHorizontal: 16, fontSize: 15,
  },

  // Campo de texto multilínea (textarea)
  textarea: {
    minHeight: 100, textAlignVertical: 'top',
  },

  // Fila de dos inputs lado a lado
  formRow: { flexDirection: 'row', gap: 10 },

  // Input que ocupa la mitad del ancho en una fila
  inputHalf: { flex: 1 },

  // Botón selector (dropdown) cerrado
  dropdown: {
    backgroundColor: 'rgba(15,23,42,0.9)', borderWidth: 1.5,
    borderColor: 'rgba(71,85,105,0.65)', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },

  // Dropdown abierto — borde más visible
  dropdownOpen: { borderColor: 'rgba(100,116,139,0.85)' },

  // Texto del dropdown cuando hay selección
  dropdownText: { color: '#F8FAFC', fontSize: 15, fontWeight: '600', flex: 1 },

  // Texto del dropdown cuando no hay selección (placeholder)
  dropdownPlaceholder: { color: '#64748B', fontSize: 15, flex: 1 },

  // Flecha ▲/▼ del dropdown
  dropdownArrow: { color: '#94A3B8', fontSize: 11, fontWeight: '800' },

  // Lista desplegable de opciones
  dropdownList: {
    marginTop: 8, borderRadius: 14, borderWidth: 1.5,
    borderColor: 'rgba(51,65,85,0.8)', backgroundColor: '#111c2e',
    maxHeight: 200, overflow: 'hidden',
  },

  // Cada opción de la lista
  dropdownItem: {
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(30,41,59,0.9)',
  },

  // Última opción sin borde inferior
  dropdownItemLast: { borderBottomWidth: 0 },

  // Opción seleccionada resaltada
  dropdownItemActive: { backgroundColor: 'rgba(51,65,85,0.75)' },

  // Texto de cada opción
  dropdownItemText: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },

  // Texto de error debajo de un campo — rojo pequeño
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 10,
    marginLeft: 4,
    marginRight: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  // Campo con error — borde rojo
  inputError: {
    borderColor: '#EF4444',
  },

  // Botón guardar cambios — blanco en reposo, azul al presionar
  saveBtn: {
    marginTop: 28, marginBottom: 4, backgroundColor: '#FFFFFF',
    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
  },
  saveBtnPressed: { backgroundColor: '#2563EB' },
  saveBtnText: { color: '#0f172a', fontWeight: '800', fontSize: 16 },
  saveBtnTextPressed: { color: '#FFFFFF' },

  // MODAL ENVIAR / CONFIRMAR

  // Fondo del modal de envío (centrado)
  sendModalOverlay: {
    flex: 1, backgroundColor: 'rgba(2,6,23,0.82)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },

  // Tarjeta del modal de envío
  sendModalCard: {
    width: '100%', backgroundColor: '#060D1A', borderRadius: 20,
    borderWidth: 1, borderColor: '#1E293B', padding: 24,
  },

  // Título del modal de envío
  sendModalTitle: {
    color: '#F8FAFC', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 12,
  },

  // Cuerpo del modal de envío
  sendModalBody: {
    color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24,
  },

  // Texto resaltado en azul (nombre del cliente, correo)
  sendModalHighlight: { color: '#2563EB', fontWeight: '700' },

  // Fila de botones del modal de envío
  sendModalBtns: { flexDirection: 'row', gap: 12 },

  // Botón principal del modal (Enviar al correo) — azul
  sendModalBtnSend: {
    flex: 1, backgroundColor: '#2563EB', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  sendModalBtnSendPressed: { backgroundColor: '#1D4ED8' },

  // Botón eliminar del modal de confirmación — rojo
  sendModalBtnDelete: {
    flex: 1, backgroundColor: '#DC2626', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  sendModalBtnDeletePressed: { backgroundColor: '#B91C1C' },

  // Botón cancelar del modal — gris oscuro
  sendModalBtnCancel: {
    flex: 1, backgroundColor: '#1E293B', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155',
  },
  sendModalBtnCancelPressed: { backgroundColor: '#334155' },

  // Texto de los botones del modal
  sendModalBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  sendModalBtnCancelText: { color: '#94A3B8', fontWeight: '700', fontSize: 15 },
});
