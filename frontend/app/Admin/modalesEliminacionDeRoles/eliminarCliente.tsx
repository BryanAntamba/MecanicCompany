// EliminarCliente.tsx
// Modal de confirmación para eliminar un cliente

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaAdmin/ModalesDeEliminacionDeRoles/eliminacionCliente';

interface EliminarClienteProps {
  visible: boolean;
  cliente: any | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function EliminarCliente({
  visible,
  cliente,
  onCancelar,
  onConfirmar,
}: EliminarClienteProps) {
  if (!cliente) return null;

  const nombreCompleto = cliente.nombreCompleto || 'Cliente';

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
            ¿Estás seguro de eliminar al Usuario{'\n'}
            <Text style={styles.nombreDestacado}>{nombreCompleto}</Text>?
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
                <Text style={[styles.btnCancelarText, pressed && styles.btnCancelarTextPressed]}>
                  CANCELAR
                </Text>
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
                <Text style={[styles.btnEliminarText, pressed && styles.btnEliminarTextPressed]}>
                  ELIMINAR
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
