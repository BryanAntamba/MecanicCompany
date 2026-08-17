// verificacionFormulario.ts
// Estilos para el modal de verificación de formulario

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollContent: {
    maxHeight: 400,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: '#F1F5F9',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonPressed: {
    backgroundColor: '#2563EB',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  confirmButtonTextPressed: {
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#334155',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
});
