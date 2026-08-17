// confirmarReenvioReporte.tsx
// Modal de confirmación para reenviar reporte desde el historial

import { useEffect } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalesHistorial/confirmarReenvioReporte';

interface ConfirmarReenvioReporteProps {
  visible: boolean;
  nombreCliente: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmarReenvioReporte({
  visible,
  nombreCliente,
  onCancelar,
  onConfirmar,
}: ConfirmarReenvioReporteProps) {
  // Bloquear capturas de pantalla cuando el modal está visible
  useEffect(() => {
    if (visible) {
      const preventCapture = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventCapture();
    }
    // No llamamos allowScreenCaptureAsync() porque la pantalla principal debe mantener el bloqueo
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalOverlayPress} onPress={onCancelar}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Cabecera con botón X */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.title}>¿Reenviar Factura?</Text>
              </View>
              <Pressable
                onPress={onCancelar}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <FontAwesome name="times" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Ícono de reenvío amarillo */}
            <View style={styles.iconContainer}>
              <FontAwesome name="send" size={40} color="#FFFFFF" />
            </View>

            {/* Mensaje */}
            <Text style={styles.message}>
              ¿Está seguro de reenviar la factura al usuario?
            </Text>

            <Text style={styles.nombreDestacado}>{nombreCliente}</Text>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <Pressable
                onPress={onConfirmar}
                style={({ pressed }) => [
                  styles.btnConfirmar,
                  pressed && styles.btnConfirmarPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnConfirmarText, pressed && styles.btnConfirmarTextPressed]}>
                    CONFIRMAR REENVÍO
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={onCancelar}
                style={({ pressed }) => [
                  styles.btnCancelar,
                  pressed && styles.btnCancelarPressed,
                ]}
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
