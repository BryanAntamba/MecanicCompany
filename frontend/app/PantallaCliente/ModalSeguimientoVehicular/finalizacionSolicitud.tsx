// finalizacionSolicitud.tsx
// Modal que confirma que el mantenimiento del vehículo fue completado

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalSeguimientoVehicular/finalizacionSolicitud';

interface FinalizacionSolicitudProps {
  visible: boolean;
  onCerrar: () => void;
}

const FinalizacionSolicitud: React.FC<FinalizacionSolicitudProps> = ({ visible, onCerrar }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Mantenimiento Completado</Text>
          <Text style={styles.message}>
            El mantenimiento de tu vehículo fue completado exitosamente. Por favor, revisa tu
            bandeja de correo para más detalles del servicio realizado.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
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

export default FinalizacionSolicitud;
