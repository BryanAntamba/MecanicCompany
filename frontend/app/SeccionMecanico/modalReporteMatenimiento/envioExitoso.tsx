// envioExitoso.tsx
// Modal de éxito tras enviar el reporte y factura al cliente

import { useEffect } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalReporteMantenimiento/envioExitoso';

interface EnvioExitosoProps {
  visible: boolean;
  nombreCliente: string;
  correoCliente: string;
  onCerrar: () => void;
}

export default function EnvioExitoso({
  visible,
  nombreCliente,
  correoCliente,
  onCerrar,
}: EnvioExitosoProps) {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Factura Enviada</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            La factura y reporte de mantenimiento{'\n'}
            fueron enviados exitosamente a:
          </Text>

          <Text style={styles.nombreDestacado}>{nombreCliente}</Text>
          <Text style={styles.correoDestacado}>{correoCliente}</Text>

          {/* Botón Cerrar */}
          <Pressable
            onPress={onCerrar}
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
