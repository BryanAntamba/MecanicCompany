
// historial.ts
// Estilos exclusivos de la pantalla historial.tsx.
// Los estilos compartidos con ReportesClientes (tarjetas, modales, botones)
// se importan desde ReportesClientes.ts para evitar duplicación.


import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  // Fila del buscador de placa: ícono lupa + input de texto + botón limpiar (X)
  searchRow: {
    flexDirection: 'row',        // Elementos en fila horizontal
    alignItems: 'center',        // Centra verticalmente el ícono, input y botón X
    backgroundColor: '#060D1A',  // Mismo color que las tarjetas de registros
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,            // Separación respecto a la lista de registros
  },

  // Ícono de lupa a la izquierda del campo de búsqueda
  searchIcon: {
    marginRight: 10,             // Separación entre el ícono y el input
  },

  // Campo de texto para ingresar la placa a buscar
  searchInput: {
    flex: 1,                     // Ocupa todo el espacio entre el ícono y el botón X
    color: '#F8FAFC',            // Texto blanco
    fontSize: 15,
  },

  // Texto que aparece cuando la búsqueda no encuentra resultados
  emptyText: {
    color: '#64748B',            // Gris para indicar estado vacío
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,               // Separación superior para centrarlo visualmente
  },

  // Campo de solo lectura en el modal de detalles del mantenimiento.
  // Usado por la función auxiliar campo() en historial.tsx para mostrar
  // los datos del reporte sin permitir edición.
  detalleValor: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'rgba(15,23,42,0.6)', // Fondo oscuro semitransparente
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
});
