
// GestionMecanicos.ts
// Estilos de la pantalla GestionMecanicos.tsx (panel de administración).
// Incluye estilos para: página, lista de mecánicos, tarjetas, badges de estado,
// botones de acción y el modal de registro/edición.


import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Página raíz — fondo azul muy oscuro del panel admin
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },

  // ScrollView principal que contiene la lista de mecánicos
  scroll: {
    flex: 1,
  },

  // Contenido del ScrollView con padding
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },

  // Título centrado "Gestión de mecánicos"
  screenTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,  // Ligero ajuste de espaciado para títulos grandes
    textAlign: 'center',
  },

  // Subtítulo informativo centrado
  screenSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Botón "Registrar mecánico" — blanco en reposo, alineado a la izquierda
  registerBtn: {
    alignSelf: 'flex-start',     // No ocupa todo el ancho
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 22,
    // Sombra para dar profundidad al botón
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,                // Sombra en Android
  },

  // Estado presionado del botón registrar — azul
  registerBtnPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón registrar — negro en reposo
  registerBtnText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // Texto del botón registrar al presionar — blanco
  registerBtnTextPressed: {
    color: '#FFFFFF',
  },

  // Cabecera de la lista: "Equipo" a la izquierda, "N mecánicos" a la derecha
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  // Etiqueta "EQUIPO" en mayúsculas con espaciado de letras
  listHeaderTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Contador de mecánicos registrados
  listHeaderCount: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },

  // Tarjeta individual de cada mecánico — fondo casi negro
  rowCard: {
    backgroundColor: '#060D1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    // Sombra para dar profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },

  // Parte superior de la tarjeta: nombre/meta a la izquierda, badges a la derecha
  rowCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  // Bloque de nombre y metadata del mecánico
  nameBlock: {
    flex: 1,
    minWidth: 0,  // Permite que el texto se recorte si es muy largo
  },

  // Nombre completo del mecánico
  mechanicName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // Metadata secundaria: edad y especialidad
  mechanicMeta: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },

  // Fila de badges (pills) de estado laboral y cuenta
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',            // Permite que los badges pasen a la siguiente línea
    justifyContent: 'flex-end',  // Alineados a la derecha
    maxWidth: '48%',             // Máximo la mitad del ancho de la tarjeta
  },

  // Estilo base de cada badge (pill) de estado
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,           // Completamente redondeado (forma de pastilla)
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 6,
  },

  // Texto base de cada badge
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Badge "Disponible" — verde
  pillDisponible: { backgroundColor: '#16a34a', borderColor: '#15803d' },
  pillDisponibleText: { color: '#FFFFFF' },

  // Badge "Ocupado" — naranja
  pillOcupado: { backgroundColor: '#d97706', borderColor: '#b45309' },
  pillOcupadoText: { color: '#FFFFFF' },

  // Badge "Inactivo" — gris
  pillLabInactivo: { backgroundColor: '#64748b', borderColor: '#475569' },
  pillLabInactivoText: { color: '#FFFFFF' },

  // Badge "Cuenta activa" — azul
  pillCuentaOn: { backgroundColor: '#0284c7', borderColor: '#0369a1' },
  pillCuentaOnText: { color: '#FFFFFF' },

  // Badge "Cuenta inactiva" — rojo
  pillCuentaOff: { backgroundColor: '#e11d48', borderColor: '#be123c' },
  pillCuentaOffText: { color: '#FFFFFF' },

  // Línea divisoria entre la info del mecánico y los botones de acción
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 14,
  },

  // Fila de botones de acción (Editar, Eliminar, Activar/Desactivar)
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Los botones pasan a la siguiente línea si no caben
    marginTop: 2,
  },

  // Estilo base de cada botón de acción
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 0,
    marginRight: 10,
    marginBottom: 10,
  },

  // Texto base de cada botón de acción
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Fila interior de un botón: ícono FontAwesome + texto en fila horizontal
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Ícono dentro del botón con separación del texto
  btnIcon: {
    marginRight: 6,
  },

  // Botón Editar — azul sólido
  btnEdit: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  btnEditPressed: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  btnEditText: { color: '#FFFFFF' },
  btnEditTextPressed: { color: '#FFFFFF' },

  // Botón Eliminar — rojo sólido
  btnDelete: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  btnDeletePressed: { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
  btnDeleteText: { color: '#FFFFFF' },
  btnDeleteTextPressed: { color: '#FFFFFF' },

  // Botón Desactivar cuenta — gris (para cuentas activas)
  btnCuentaOn: { backgroundColor: '#475569', borderColor: '#475569' },
  btnCuentaOnPressed: { backgroundColor: '#334155', borderColor: '#334155' },
  btnCuentaOnText: { color: '#FFFFFF' },
  btnCuentaOnTextPressed: { color: '#FFFFFF' },

  // Botón Activar cuenta — verde (para cuentas inactivas)
  btnCuentaOff: { backgroundColor: '#059669', borderColor: '#047857' },
  btnCuentaOffPressed: { backgroundColor: '#047857', borderColor: '#065f46' },
  btnCuentaOffText: { color: '#FFFFFF' },
  btnCuentaOffTextPressed: { color: '#FFFFFF' },

  // ── MODAL DE REGISTRO / EDICIÓN ──

  // Fondo semitransparente del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    justifyContent: 'center',
    padding: 18,
  },

  // Tarjeta principal del modal — mismo color que las tarjetas de mecánicos
  modalCard: {
    width: '100%',
    maxHeight: 620,              // Altura máxima para que quepa en pantallas pequeñas
    alignSelf: 'center',
    backgroundColor: '#060D1A',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',          // Recorta el contenido a los bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  // Cabecera del modal: título + subtítulo + badge + botón cerrar
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#060D1A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  // Bloque de texto de la cabecera (título + subtítulo + badge)
  modalHeaderTextBlock: {
    flex: 1,
    paddingRight: 12,            // Espacio para el botón cerrar
  },

  // Título del modal (ej: "Registrar mecánico" / "Editar mecánico")
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },

  // Subtítulo con instrucciones contextuales
  modalSubtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Badge que indica el modo del modal ("Nuevo ingreso" / "Edición")
  modalBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(51, 65, 85, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },

  // Texto del badge en mayúsculas
  modalBadgeText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // Botón X para cerrar el modal — rojo con X blanca
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B91C1C',
  },

  // Estado presionado del botón cerrar — rojo más oscuro
  closeBtnPressed: {
    backgroundColor: '#B91C1C',
    borderColor: '#991B1B',
  },

  // Texto X del botón cerrar — blanco
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1,               // Ajuste fino de alineación vertical
  },

  // Contenido scrolleable del modal
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },

  // Sección dentro del modal (grupo de campos relacionados)
  modalSection: {
    marginTop: 22,
  },

  // Primera sección del modal (sin margen superior extra)
  modalSectionFirst: {
    marginTop: 10,
  },

  // Título de cada sección del modal (estilo etiqueta en mayúsculas)
  modalSectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.65)',
  },

  // Etiqueta encima de cada campo del formulario
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
    letterSpacing: 0.2,
  },

  // Primera etiqueta de una sección (sin margen superior)
  labelFirstInSection: {
    marginTop: 0,
  },

  // Texto de ayuda debajo de una etiqueta
  labelHint: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 17,
    marginTop: -4,
    marginBottom: 10,
    fontWeight: '500',
  },

  // Campo de texto del formulario del modal
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(71, 85, 105, 0.65)',
    borderRadius: 14,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  // Fila del switch de cuenta activa (etiqueta + switch)
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(71, 85, 105, 0.65)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 6,
  },

  // Etiqueta del switch "Cuenta activa"
  switchLabel: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    paddingRight: 12,
  },

  // Botón selector (dropdown) cerrado
  dropdown: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(71, 85, 105, 0.65)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Dropdown abierto — borde más visible
  dropdownOpen: {
    borderColor: 'rgba(100, 116, 139, 0.85)',
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
  },

  // Texto del dropdown cuando hay selección
  dropdownText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },

  // Contenedor de la flecha del dropdown con fondo redondeado
  dropdownChevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Flecha ▲/▼ del dropdown
  dropdownArrow: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },

  // Lista desplegable de opciones del dropdown
  dropdownList: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(51, 65, 85, 0.8)',
    backgroundColor: '#111c2e',
    maxHeight: 200,              // Altura máxima antes de hacer scroll
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  // Cada opción de la lista del dropdown
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.9)',
  },

  // Última opción sin borde inferior
  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  // Opción seleccionada resaltada con fondo más claro
  dropdownItemActive: {
    backgroundColor: 'rgba(51, 65, 85, 0.75)',
  },

  // Texto de cada opción del dropdown
  dropdownItemText: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },

  // Botón guardar del modal — blanco en reposo
  saveBtn: {
    marginTop: 28,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  // Estado presionado del botón guardar — azul
  saveBtnPressed: {
    backgroundColor: '#2563EB',
    shadowOpacity: 0.35,
  },

  // Texto del botón guardar — negro en reposo
  saveBtnText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.4,
  },

  // Texto del botón guardar al presionar — blanco
  saveBtnTextPressed: {
    color: '#FFFFFF',
  },

  // Fila del campo de contraseña en el modal: input + botón ojo
  modalPasswordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(71, 85, 105, 0.65)',
    borderRadius: 14,
    paddingRight: 10,
  },

  // Input de contraseña dentro de la fila
  modalPasswordInput: {
    flex: 1,
    color: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  // Botón del ícono ojo en el modal
  eyeBtn: {
    padding: 6,
  },
});
