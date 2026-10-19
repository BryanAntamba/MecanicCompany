// eliminacionSolicitud.tsx
// Modal de éxito tras eliminar una solicitud

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../../Styles/pantallaMecanico/modalesConfirmacion/eliminacionSolicitud';

interface EliminacionSolicitudProps {
  visible: boolean;
  nombreCliente: string;
  onCerrar: () => void;
}

export default function EliminacionSolicitud({
  visible,
  nombreCliente,
  onCerrar,
}: EliminacionSolicitudProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Icono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>

          {/* Título */}
          <Text style={styles.title}>Solicitud Eliminada</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            La solicitud de{'\n'}
            <Text style={styles.nombreDestacado}>{nombreCliente}</Text>
            {'\n'}ha sido eliminada correctamente.
          </Text>

          {/* Botón Cerrar */}
          <Pressable
            onPress={onCerrar}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
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
