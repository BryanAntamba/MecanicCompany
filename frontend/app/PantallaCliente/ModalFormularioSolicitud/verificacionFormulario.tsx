// verificacionFormulario.tsx
// Modal para verificar los datos del formulario de solicitud antes de enviar

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '@/Styles/pantallaCliente/modalFormularioSolicitud/verificacionFormulario';

interface VerificacionFormularioProps {
  visible: boolean;
  datos: {
    marca: string;
    modelo: string;
    año: string;
    placa: string;
    kilometraje: string;
    servicio: string;
    otroServicio?: string;
    descripcion: string;
    fecha: string;
    hora: string;
    provincia: string;
    ubicacion: string;
  };
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function VerificacionFormulario({
  visible,
  datos,
  onConfirmar,
  onCancelar,
}: VerificacionFormularioProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Encabezado */}
          <View style={styles.header}>
            <FontAwesome name="file-text-o" size={48} color="#3B82F6" />
            <Text style={styles.title}>Verificar Solicitud</Text>
            <Text style={styles.subtitle}>
              Revisa cuidadosamente los datos de tu solicitud antes de enviarla
            </Text>
          </View>

          {/* Contenido scrolleable */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Vehículo</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Marca del Vehículo:</Text>
                <Text style={styles.fieldValue}>{datos.marca}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Modelo:</Text>
                <Text style={styles.fieldValue}>{datos.modelo}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Año:</Text>
                <Text style={styles.fieldValue}>{datos.año}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Placa:</Text>
                <Text style={styles.fieldValue}>{datos.placa}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Kilometraje:</Text>
                <Text style={styles.fieldValue}>{datos.kilometraje} km</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalles del Servicio</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Tipo de Servicio:</Text>
                <Text style={styles.fieldValue}>
                  {datos.servicio === 'Otro' ? datos.otroServicio : datos.servicio}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Descripción del Problema:</Text>
                <Text style={styles.fieldValue}>{datos.descripcion}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cita Programada</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Fecha:</Text>
                <Text style={styles.fieldValue}>{datos.fecha}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Hora:</Text>
                <Text style={styles.fieldValue}>{datos.hora}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Provincia de la Cita:</Text>
                <Text style={styles.fieldValue}>{datos.provincia}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Ubicación:</Text>
                <Text style={styles.fieldValue}>{datos.ubicacion}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
              onPress={onConfirmar}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.confirmButtonText,
                    pressed && styles.confirmButtonTextPressed,
                  ]}
                >
                  CONFIRMAR SOLICITUD
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={onCancelar}
            >
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
