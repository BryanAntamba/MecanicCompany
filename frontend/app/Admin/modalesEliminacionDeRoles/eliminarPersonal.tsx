// EliminarPersonal.tsx
// Modal de confirmación para eliminar personal (Mecánico, Inventario, Financiero o Administrador)

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaAdmin/ModalesDeEliminacionDeRoles/eliminacionMecanico';

interface EliminarPersonalProps {
  visible: boolean;
  personal: any | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function EliminarPersonal({
  visible,
  personal,
  onCancelar,
  onConfirmar,
}: EliminarPersonalProps) {
  if (!personal) return null;

  const nombreCompleto = [
    personal.nombres,
    personal.segundoNombre,
    personal.apellidos,
    personal.segundoApellido,
  ]
    .filter(Boolean)
    .join(' ');

  // Determinar el tipo de personal a mostrar
  const tipoPersonal = personal.tipoPersonal || personal.rol || 'Personal';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de advertencia */}
          <View style={styles.iconContainer}>
            <FontAwesome name="exclamation-triangle" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Confirmar Eliminación</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            ¿Estás seguro de eliminar al{' '}
            {tipoPersonal === 'Administrador' ? 'administrador' : 'personal'}{'\n'}
            <Text style={styles.nombreDestacado}>{nombreCompleto}</Text>
            {` (${tipoPersonal})`}?
          </Text>

          <Text style={styles.advertencia}>
            Esta acción no se puede deshacer.
          </Text>

          {/* Botones */}
          <View style={styles.botonesContainer}>
            {/* Botón Cancelar */}
            <Pressable
              onPress={onCancelar}
              style={({ pressed }) => [
                styles.btnCancelar,
                pressed && styles.btnCancelarPressed,
              ]}
            >
              {({ pressed }) => (
                <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                  <FontAwesome 
                    name="times-circle" 
                    size={16} 
                    color={pressed ? '#1E293B' : '#000000'}
                  />
                  <View style={{ width: 8 }} />
                  <Text style={[styles.btnCancelarText, pressed && styles.btnCancelarTextPressed]}>
                    CANCELAR
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Botón Eliminar */}
            <Pressable
              onPress={onConfirmar}
              style={({ pressed }) => [
                styles.btnEliminar,
                pressed && styles.btnEliminarPressed,
              ]}
            >
              {({ pressed }) => (
                <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                  <FontAwesome 
                    name="trash" 
                    size={16} 
                    color={pressed ? '#FCA5A5' : '#FFFFFF'}
                  />
                  <View style={{ width: 8 }} />
                  <Text style={[styles.btnEliminarText, pressed && styles.btnEliminarTextPressed]}>
                    ELIMINAR
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
