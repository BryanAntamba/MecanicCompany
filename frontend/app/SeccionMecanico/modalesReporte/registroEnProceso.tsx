// registroEnProceso.tsx
// Modal que confirma el guardado exitoso del registro de mantenimiento

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaMecanico/modalesReporte/registroEnProceso';

interface RegistroEnProcesoProps {
  visible: boolean;
  onCerrar: () => void;
}

const RegistroEnProceso: React.FC<RegistroEnProcesoProps> = ({ visible, onCerrar }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Registro Guardado</Text>
          <Text style={styles.message}>
            Se guardaron los cambios del registro de mantenimiento exitosamente.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onCerrar}
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
};

export default RegistroEnProceso;
