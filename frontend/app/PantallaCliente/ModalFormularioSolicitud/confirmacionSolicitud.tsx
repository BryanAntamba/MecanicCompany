// confirmacionSolicitud.tsx
// Modal de confirmación de solicitud enviada exitosamente

import { Modal, Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalFormularioSolicitud/confirmacionSolicitud';

interface ConfirmacionSolicitudProps {
  visible: boolean;
  ubicacion: string;
  fecha: string;
  hora: string;
  onCerrar: () => void;
}

export default function ConfirmacionSolicitud({
  visible,
  ubicacion,
  fecha,
  hora,
  onCerrar,
}: ConfirmacionSolicitudProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Icono de éxito */}
          <View style={styles.iconContainer}>
            <FontAwesome name="check-circle" size={80} color="#10B981" />
          </View>

          {/* Título */}
          <Text style={styles.title}>¡Solicitud Enviada!</Text>

          {/* Mensaje */}
          <Text style={styles.message}>
            Tu solicitud de mantenimiento ha sido registrada exitosamente.
            {'\n\n'}
            Por favor, acércate a la mecánica seleccionada en la fecha y hora programadas:
          </Text>

          {/* Detalles de la cita */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <FontAwesome name="map-marker" size={16} color="#3B82F6" />
              <Text style={styles.detailText}>{ubicacion}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="calendar" size={16} color="#3B82F6" />
              <Text style={styles.detailText}>{fecha}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="clock-o" size={16} color="#3B82F6" />
              <Text style={styles.detailText}>{hora}</Text>
            </View>
          </View>

          {/* Botón cerrar */}
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            onPress={onCerrar}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.closeButtonText,
                  pressed && styles.closeButtonTextPressed,
                ]}
              >
                CERRAR
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
