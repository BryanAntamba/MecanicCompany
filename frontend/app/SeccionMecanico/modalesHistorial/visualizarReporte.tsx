// visualizarReporte.tsx
// Modal para visualizar el reporte completo desde el historial

import { useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalesHistorial/visualizarReporte';

interface RepuestoSeleccionado {
  id: string;
  nombre: string;
  codigoSKU: string;
  marcaComponente: string;
  categoria: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

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
  // Los datos pueden estar en registro.mantenimiento O directamente en registro
  const m = registro?.mantenimiento || registro;

  // Calcular costo total de repuestos si existen
  const costoTotalRepuestos = m?.repuestosSeleccionados 
    ? m.repuestosSeleccionados.reduce((total: number, repuesto: RepuestoSeleccionado) => total + repuesto.subtotal, 0)
    : parseFloat(m?.costoRepuestos || '0');
  
  // Calcular costo total (mano de obra + repuestos)
  const costoManoObra = parseFloat(m?.costoManoObra || '0');
  const costoTotal = m?.costoTotal 
    ? parseFloat(m.costoTotal)
    : costoManoObra + costoTotalRepuestos;

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

  if (!registro) return null;

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
              Reporte completo del servicio realizado
            </Text>

            {/* Información resumida del cliente */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{registro.clienteNombre || registro.nombreCliente || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{registro.telefono || 'No especificado'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Correo:</Text>
                <Text style={styles.infoValue}>{registro.clienteCorreo || registro.correoCliente || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Marca:</Text>
                <Text style={styles.infoValue}>{m.marca}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo:</Text>
                <Text style={styles.infoValue}>{m.modelo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Placa:</Text>
                <Text style={styles.infoValue}>{m.placa}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Año:</Text>
                <Text style={styles.infoValue}>{m.año || m.anio}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kilometraje:</Text>
                <Text style={styles.infoValue}>{m.kilometraje} km</Text>
              </View>
            </View>

            {/* SECCIÓN: Datos del Mantenimiento */}
            <Text style={styles.sectionTitle}>DATOS DEL MANTENIMIENTO</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha del Servicio:</Text>
              <Text style={styles.value}>{m.fechaServicio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Generación del Reporte:</Text>
              <Text style={styles.value}>{m.fechaGeneracionReporte || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mecánico Asignado:</Text>
              <Text style={styles.value}>{m.mecanicoAsignado || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico:</Text>
              <Text style={styles.value}>{m.diagnostico || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Trabajo Realizado:</Text>
              <Text style={styles.value}>
                {m.trabajoRealizado === 'Otros' 
                  ? m.otroTrabajo || 'N/A' 
                  : m.trabajoRealizado || 'N/A'}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Repuestos Utilizados:</Text>
              {m.repuestosSeleccionados && m.repuestosSeleccionados.length > 0 ? (
                <View style={styles.repuestosTable}>
                  {m.repuestosSeleccionados.map((repuesto: RepuestoSeleccionado) => (
                    <View key={repuesto.id} style={styles.repuestoItem}>
                      {/* Fila 1: Nombre y marca/SKU */}
                      <View style={styles.repuestoHeader}>
                        <View style={styles.repuestoInfo}>
                          <Text style={styles.repuestoNombre} numberOfLines={1}>
                            {repuesto.nombre}
                          </Text>
                          <Text style={styles.repuestoMarca}>
                            {repuesto.marcaComponente} • SKU: {repuesto.codigoSKU}
                          </Text>
                        </View>
                      </View>

                      {/* Fila 2: Precio y Subtotal */}
                      <View style={styles.repuestoPriceRow}>
                        <View style={styles.precioContainer}>
                          <Text style={styles.repuestoLabel}>Precio Unit.</Text>
                          <Text style={styles.repuestoPrecio}>${repuesto.precio.toFixed(2)}</Text>
                        </View>

                        <View style={styles.subtotalContainer}>
                          <Text style={styles.repuestoLabel}>Subtotal</Text>
                          <Text style={styles.repuestoSubtotal}>${repuesto.subtotal.toFixed(2)}</Text>
                        </View>
                      </View>

                      {/* Fila 3: Cantidad */}
                      <View style={styles.cantidadRow}>
                        <Text style={styles.cantidadLabel}>Cantidad:</Text>
                        <Text style={styles.cantidadValue}>{repuesto.cantidad}</Text>
                      </View>
                    </View>
                  ))}
                  
                  {/* Footer con total de repuestos */}
                  <View style={styles.repuestosTableFooter}>
                    <Text style={styles.repuestosTableFooterLabel}>Total Repuestos:</Text>
                    <Text style={styles.repuestosTableFooterValue}>
                      ${costoTotalRepuestos.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.value}>{m.repuestosUtilizados || 'Ninguno'}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico Realizado:</Text>
              <Text style={styles.value}>{m.diagnosticoRealizado || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Mano de Obra:</Text>
              <Text style={styles.value}>${costoManoObra.toFixed(2)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Total de Repuestos:</Text>
              <Text style={styles.value}>${costoTotalRepuestos.toFixed(2)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Costo Total:</Text>
              <Text style={styles.costoTotal}>${costoTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Observaciones:</Text>
              <Text style={styles.value}>{m.observaciones || 'Ninguna'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Inicio de Mantenimiento:</Text>
              <Text style={styles.value}>{m.fechaInicio || 'N/A'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Finalización de Mantenimiento:</Text>
              <Text style={styles.value}>{m.fechaFinalizacion || 'N/A'}</Text>
            </View>

            {/* Botón CERRAR */}
            <Pressable
              onPress={onCerrar}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FontAwesome name="times-circle" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.closeBtnText, pressed && styles.closeBtnTextPressed]}>
                    CERRAR
                  </Text>
                </View>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
