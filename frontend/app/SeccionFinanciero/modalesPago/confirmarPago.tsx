// confirmarPago.tsx
// Modal de confirmación de pago (basado en confirmarReenvioReporte.tsx)

import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaFinanciero/modalesPago/confirmarPago';

interface ConfirmarPagoProps {
  visible: boolean;
  clienteNombre: string;
  metodoPago: string;
  total: number;
  onClose: () => void;
  onConfirmar: () => void;
}

export default function ConfirmarPago({
  visible,
  clienteNombre,
  metodoPago,
  total,
  onClose,
  onConfirmar,
}: ConfirmarPagoProps) {
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
                <Text style={styles.title}>¿Confirmar pago?</Text>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <FontAwesome name="times" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

          <View style={styles.iconContainer}>
              <FontAwesome name="question" size={40} color="#FFFFFF" />
            </View>

            <Text style={styles.message}>
              ¿Está seguro de confirmar el pago realizado por
            </Text>
            <Text style={styles.nombreDestacado}>{clienteNombre}</Text>
            <Text style={styles.correoDestacado}>
              por ${total.toFixed(2)} mediante {metodoPago}?
            </Text>

            <Text style={styles.modalSubMessage}>
              El servicio se marcará como pagado y se enviará el comprobante al correo personal del cliente.
            </Text>

            <View style={styles.botonesContainer}>
              <Pressable
                onPress={onConfirmar}
                style={({ pressed }) => [styles.btnConfirmar, pressed && styles.btnConfirmarPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnConfirmarText, pressed && styles.btnConfirmarTextPressed]}>
                    CONFIRMAR PAGO
                  </Text>
                )}
              </Pressable>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.btnCancelar, pressed && styles.btnCancelarPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnCancelarText, pressed && styles.btnCancelarTextPressed]}>
                    CANCELAR
                  </Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}
