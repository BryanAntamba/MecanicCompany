// detallesSolicitud.tsx
// Modal que muestra los detalles completos de una solicitud (PENDIENTE o EN PROCESO)

import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import styles from '@/Styles/pantallaCliente/modalSeguimientoVehicular/detallesSolicitud';

interface Solicitud {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  año: string;
  kilometraje: string;
  servicio: string;
  descripcion: string;
  fechaCita: string;
  horaCita: string;
  ubicacion: string;
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO';
  mecanico?: string;
}

interface DetallesSolicitudProps {
  visible: boolean;
  solicitud: Solicitud;
  onCerrar: () => void;
}

const DetallesSolicitud: React.FC<DetallesSolicitudProps> = ({ visible, solicitud, onCerrar }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Detalles de la Solicitud</Text>
          <Text style={styles.subtitle}>Información completa del mantenimiento vehicular</Text>

          <ScrollView style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Estado:</Text>
              <Text
                style={[
                  styles.dataValue,
                  solicitud.estado === 'PENDIENTE' && styles.estadoPendiente,
                  solicitud.estado === 'EN PROCESO' && styles.estadoEnProceso,
                ]}
              >
                {solicitud.estado}
              </Text>
            </View>

            {solicitud.estado === 'EN PROCESO' && solicitud.mecanico && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Mecánico Asignado:</Text>
                <Text style={styles.dataValue}>{solicitud.mecanico}</Text>
              </View>
            )}

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Marca del Vehículo:</Text>
              <Text style={styles.dataValue}>{solicitud.marca}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Modelo:</Text>
              <Text style={styles.dataValue}>{solicitud.modelo}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Año:</Text>
              <Text style={styles.dataValue}>{solicitud.año}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Placa:</Text>
              <Text style={styles.dataValue}>{solicitud.placa}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Kilometraje:</Text>
              <Text style={styles.dataValue}>{solicitud.kilometraje} km</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tipo de Servicio:</Text>
              <Text style={styles.dataValue}>{solicitud.servicio}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Descripción del Problema:</Text>
              <Text style={styles.dataValue}>{solicitud.descripcion}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Fecha de Cita:</Text>
              <Text style={styles.dataValue}>
                {new Date(solicitud.fechaCita).toLocaleDateString('es-ES')}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Hora de Cita:</Text>
              <Text style={styles.dataValue}>{solicitud.horaCita}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Ubicación:</Text>
              <Text style={styles.dataValue}>{solicitud.ubicacion}</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Fecha de Solicitud:</Text>
              <Text style={styles.dataValue}>
                {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </ScrollView>

          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            onPress={onCerrar}
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
};

export default DetallesSolicitud;
