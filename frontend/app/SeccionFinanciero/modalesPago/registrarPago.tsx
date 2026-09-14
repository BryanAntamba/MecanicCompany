// registrarPago.tsx
// Modal para registrar el pago de un servicio completado (estilo registroPersonal)

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import * as ImagePicker from '@/utils/imagePicker';
import styles from '../../../Styles/pantallaFinanciero/modalesPago/registrarPago';

interface RegistrarPagoProps {
  visible: boolean;
  pago: any | null;
  onClose: () => void;
  onConfirmar: (metodoPago: string, fechaPago: string, observacion: string, comprobanteUri?: string) => void;
}

export default function RegistrarPago({
  visible,
  pago,
  onClose,
  onConfirmar,
}: RegistrarPagoProps) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  const [metodoPago, setMetodoPago] = useState<'EFECTIVO' | 'TRANSFERENCIA'>('EFECTIVO');
  const [fechaPago, setFechaPago] = useState<Date | null>(null);
  const [observacion, setObservacion] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [comprobanteUri, setComprobanteUri] = useState<string | null>(null);
  const [comprobanteNombre, setComprobanteNombre] = useState<string | null>(null);

  // Errores
  const [errMetodoPago, setErrMetodoPago] = useState('');
  const [errFechaPago, setErrFechaPago] = useState('');
  const [errComprobante, setErrComprobante] = useState('');

  // Limpiar formulario cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setMetodoPago('EFECTIVO');
      setFechaPago(null);
      setObservacion('');
      setComprobanteUri(null);
      setComprobanteNombre(null);
      setErrMetodoPago('');
      setErrFechaPago('');
      setErrComprobante('');
    }
  }, [visible]);

  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    const dateYear = date.getFullYear();
    
    // Bloquear fechas anteriores a hoy
    if (date < today) return true;
    
    // Bloquear fechas de años futuros (solo permitir año actual)
    if (dateYear > currentYear) return true;
    
    return false;
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSeleccionarComprobante = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setComprobanteUri(asset.uri);
        // Extraer nombre del archivo de la URI
        const fileName = asset.uri.split('/').pop() || 'comprobante.jpg';
        setComprobanteNombre(fileName);
        setErrComprobante('');
      }
    } catch (error) {
      console.error('Error al seleccionar comprobante:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleConfirmar = () => {
    // Validar campos obligatorios
    let valid = true;

    if (!metodoPago) {
      setErrMetodoPago('Debe seleccionar un método de pago');
      valid = false;
    } else {
      setErrMetodoPago('');
    }

    if (!fechaPago) {
      setErrFechaPago('Debe seleccionar una fecha de pago');
      valid = false;
    } else {
      setErrFechaPago('');
    }

    // Validar comprobante si es transferencia
    if (metodoPago === 'TRANSFERENCIA' && !comprobanteUri) {
      setErrComprobante('Debe cargar el comprobante de transferencia');
      valid = false;
    } else {
      setErrComprobante('');
    }

    if (!valid) return;

    // Llamar a la función de confirmación
    onConfirmar(metodoPago, formatDate(fechaPago as Date), observacion.trim(), comprobanteUri || undefined);
  };

  if (!pago) return null;

  console.log('=== DEBUG REGISTRAR PAGO ===');
  console.log('pago:', pago);
  console.log('clienteNombre:', pago.clienteNombre);
  console.log('clienteTelefono:', pago.clienteTelefono);
  console.log('marca:', pago.marca);
  console.log('modelo:', pago.modelo);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>REGISTRAR PAGO</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              hitSlop={8}
            >
              <FontAwesome name="times" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* INFORMACIÓN DEL CLIENTE */}
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>INFORMACIÓN DEL CLIENTE</Text>

            <Text style={styles.pagoNombre}>
              {pago.clienteNombre}
            </Text>

            <Text style={styles.pagoMeta}>Tel: {pago.clienteTelefono}</Text>

            <Text style={styles.pagoMeta}>
              {pago.clienteCorreo}
            </Text>

            {/* INFORMACIÓN DEL VEHÍCULO */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>INFORMACIÓN DEL VEHÍCULO</Text>

            <Text style={styles.pagoMeta}>
              {pago.marca} {pago.modelo} - Placa: {pago.placa}
            </Text>

            <Text style={styles.pagoMeta}>Año: {pago.anio}</Text>

            <Text style={styles.pagoMeta}>
              Kilometraje: {pago.kilometraje} km
            </Text>

            {/* INFORMACIÓN DEL SERVICIO */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>INFORMACIÓN DEL SERVICIO</Text>

            <Text style={styles.pagoMeta}>
              Servicio: {pago.servicio}
            </Text>

            <Text style={styles.pagoMeta}>Mecánico: {pago.mecanico}</Text>

            {/* DETALLE DEL MANTENIMIENTO */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>DETALLE DEL MANTENIMIENTO</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Repuestos</Text>
              <Text style={styles.detailValue}>${pago.costoRepuestos.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mano de obra</Text>
              <Text style={styles.detailValue}>${pago.costoManoObra.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            {/* TOTAL */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
              <Text style={styles.totalValue}>${pago.total.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            {/* MÉTODO DE PAGO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>REGISTRO DE PAGO</Text>

            <Text style={styles.label}>Método de Pago</Text>
            <View style={styles.metodoPagoRow}>
              <Pressable
                style={[
                  styles.metodoPagoBtn,
                  metodoPago === 'EFECTIVO' && styles.metodoPagoBtnActive,
                ]}
                onPress={() => setMetodoPago('EFECTIVO')}
              >
                <Text
                  style={[
                    styles.metodoPagoBtnText,
                    metodoPago === 'EFECTIVO' && styles.metodoPagoBtnTextActive,
                  ]}
                >
                  EFECTIVO
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.metodoPagoBtn,
                  metodoPago === 'TRANSFERENCIA' && styles.metodoPagoBtnActive,
                ]}
                onPress={() => setMetodoPago('TRANSFERENCIA')}
              >
                <Text
                  style={[
                    styles.metodoPagoBtnText,
                    metodoPago === 'TRANSFERENCIA' && styles.metodoPagoBtnTextActive,
                  ]}
                >
                  TRANSFERENCIA
                </Text>
              </Pressable>
            </View>
            {errMetodoPago ? <Text style={styles.errorText}>{errMetodoPago}</Text> : null}

            {/* BOTÓN PARA CARGAR COMPROBANTE (solo si es TRANSFERENCIA) */}
            {metodoPago === 'TRANSFERENCIA' && (
              <>
                <Text style={[styles.label, { marginTop: 16 }]}>Comprobante de Transferencia *</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.uploadButton,
                    pressed && styles.uploadButtonPressed,
                    errComprobante && styles.uploadButtonError
                  ]}
                  onPress={handleSeleccionarComprobante}
                >
                  <FontAwesome
                    name={comprobanteUri ? "check-circle" : "upload"}
                    size={20}
                    color={comprobanteUri ? "#10B981" : "#64748B"}
                  />
                  <Text style={[
                    styles.uploadButtonText,
                    comprobanteUri && styles.uploadButtonTextSuccess
                  ]}>
                    {comprobanteUri
                      ? `✓ ${comprobanteNombre || 'Archivo cargado'}`
                      : 'Cargar comprobante'}
                  </Text>
                </Pressable>
                {errComprobante ? <Text style={styles.errorText}>{errComprobante}</Text> : null}
              </>
            )}

            {/* FECHA DE PAGO */}
            <Text style={styles.label}>Fecha de Pago</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => {
                setCalendarMonth(fechaPago || new Date());
                setCalendarVisible(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {fechaPago ? formatDate(fechaPago) : 'DD/MM/AAAA'}
              </Text>
              <FontAwesome name="calendar" size={16} color="#64748B" />
            </Pressable>
            {errFechaPago ? <Text style={styles.errorText}>{errFechaPago}</Text> : null}

            {/* OBSERVACIÓN */}
            <Text style={styles.label}>Observación (Opcional)</Text>
            <TextInput
              placeholder="Ingrese alguna observación adicional..."
              placeholderTextColor="#64748B"
              value={observacion}
              onChangeText={setObservacion}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea]}
            />

            {/* BOTONES */}
            <View style={styles.botonesContainer}>
              <Pressable
                onPress={handleConfirmar}
                style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                    CONFIRMAR PAGO
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                    CANCELAR
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* MODAL CALENDARIO */}
        <Modal visible={calendarVisible} transparent animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
          <Pressable style={styles.calendarOverlay} onPress={() => setCalendarVisible(false)}>
            <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
              <View style={styles.calendarHeader}>
                <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} style={styles.calendarNavBtn}>
                  <Text style={styles.calendarNavText}>‹</Text>
                </Pressable>
                <Text style={styles.calendarMonthLabel}>
                  {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                </Text>
                <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} style={styles.calendarNavBtn}>
                  <Text style={styles.calendarNavText}>›</Text>
                </Pressable>
              </View>
              <View style={styles.calendarWeekRow}>
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <Text key={i} style={styles.calendarWeekLabel}>{day}</Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {buildCalendarDays(calendarMonth).map((day, i) => {
                  if (!day) return <View key={i} style={styles.calendarCell} />;
                  const isSelected = fechaPago?.toDateString() === day.toDateString();
                  const isDisabled = isDateDisabled(day);
                  return (
                    <Pressable 
                      key={i} 
                      style={[
                        styles.calendarCell, 
                        isSelected && styles.calendarCellSelected,
                        isDisabled && styles.calendarCellDisabled
                      ]} 
                      onPress={() => { 
                        if (!isDisabled) {
                          setFechaPago(day); 
                          setCalendarVisible(false);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <Text style={[
                        styles.calendarCellText, 
                        isSelected && styles.calendarCellSelectedText,
                        isDisabled && styles.calendarCellDisabledText
                      ]}>
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable onPress={() => setCalendarVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
                {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}
