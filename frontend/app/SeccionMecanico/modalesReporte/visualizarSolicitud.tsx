// visualizarSolicitud.tsx
// Modal para visualizar los detalles completos de una solicitud

import { useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaMecanico/modalesReporte/visualizarSolicitud';

interface VisualizarSolicitudProps {
  visible: boolean;
  solicitud: any | null;
  onClose: () => void;
}

export default function VisualizarSolicitud({
  visible,
  solicitud,
  onClose,
}: VisualizarSolicitudProps) {
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

  if (!solicitud) return null;

  // Obtener el estado formateado
  const getEstadoFormateado = (estado: string) => {
    if (estado === 'En_proceso') return 'En Proceso';
    return estado;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Botón X para cerrar */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={true}
          >
            {/* Ícono de solicitud */}
            <View style={styles.iconContainer}>
              <FontAwesome name="file-text-o" size={50} color="#3B82F6" />
            </View>

            {/* Título */}
            <Text style={styles.title}>Detalles de la Solicitud</Text>

            {/* SECCIÓN: DATOS PERSONALES */}
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{solicitud.nombreCliente}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{solicitud.correoCliente}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{solicitud.telefono || 'No especificado'}</Text>
            </View>

            {/* SECCIÓN: DATOS DEL VEHÍCULO */}
            <Text style={styles.sectionTitle}>Datos del Vehículo</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Marca:</Text>
              <Text style={styles.value}>{solicitud.marca}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Modelo:</Text>
              <Text style={styles.value}>{solicitud.modelo}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Año:</Text>
              <Text style={styles.value}>{solicitud.anio}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{solicitud.placa}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje:</Text>
              <Text style={styles.value}>{solicitud.kilometraje} km</Text>
            </View>

            {/* SECCIÓN: DATOS DE LA SOLICITUD */}
            <Text style={styles.sectionTitle}>Datos de la Solicitud</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Estado:</Text>
              <Text
                style={[
                  styles.value,
                  solicitud.estado === 'Pendiente' && styles.valueEstadoPendiente,
                  solicitud.estado === 'En_proceso' && styles.valueEstadoProceso,
                  solicitud.estado === 'Completado' && styles.valueEstadoCompletado,
                ]}
              >
                {getEstadoFormateado(solicitud.estado)}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descripción del Problema:</Text>
              <Text style={styles.value}>{solicitud.descripcionProblema || 'No especificado'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Cita:</Text>
              <Text style={styles.value}>{solicitud.fechaCita || 'No especificada'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Hora de Cita:</Text>
              <Text style={styles.value}>{solicitud.horaCita || 'No especificada'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Provincia de la Visita:</Text>
              <Text style={styles.value}>{solicitud.provincia || 'No especificada'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Ubicación de la Mecánica:</Text>
              <Text style={styles.value}>
                {solicitud.ubicacionMecanicaNombre || 'No especificada'}
              </Text>
            </View>

            {solicitud.ubicacionMecanicaDireccion && (
              <View style={styles.field}>
                <Text style={styles.label}>Dirección de la Mecánica:</Text>
                <Text style={styles.value}>{solicitud.ubicacionMecanicaDireccion}</Text>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Registro:</Text>
              <Text style={styles.value}>
                {solicitud.createdAt
                  ? new Date(solicitud.createdAt).toLocaleDateString('es-ES')
                  : 'No disponible'}
              </Text>
            </View>

            {/* Botón CERRAR */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.closeBtnText, pressed && styles.closeBtnTextPressed]}>
                  CERRAR
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
