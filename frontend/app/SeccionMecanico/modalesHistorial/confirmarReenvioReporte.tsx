// confirmarReenvioReporte.tsx
// Modal de confirmación para reenviar reporte desde el historial

import { useEffect } from 'react';
import { Modal, Platform, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalesHistorial/confirmarReenvioReporte';

interface ConfirmarReenvioReporteProps {
  visible: boolean;
  nombreCliente: string;
  isLoading?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmarReenvioReporte({
  visible,
  nombreCliente,
  isLoading = false,
  onCancelar,
  onConfirmar,
}: ConfirmarReenvioReporteProps) {
  // Bloquear capturas de pantalla cuando el modal está visible (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    
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
                <Text style={styles.title}>¿Reenviar Reporte?</Text>
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
              ¿Está seguro de reenviar el reporte al usuario?
            </Text>

            <Text style={styles.nombreDestacado}>{nombreCliente}</Text>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <Pressable
                onPress={onConfirmar}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.btnConfirmar,
                  isLoading && { opacity: 0.6 },
                  pressed && !isLoading && styles.btnConfirmarPressed,
                ]}
              >
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {isLoading ? (
                      <ActivityIndicator size={16} color="#FFFFFF" />
                    ) : (
                      <FontAwesome name="check" size={16} color={pressed ? '#F1F5F9' : '#FFFFFF'} />
                    )}
                    <Text style={[styles.btnConfirmarText, pressed && !isLoading && styles.btnConfirmarTextPressed]}>
                      {isLoading ? 'ENVIANDO...' : 'CONFIRMAR'}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={onCancelar}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.btnCancelar,
                  isLoading && { opacity: 0.6 },
                  pressed && !isLoading && styles.btnCancelarPressed,
                ]}
              >
                {({ pressed }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FontAwesome 
                      name="times" 
                      size={16} 
                      color={isLoading ? '#999999' : (pressed ? '#1E293B' : '#000000')} 
                    />
                    <Text style={[styles.btnCancelarText, pressed && !isLoading && styles.btnCancelarTextPressed, isLoading && { color: '#999999' }]}>
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
