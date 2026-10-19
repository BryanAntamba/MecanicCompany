// confirmacionReenvio.tsx
// Modal de confirmación para reenviar comprobante (basado en confirmarReenvioReporte.tsx)

import { useEffect } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaFinanciero/modalesHistorial/confirmacionReenvio';

interface ConfirmacionReenvioProps {
  visible: boolean;
  clienteNombre: string;
  onClose: () => void;
  onConfirmar: () => void;
}

export default function ConfirmacionReenvio({
  visible,
  clienteNombre,
  onClose,
  onConfirmar,
}: ConfirmacionReenvioProps) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalOverlayPress} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={(event) => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.title}>¿Reenviar comprobante?</Text>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <FontAwesome name="times" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesome name="send" size={40} color="#FFFFFF" />
            </View>

            <Text style={styles.message}>
              ¿Está seguro de reenviar el comprobante de pago a
            </Text>
            <Text style={styles.nombreDestacado}>{clienteNombre}</Text>
            <Text style={styles.correoDestacado}>
              al correo personal del cliente?
            </Text>

            <View style={styles.botonesContainer}>
              <Pressable
                onPress={onConfirmar}
                style={({ pressed }) => [styles.btnConfirmar, pressed && styles.btnConfirmarPressed]}
              >
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FontAwesome name="check" size={16} color={pressed ? '#F1F5F9' : '#FFFFFF'} />
                    <Text style={[styles.btnConfirmarText, pressed && styles.btnConfirmarTextPressed]}>
                      CONFIRMAR REENVÍO
                    </Text>
                  </View>
                )}
              </Pressable>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.btnCancelar, pressed && styles.btnCancelarPressed]}
              >
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FontAwesome name="times" size={16} color={pressed ? '#1E293B' : '#000000'} />
                    <Text style={[styles.btnCancelarText, pressed && styles.btnCancelarTextPressed]}>
                      CANCELAR
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}
