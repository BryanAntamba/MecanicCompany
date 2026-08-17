// visualizarReporte.tsx
// Modal para visualizar el reporte completo desde el historial

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
import styles from '../../../Styles/pantallaMecanico/modalesHistorial/visualizarReporte';

interface VisualizarReporteProps {
  visible: boolean;
  registro: any | null;
  onCerrar: () => void;
}

export default function VisualizarReporte({
  visible,
  registro,
  onCerrar,
}: VisualizarReporteProps) {
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

  if (!registro) return null;

  // Los datos pueden estar en registro.mantenimiento O directamente en registro
  const m = registro.mantenimiento || registro;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCerrar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Botón X para cerrar */}
          <Pressable onPress={onCerrar} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </Pressable>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Título */}
            <Text style={styles.title}>Registro de Mantenimiento</Text>
            <Text style={styles.subtitle}>
              {registro.marca || m.marca} {registro.modelo || m.modelo} · {registro.placa || m.placa}
            </Text>

            {/* SECCIÓN: Información del Cliente */}
            <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Nombre Completo:</Text>
              <Text style={styles.value}>{registro.clienteNombre || registro.nombreCliente || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{registro.telefono || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico:</Text>
              <Text style={styles.value}>{registro.clienteCorreo || registro.correoCliente || 'N/A'}</Text>
            </View>

            {/* SECCIÓN: Datos del Vehículo */}
            <Text style={styles.sectionTitle}>DATOS DEL VEHÍCULO</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Marca:</Text>
              <Text style={styles.value}>{m.marca || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Modelo:</Text>
              <Text style={styles.value}>{m.modelo || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{m.placa || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Año:</Text>
              <Text style={styles.value}>{m.año || m.anio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje:</Text>
              <Text style={styles.value}>{m.kilometraje ? `${m.kilometraje} km` : 'N/A'}</Text>
            </View>

            {/* SECCIÓN: Diagnóstico y Trabajo */}
            <Text style={styles.sectionTitle}>DIAGNÓSTICO Y TRABAJO</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico:</Text>
              <Text style={styles.value}>{m.diagnostico || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Trabajo Realizado:</Text>
              <Text style={styles.value}>
                {m.trabajoRealizado === 'Otros' ? (m.otroTrabajo || 'N/A') : (m.trabajoRealizado || 'N/A')}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Repuestos Utilizados:</Text>
              <Text style={styles.value}>{m.repuestosUtilizados || 'Ninguno'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico Realizado:</Text>
              <Text style={styles.value}>{m.diagnosticoRealizado || 'N/A'}</Text>
            </View>

            {/* SECCIÓN: Costos */}
            <Text style={styles.sectionTitle}>COSTOS DEL SERVICIO</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Mano de Obra:</Text>
              <Text style={styles.value}>${m.costoManoObra || '0.00'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Repuestos:</Text>
              <Text style={styles.value}>${m.costoRepuestos || '0.00'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Total:</Text>
              <Text style={styles.costoTotal}>${m.costoTotal || (m.costoManoObra && m.costoRepuestos ? (parseFloat(m.costoManoObra) + parseFloat(m.costoRepuestos)).toFixed(2) : '0.00')}</Text>
            </View>

            {/* SECCIÓN: Observaciones y Fechas */}
            <Text style={styles.sectionTitle}>OBSERVACIONES Y FECHAS</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Observaciones:</Text>
              <Text style={styles.value}>{m.observaciones || 'Ninguna'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Inicio:</Text>
              <Text style={styles.value}>{m.fechaInicio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Finalización:</Text>
              <Text style={styles.value}>{m.fechaFinalizacion || 'N/A'}</Text>
            </View>

            {/* Botón CERRAR */}
            <Pressable
              onPress={onCerrar}
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
