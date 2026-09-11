// pagoAprobado.tsx
// Modal de confirmación exitosa de pago (basado en envioExitoso.tsx)

import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaFinanciero/modalesPago/pagoAprobado';

interface PagoAprobadoProps {
  visible: boolean;
  onClose: () => void;
}

export default function PagoAprobado({ visible, onClose }: PagoAprobadoProps) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>Pago Registrado</Text>

          <Text style={styles.message}>
            El pago ha sido registrado exitosamente en el sistema.
          </Text>

          <Text style={styles.message}>
            El estado del servicio se ha actualizado a "PAGADO".
          </Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
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
