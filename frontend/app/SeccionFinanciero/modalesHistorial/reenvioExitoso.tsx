// reenvioExitoso.tsx
// Modal de confirmación exitosa de reenvío (basado en envioExitoso.tsx)

import { useEffect } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaFinanciero/modalesHistorial/reenvioExitoso';

interface ReenvioExitosoProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReenvioExitoso({ visible, onClose }: ReenvioExitosoProps) {
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

          <Text style={styles.title}>Comprobante Reenviado</Text>

          <Text style={styles.message}>
            El comprobante fue reenviado exitosamente al correo personal del cliente.
          </Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FontAwesome name="times-circle" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.closeButtonText, pressed && styles.closeButtonTextPressed]}>
                  CERRAR
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
