// confirmacionPasswordNuevo.tsx
// Modal de confirmación cuando la contraseña ha sido cambiada exitosamente

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/auth/modalAuth/confirmacionPasswordNuevo';

interface ConfirmacionPasswordNuevoProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConfirmacionPasswordNuevo({
  visible,
  onClose,
}: ConfirmacionPasswordNuevoProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Ícono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check-circle" size={80} color="#10B981" />
          </View>

          {/* Título */}
          <Text style={styles.title}>¡Contraseña Cambiada!</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            Tu contraseña ha sido actualizada exitosamente.{'\n'}
            Ahora puedes iniciar sesión con tu nueva contraseña.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
