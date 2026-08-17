// EliminarAdministrador.tsx
// Modal de confirmación para eliminar un administrador

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaAdmin/ModalesDeEliminacionDeRoles/eliminacionAdministrador';

interface EliminarAdministradorProps {
  visible: boolean;
  administrador: any | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function EliminarAdministrador({
  visible,
  administrador,
  onCancelar,
  onConfirmar,
}: EliminarAdministradorProps) {
  if (!administrador) return null;

  const nombreCompleto = [
    administrador.nombres,
    administrador.segundoNombre,
    administrador.apellidos,
    administrador.segundoApellido,
  ]
    .filter(Boolean)
    .join(' ');

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
            ¿Estás seguro de eliminar al Administrador{'\n'}
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
