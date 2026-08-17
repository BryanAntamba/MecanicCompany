// soporte.ts
// Estilos para la pantalla de soporte

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  scrollContent: {
    flexGrow: 1, // Permite que el contenido crezca y el footer se quede abajo
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#0b1120',
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0b1120',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
    marginTop: 12,
  },
  fieldLabel: {
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
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  fieldError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#94A3B8',
  },
  dropdownSelected: {
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
    marginTop: 8,
    marginBottom: 8,
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
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonPressed: {
    backgroundColor: '#2563EB',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  submitButtonTextPressed: {
    color: '#FFFFFF',
  },

  // --- PIE DE PÁGINA (FOOTER) ---
  footer: {
    paddingHorizontal: 20,      // Relleno horizontal
    paddingVertical: 30,        // Relleno vertical
    paddingBottom: 40,          // Espacio adicional para no quedar pegado al menú del teléfono
    backgroundColor: '#000000', // Fondo negro puro igual que el page
  },

  // Texto de derechos de autor
  copyrightText: {
    color: '#CBD5E1',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },

  // Botón "Regresar Arriba" — blanco en reposo
  scrollTopButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // Estado presionado del botón — azul
  scrollTopButtonPressed: {
    backgroundColor: '#2563EB',
  },

  // Texto del botón — negro en reposo
  scrollTopText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 8,
  },

  // Texto del botón al presionar — blanco
  scrollTopTextPressed: {
    color: '#FFFFFF',
  },

  // Ícono del botón
  scrollTopIcon: {
    marginLeft: 4,
  },
});
