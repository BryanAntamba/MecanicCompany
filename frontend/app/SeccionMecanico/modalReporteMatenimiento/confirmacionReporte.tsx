// confirmacionReporte.tsx
// Modal de confirmación para enviar reporte de mantenimiento al cliente

import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalReporteMantenimiento/confirmacionReporte';

interface ConfirmacionReporteProps {
  visible: boolean;
  solicitud: any | null;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmacionReporte({
  visible,
  solicitud,
  onCancelar,
  onConfirmar,
}: ConfirmacionReporteProps) {
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Botón X para cerrar */}
          <Pressable onPress={onCancelar} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Título */}
            <Text style={styles.title}>Verificar Factura</Text>
            <Text style={styles.subtitle}>
              Se enviará el siguiente reporte al correo del cliente:
            </Text>

            {/* Información resumida del cliente */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{solicitud.nombreCliente}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{solicitud.telefono || 'No especificado'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Correo:</Text>
                <Text style={styles.infoValue}>{solicitud.correoCliente}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Marca:</Text>
                <Text style={styles.infoValue}>{solicitud.marca}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo:</Text>
                <Text style={styles.infoValue}>{solicitud.modelo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Placa:</Text>
                <Text style={styles.infoValue}>{solicitud.placa}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Año:</Text>
                <Text style={styles.infoValue}>{solicitud.anio}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kilometraje:</Text>
                <Text style={styles.infoValue}>{solicitud.kilometraje} km</Text>
              </View>
            </View>

            {/* TODOS LOS CAMPOS DEL REPORTE */}
            
            {/* SECCIÓN: Información del Cliente y Vehículo */}
            <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE Y VEHÍCULO</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{solicitud.nombreCliente}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{solicitud.telefono || 'No especificado'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{solicitud.correoCliente}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Marca del Vehículo:</Text>
              <Text style={styles.value}>{solicitud.marca}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Modelo:</Text>
              <Text style={styles.value}>{solicitud.modelo}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{solicitud.placa}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Año:</Text>
              <Text style={styles.value}>{solicitud.anio}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje:</Text>
              <Text style={styles.value}>{solicitud.kilometraje} km</Text>
            </View>

            {/* SECCIÓN: Datos del Mantenimiento */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>DATOS DEL MANTENIMIENTO</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha del Servicio:</Text>
              <Text style={styles.value}>{solicitud.fechaServicio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mecánico Asignado:</Text>
              <Text style={styles.value}>{solicitud.mecanicoAsignado || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico:</Text>
              <Text style={styles.value}>{solicitud.diagnostico || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Trabajo Realizado:</Text>
              <Text style={styles.value}>
                {solicitud.trabajoRealizado === 'Otros' 
                  ? solicitud.otroTrabajo || 'N/A' 
                  : solicitud.trabajoRealizado || 'N/A'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Repuestos Utilizados:</Text>
              <Text style={styles.value}>{solicitud.repuestosUtilizados || 'Ninguno'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico Realizado:</Text>
              <Text style={styles.value}>{solicitud.diagnosticoRealizado || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Mano de Obra:</Text>
              <Text style={styles.value}>${solicitud.costoManoObra || '0.00'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Total de Repuestos:</Text>
              <Text style={styles.value}>${solicitud.costoRepuestos || '0.00'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Total:</Text>
              <Text style={styles.costoTotal}>${solicitud.costoTotal || '0.00'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Observaciones:</Text>
              <Text style={styles.value}>{solicitud.observaciones || 'Ninguna'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Inicio de Mantenimiento:</Text>
              <Text style={styles.value}>{solicitud.fechaInicio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Finalización de Mantenimiento:</Text>
              <Text style={styles.value}>{solicitud.fechaFinalizacion || 'N/A'}</Text>
            </View>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              {/* Botón Cancelar */}
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

              {/* Botón Enviar */}
              <Pressable
                onPress={onConfirmar}
                style={({ pressed }) => [styles.btnEnviar, pressed && styles.btnEnviarPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnEnviarText, pressed && styles.btnEnviarTextPressed]}>
                    ENVIAR AL CORREO
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
