// reporteExistoso.tsx
// Modal que confirma el envío exitoso del reporte de soporte

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalConfirmacionSoporte/reporteExitoso';

interface ReporteExitosoProps {
  visible: boolean;
  onCerrar: () => void;
}

const ReporteExitoso: React.FC<ReporteExitosoProps> = ({ visible, onCerrar }) => {
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
          <Text style={styles.title}>Reporte Enviado</Text>
          <Text style={styles.message}>
            Tu reporte fue enviado exitosamente. Nos pondremos en contacto contigo lo antes posible.
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

export default ReporteExitoso;
