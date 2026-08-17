// eliminacionExitosa.tsx
// Modal que confirma la eliminación exitosa de un usuario

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaAdmin/ModalesDeEliminacionDeRoles/modalElimiancionConfirmada/eliminacionExitosa';

interface EliminacionExitosaProps {
  visible: boolean;
  nombreUsuario: string;
  rolUsuario: 'Mecánico' | 'Administrador' | 'Usuario';
  onCerrar: () => void;
}

export default function EliminacionExitosa({
  visible,
  nombreUsuario,
  rolUsuario,
  onCerrar,
}: EliminacionExitosaProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Usuario Eliminado</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            El {rolUsuario}{'\n'}
            <Text style={styles.nombreDestacado}>{nombreUsuario}</Text>{'\n'}
            fue eliminado exitosamente del sistema.
          </Text>

          {/* Botón Cerrar */}
          <Pressable
            onPress={onCerrar}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <Text style={[styles.closeButtonText, pressed && styles.closeButtonTextPressed]}>
                CERRAR
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
