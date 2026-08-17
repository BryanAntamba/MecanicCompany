// registroMecanico.ts
// Estilos para el modal de registro de mecánico

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
    height: '85%',  // Cambiar de maxHeight a height fijo
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTextBlock: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  modalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
  fotoContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F172A',
  },
  fotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoPlaceholderText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F1F5F9',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
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
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    overflow: 'hidden',
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
    flex: 1,
    fontSize: 16,
    color: '#F1F5F9',
    flexWrap: 'wrap',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#F1F5F9',
  },
  eyeBtn: {
    paddingHorizontal: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchOn: {
    backgroundColor: '#3B82F6',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  saveBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnPressed: {
    backgroundColor: '#2563EB',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  saveBtnTextPressed: {
    color: '#FFFFFF',
  },
});
