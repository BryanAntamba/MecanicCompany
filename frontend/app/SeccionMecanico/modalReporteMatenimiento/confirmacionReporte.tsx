// confirmacionReporte.tsx
// Modal de confirmación para enviar reporte de mantenimiento al cliente

import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalReporteMantenimiento/confirmacionReporte';
import { descontarRepuestos, agregarPago } from '@/utils/datosSimulados';

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

interface ConfirmacionReporteProps {
  visible: boolean;
  solicitud: any | null;
  repuestosSeleccionados?: RepuestoSeleccionado[];
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ConfirmacionReporte({
  visible,
  solicitud,
  repuestosSeleccionados = [],
  onCancelar,
  onConfirmar,
}: ConfirmacionReporteProps) {
  // Calcular costo total de repuestos
  const costoTotalRepuestos = repuestosSeleccionados.reduce((total, repuesto) => total + repuesto.subtotal, 0);
  
  // Calcular costo total (mano de obra + repuestos)
  const costoManoObra = parseFloat(solicitud?.costoManoObra || '0');
  const costoTotal = costoManoObra + costoTotalRepuestos;

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

  // Función para confirmar y descontar inventario
  const confirmarYDescontar = () => {
    // Si hay repuestos seleccionados, descontarlos del inventario
    if (repuestosSeleccionados.length > 0) {
      const repuestosParaDescontar = repuestosSeleccionados.map(r => ({
        id: r.id,
        cantidad: r.cantidad
      }));
      
      const exito = descontarRepuestos(repuestosParaDescontar);
      
      if (!exito) {
        console.error('Error al descontar repuestos del inventario');
        // Aún así continuar con el envío
      }
    }
    
    // Generar automáticamente el registro de pago para el sistema financiero
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;
    
    // Generar ID único para el pago
    const nuevoPagoId = `#${String(Date.now()).slice(-6)}`;
    
    // Obtener el servicio (trabajo realizado)
    const servicio = solicitud.trabajoRealizado === 'Otros' 
      ? solicitud.otroTrabajo || 'Mantenimiento' 
      : solicitud.trabajoRealizado || 'Mantenimiento';
    
    // Crear el registro de pago
    const nuevoPago = {
      id: nuevoPagoId,
      fecha: fechaFormateada,
      clienteNombre: solicitud.nombreCliente,
      clienteTelefono: solicitud.telefono,
      clienteCorreo: solicitud.correoCliente,
      vehiculo: `${solicitud.marca} ${solicitud.modelo} ${solicitud.anio}`,
      marca: solicitud.marca,
      modelo: solicitud.modelo,
      placa: solicitud.placa,
      anio: solicitud.anio,
      kilometraje: solicitud.kilometraje,
      servicio: servicio,
      mecanico: solicitud.mecanicoAsignado || 'No asignado',
      costoManoObra: costoManoObra,
      costoRepuestos: costoTotalRepuestos,
      total: costoTotal,
      estado: 'PENDIENTE' as const,
      solicitudId: solicitud.id || String(Date.now()),
    };
    
    // Agregar el pago al sistema financiero
    agregarPago(nuevoPago);
    console.log('Pago generado automáticamente:', nuevoPago);
    
    // Llamar a la función de confirmación original
    onConfirmar();
  };

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
            <Text style={styles.title}>Verificar Reporte</Text>
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

            {/* SECCIÓN: Datos del Mantenimiento */}
            <Text style={styles.sectionTitle}>DATOS DEL MANTENIMIENTO</Text>

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
              {repuestosSeleccionados.length > 0 ? (
                <View style={styles.repuestosTable}>
                  {repuestosSeleccionados.map((repuesto) => (
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
                <Text style={styles.value}>{solicitud.repuestosUtilizados || 'Ninguno'}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Diagnóstico Realizado:</Text>
              <Text style={styles.value}>{solicitud.diagnosticoRealizado || 'N/A'}</Text>
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
                onPress={confirmarYDescontar}
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
