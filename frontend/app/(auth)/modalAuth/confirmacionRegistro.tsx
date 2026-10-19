// ConfirmacionRegistro.tsx
// Modal de confirmación que se muestra después de un registro exitoso
// Muestra un ícono de check verde y mensaje de éxito
// Se cierra automáticamente después de 5 segundos

import React from 'react';
import { Modal, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import confirmacionStyles from '@/Styles/auth/modalAuth/confirmacionRegistro';

interface ConfirmacionRegistroProps {
  visible: boolean;
}

const ConfirmacionRegistro: React.FC<ConfirmacionRegistroProps> = ({ visible }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={confirmacionStyles.modalOverlay}>
        <View style={confirmacionStyles.modalContent}>
          <View style={confirmacionStyles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={confirmacionStyles.title}>Registro exitoso</Text>
          <Text style={confirmacionStyles.message}>
            Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmacionRegistro;
