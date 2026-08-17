// registroMantenimiento.tsx
// Modal para registrar el mantenimiento realizado a una solicitud

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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalesReporte/registroMantenimiento';
import { actualizarSolicitud } from '@/utils/datosSimulados';
import {
  validarTextoNumerosCaracteresEspeciales,
} from '@/utils/validaciones';

const TIPOS_TRABAJO = [
  'Cambio de aceite',
  'Revisión de frenos',
  'Alineación y balanceo',
  'Cambio de neumáticos',
  'Revisión de motor',
  'Cambio de filtros',
  'Diagnóstico computarizado',
  'Reparación de suspensión',
  'Reparación eléctrica',
  'Otros',
] as const;

interface RegistroMantenimientoProps {
  visible: boolean;
  solicitud: any | null;
  onClose: () => void;
  onSuccess: (solicitud: any) => void;
  onShowSuccessModal: () => void; // Nuevo prop para mostrar modal de éxito
}

export default function RegistroMantenimiento({
  visible,
  solicitud,
  onClose,
  onSuccess,
  onShowSuccessModal,
}: RegistroMantenimientoProps) {
  // Estados para todos los campos del mantenimiento
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajoRealizadoTipo, setTrabajoRealizadoTipo] = useState('Cambio de aceite');
  const [otroTrabajo, setOtroTrabajo] = useState('');
  const [repuestosUtilizados, setRepuestosUtilizados] = useState('');
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState('');
  const [costoManoObra, setCostoManoObra] = useState('');
  const [costoTotalRepuestos, setCostoTotalRepuestos] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFinalizacion, setFechaFinalizacion] = useState<Date | null>(null);
  
  const [trabajoDropdownOpen, setTrabajoDropdownOpen] = useState(false);

  // Estados de modales de calendario
  const [calendarInicioVisible, setCalendarInicioVisible] = useState(false);
  const [calendarFinalizacionVisible, setCalendarFinalizacionVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Estados de error
  const [errDiagnostico, setErrDiagnostico] = useState('');
  const [errOtroTrabajo, setErrOtroTrabajo] = useState('');
  const [errRepuestos, setErrRepuestos] = useState('');
  const [errDiagnosticoRealizado, setErrDiagnosticoRealizado] = useState('');
  const [errCostoManoObra, setErrCostoManoObra] = useState('');
  const [errCostoTotalRepuestos, setErrCostoTotalRepuestos] = useState('');
  const [errObservaciones, setErrObservaciones] = useState('');
  const [errFechaInicio, setErrFechaInicio] = useState('');
  const [errFechaFinalizacion, setErrFechaFinalizacion] = useState('');

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

  // Función para validar y formatear input de costos (solo números y un punto decimal)
  const validarFormatoCosto = (texto: string, valorActual: string): string => {
    // Si está vacío, permitir
    if (texto === '') return '';
    
    // Si empieza con punto o coma, rechazar
    if (texto.startsWith('.') || texto.startsWith(',')) return valorActual;
    
    // Permitir solo números y un punto
    const textoLimpio = texto.replace(/[^0-9.]/g, '');
    
    // Contar cuántos puntos hay
    const puntos = (textoLimpio.match(/\./g) || []).length;
    
    // Si hay más de un punto, rechazar el cambio
    if (puntos > 1) return valorActual;
    
    // Si hay un punto, validar que haya números antes
    if (textoLimpio.includes('.')) {
      const partes = textoLimpio.split('.');
      // Si la parte antes del punto está vacía, rechazar
      if (partes[0] === '') return valorActual;
    }
    
    return textoLimpio;
  };

  // Cargar datos existentes si los hay
  useEffect(() => {
    if (solicitud) {
      setDiagnostico(solicitud.diagnostico || '');
      setTrabajoRealizadoTipo(solicitud.trabajoRealizado || 'Cambio de aceite');
      setOtroTrabajo(solicitud.otroTrabajo || '');
      setRepuestosUtilizados(solicitud.repuestosUtilizados || '');
      setDiagnosticoRealizado(solicitud.diagnosticoRealizado || '');
      setCostoManoObra(solicitud.costoManoObra || '');
      setCostoTotalRepuestos(solicitud.costoRepuestos || '');
      setObservaciones(solicitud.observaciones || '');
      
      // Fechas
      if (solicitud.fechaInicio) {
        const [d, m, y] = solicitud.fechaInicio.split('/');
        setFechaInicio(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
      } else {
        setFechaInicio(null);
      }
      if (solicitud.fechaFinalizacion) {
        const [d, m, y] = solicitud.fechaFinalizacion.split('/');
        setFechaFinalizacion(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
      } else {
        setFechaFinalizacion(null);
      }
      
      // Limpiar errores
      setErrDiagnostico('');
      setErrOtroTrabajo('');
      setErrRepuestos('');
      setErrDiagnosticoRealizado('');
      setErrCostoManoObra('');
      setErrCostoTotalRepuestos('');
      setErrObservaciones('');
      setErrFechaInicio('');
      setErrFechaFinalizacion('');
    }
  }, [solicitud]);

  // Funciones auxiliares de calendario
  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar';

  const formatDateDDMMYYYY = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Verificar si todos los campos están llenos
  const todosLosCamposLlenos = () => {
    const camposBasicos = 
      diagnostico.trim() !== '' &&
      repuestosUtilizados.trim() !== '' &&
      diagnosticoRealizado.trim() !== '' &&
      costoManoObra.trim() !== '' &&
      costoTotalRepuestos.trim() !== '' &&
      observaciones.trim() !== '' &&
      fechaInicio !== null &&
      fechaFinalizacion !== null;
    
    const campoTrabajo = trabajoRealizadoTipo === 'Otros' 
      ? otroTrabajo.trim() !== ''
      : true;
    
    return camposBasicos && campoTrabajo;
  };

  // Verificar si al menos un campo tiene datos
  const tieneDatos = () => {
    return (
      diagnostico.trim() !== '' ||
      otroTrabajo.trim() !== '' ||
      repuestosUtilizados.trim() !== '' ||
      diagnosticoRealizado.trim() !== '' ||
      costoManoObra.trim() !== '' ||
      costoTotalRepuestos.trim() !== '' ||
      observaciones.trim() !== '' ||
      fechaInicio !== null ||
      fechaFinalizacion !== null
    );
  };

  const guardar = () => {
    if (!solicitud) return;

    // Limpiar errores primero
    setErrDiagnostico('');
    setErrOtroTrabajo('');
    setErrRepuestos('');
    setErrDiagnosticoRealizado('');
    setErrCostoManoObra('');
    setErrCostoTotalRepuestos('');
    setErrObservaciones('');
    setErrFechaInicio('');
    setErrFechaFinalizacion('');

    // Determinar el nuevo estado ANTES de validar
    let nuevoEstado: 'Pendiente' | 'En_proceso' | 'Completado';
    const todosLlenos = todosLosCamposLlenos();
    const hayDatos = tieneDatos();

    if (todosLlenos) {
      nuevoEstado = 'Completado';
      // Solo validar si están todos los campos llenos (finalizar)
      const eDiagnostico = validarTextoNumerosCaracteresEspeciales(diagnostico, 'El diagnóstico');
      const eOtroTrabajo = trabajoRealizadoTipo === 'Otros' 
        ? validarTextoNumerosCaracteresEspeciales(otroTrabajo, 'La especificación del trabajo')
        : null;
      const eRepuestos = validarTextoNumerosCaracteresEspeciales(repuestosUtilizados, 'Los repuestos utilizados');
      const eDiagnosticoRealizado = validarTextoNumerosCaracteresEspeciales(diagnosticoRealizado, 'La descripción del trabajo realizado');
      
      const eCostoManoObra = !costoManoObra.trim() 
        ? 'El costo de mano de obra es obligatorio.' 
        : !/^\d+(\.\d+)?$/.test(costoManoObra.trim()) 
          ? 'El costo debe ser un número válido (ej: 25 o 25.50)' 
          : null;
      
      const eCostoTotalRepuestos = !costoTotalRepuestos.trim() 
        ? 'El costo total de repuestos es obligatorio.' 
        : !/^\d+(\.\d+)?$/.test(costoTotalRepuestos.trim()) 
          ? 'El costo debe ser un número válido (ej: 25 o 25.50)' 
          : null;
      
      const eObservaciones = validarTextoNumerosCaracteresEspeciales(observaciones, 'Las observaciones');
      const eFechaInicio = !fechaInicio ? 'La fecha de inicio es obligatoria.' : null;
      const eFechaFinalizacion = !fechaFinalizacion ? 'La fecha de finalización es obligatoria.' : null;

      // Establecer errores
      setErrDiagnostico(eDiagnostico ?? '');
      setErrOtroTrabajo(eOtroTrabajo ?? '');
      setErrRepuestos(eRepuestos ?? '');
      setErrDiagnosticoRealizado(eDiagnosticoRealizado ?? '');
      setErrCostoManoObra(eCostoManoObra ?? '');
      setErrCostoTotalRepuestos(eCostoTotalRepuestos ?? '');
      setErrObservaciones(eObservaciones ?? '');
      setErrFechaInicio(eFechaInicio ?? '');
      setErrFechaFinalizacion(eFechaFinalizacion ?? '');

      // Si hay errores, no continuar
      if ([eDiagnostico, eOtroTrabajo, eRepuestos, eDiagnosticoRealizado, 
        eCostoManoObra, eCostoTotalRepuestos, eObservaciones, 
        eFechaInicio, eFechaFinalizacion].some(Boolean)) {
        return;
      }
    } else if (hayDatos) {
      nuevoEstado = 'En_proceso';
      // No validar, solo guardar con estado EN_PROCESO
    } else {
      nuevoEstado = 'Pendiente';
      // Guardar vacío = PENDIENTE
    }

    // Calcular costo total
    const costoTotal = (parseFloat(costoManoObra) || 0) + (parseFloat(costoTotalRepuestos) || 0);

    // Actualizar solicitud
    const datosActualizados = {
      diagnostico: diagnostico.trim(),
      trabajoRealizado: trabajoRealizadoTipo === 'Otros' ? otroTrabajo.trim() : trabajoRealizadoTipo,
      otroTrabajo: trabajoRealizadoTipo === 'Otros' ? otroTrabajo.trim() : '',
      repuestosUtilizados: repuestosUtilizados.trim(),
      diagnosticoRealizado: diagnosticoRealizado.trim(),
      costoManoObra: costoManoObra.trim(),
      costoRepuestos: costoTotalRepuestos.trim(),
      observaciones: observaciones.trim(),
      fechaInicio: formatDateDDMMYYYY(fechaInicio),
      fechaFinalizacion: formatDateDDMMYYYY(fechaFinalizacion),
      costoTotal: costoTotal.toFixed(2),
      estado: nuevoEstado,
    };

    actualizarSolicitud(solicitud.id, datosActualizados);
    
    const solicitudActualizada = { ...solicitud, ...datosActualizados };
    onSuccess(solicitudActualizada);
    
    onClose(); // Cerrar modal de registro
    onShowSuccessModal(); // Mostrar modal de éxito
  };

  if (!solicitud) return null;

  // Verificar si es edición (ya tiene datos previos de mantenimiento)
  const esEdicion = () => {
    return !!(
      solicitud.diagnostico ||
      solicitud.trabajoRealizado ||
      solicitud.repuestosUtilizados ||
      solicitud.diagnosticoRealizado ||
      solicitud.costoManoObra ||
      solicitud.costoRepuestos ||
      solicitud.observaciones ||
      solicitud.fechaInicio ||
      solicitud.fechaFinalizacion
    );
  };

  // Determinar el texto del botón
  const getTextoBoton = () => {
    // Si todos los campos están llenos
    if (todosLosCamposLlenos()) {
      return 'FINALIZAR REPORTE';
    }
    
    // Si tiene algunos datos pero no todos
    if (tieneDatos()) {
      return 'GUARDAR REPORTE';
    }
    
    // Si está completamente vacío
    return 'GUARDAR REPORTE';
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextBlock}>
              <Text style={styles.modalTitle}>Registro de Mantenimiento</Text>
              <Text style={styles.modalSubtitle}>
                Registra el mantenimiento realizado para {solicitud.nombreCliente}
              </Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>Nuevo</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                onClose();
              }}
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
            {/* SECCIÓN: INFORMACIÓN DEL CLIENTE Y VEHÍCULO (Solo lectura) */}
            <Text style={styles.sectionTitle}>Información del Cliente y Vehículo</Text>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Nombre Completo:</Text>
              <Text style={styles.infoValue}>{solicitud.nombreCliente}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{solicitud.telefono || 'No especificado'}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Correo Electrónico:</Text>
              <Text style={styles.infoValue}>{solicitud.correoCliente}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Marca del Vehículo:</Text>
              <Text style={styles.infoValue}>{solicitud.marca}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Modelo:</Text>
              <Text style={styles.infoValue}>{solicitud.modelo}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{solicitud.placa}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Año:</Text>
              <Text style={styles.infoValue}>{solicitud.anio}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Kilometraje:</Text>
              <Text style={styles.infoValue}>{solicitud.kilometraje} km</Text>
            </View>

            {/* DATOS DEL MANTENIMIENTO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Datos del Mantenimiento</Text>

            {/* Diagnóstico inicial */}
            <Text style={styles.label}>Diagnóstico</Text>
            <TextInput
              placeholder="Describe el diagnóstico inicial del problema"
              placeholderTextColor="#64748B"
              value={diagnostico}
              onChangeText={(val) => {
                setDiagnostico(val);
                setErrDiagnostico('');
              }}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, errDiagnostico && styles.inputError]}
            />
            {errDiagnostico ? <Text style={styles.errorText}>{errDiagnostico}</Text> : null}

            {/* Tipo de trabajo realizado */}
            <Text style={styles.label}>Trabajo Realizado</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setTrabajoDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>{trabajoRealizadoTipo}</Text>
              <Text style={styles.dropdownArrow}>{trabajoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {trabajoDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {TIPOS_TRABAJO.map((tipo) => (
                  <Pressable
                    key={tipo}
                    style={[
                      styles.dropdownItem,
                      trabajoRealizadoTipo === tipo && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setTrabajoRealizadoTipo(tipo);
                      setTrabajoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {trabajoRealizadoTipo === tipo ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{tipo}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Otro trabajo (si seleccionó "Otros") */}
            {trabajoRealizadoTipo === 'Otros' && (
              <>
                <Text style={styles.label}>Especifica el Trabajo</Text>
                <TextInput
                  placeholder="Describe brevemente el tipo de trabajo realizado"
                  placeholderTextColor="#64748B"
                  value={otroTrabajo}
                  onChangeText={(val) => {
                    setOtroTrabajo(val);
                    setErrOtroTrabajo('');
                  }}
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textarea, errOtroTrabajo && styles.inputError]}
                />
                {errOtroTrabajo ? <Text style={styles.errorText}>{errOtroTrabajo}</Text> : null}
              </>
            )}

            {/* Repuestos utilizados */}
            <Text style={styles.label}>Repuestos Utilizados</Text>
            <TextInput
              placeholder="Coloque los componentes utilizados con el precio de cada uno"
              placeholderTextColor="#64748B"
              value={repuestosUtilizados}
              onChangeText={(val) => {
                setRepuestosUtilizados(val);
                setErrRepuestos('');
              }}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea, errRepuestos && styles.inputError]}
            />
            {errRepuestos ? <Text style={styles.errorText}>{errRepuestos}</Text> : null}

            {/* Diagnóstico realizado (descripción paso a paso) */}
            <Text style={styles.label}>Diagnóstico Realizado</Text>
            <TextInput
              placeholder="Describe paso a paso el diagnóstico y trabajo realizado"
              placeholderTextColor="#64748B"
              value={diagnosticoRealizado}
              onChangeText={(val) => {
                setDiagnosticoRealizado(val);
                setErrDiagnosticoRealizado('');
              }}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea, errDiagnosticoRealizado && styles.inputError]}
            />
            {errDiagnosticoRealizado ? <Text style={styles.errorText}>{errDiagnosticoRealizado}</Text> : null}

            {/* Costo mano de obra */}
            <Text style={styles.label}>Costo Mano de Obra</Text>
            <TextInput
              placeholder="Ingrese el monto"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={costoManoObra}
              onChangeText={(val) => {
                const formatted = validarFormatoCosto(val, costoManoObra);
                setCostoManoObra(formatted);
                setErrCostoManoObra('');
              }}
              style={[styles.input, errCostoManoObra && styles.inputError]}
            />
            {errCostoManoObra ? <Text style={styles.errorText}>{errCostoManoObra}</Text> : null}

            {/* Costo total de repuestos */}
            <Text style={styles.label}>Costo Total de Repuestos Utilizados</Text>
            <TextInput
              placeholder="Ingrese el monto"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={costoTotalRepuestos}
              onChangeText={(val) => {
                const formatted = validarFormatoCosto(val, costoTotalRepuestos);
                setCostoTotalRepuestos(formatted);
                setErrCostoTotalRepuestos('');
              }}
              style={[styles.input, errCostoTotalRepuestos && styles.inputError]}
            />
            {errCostoTotalRepuestos ? <Text style={styles.errorText}>{errCostoTotalRepuestos}</Text> : null}

            {/* Costo total (calculado automáticamente) */}
            {(costoManoObra || costoTotalRepuestos) && (
              <>
                <Text style={styles.label}>Costo Total</Text>
                <Text style={styles.costoTotal}>
                  ${((parseFloat(costoManoObra) || 0) + (parseFloat(costoTotalRepuestos) || 0)).toFixed(2)}
                </Text>
              </>
            )}

            {/* Observaciones */}
            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              placeholder="Recomendaciones post-servicio para el cliente"
              placeholderTextColor="#64748B"
              value={observaciones}
              onChangeText={(val) => {
                setObservaciones(val);
                setErrObservaciones('');
              }}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, errObservaciones && styles.inputError]}
            />
            {errObservaciones ? <Text style={styles.errorText}>{errObservaciones}</Text> : null}

            {/* Fecha inicio */}
            <Text style={styles.label}>Fecha de Inicio de Mantenimiento</Text>
            <Pressable
              style={[styles.dateButton, errFechaInicio && styles.inputError]}
              onPress={() => {
                setCalendarMonth(fechaInicio || new Date());
                setCalendarInicioVisible(true);
                setErrFechaInicio('');
              }}
            >
              <Text style={styles.dateButtonText}>{formatDate(fechaInicio)}</Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>
            {errFechaInicio ? <Text style={styles.errorText}>{errFechaInicio}</Text> : null}

            {/* Fecha finalización */}
            <Text style={styles.label}>Fecha de Finalización de Mantenimiento</Text>
            <Pressable
              style={[styles.dateButton, errFechaFinalizacion && styles.inputError]}
              onPress={() => {
                setCalendarMonth(fechaFinalizacion || new Date());
                setCalendarFinalizacionVisible(true);
                setErrFechaFinalizacion('');
              }}
            >
              <Text style={styles.dateButtonText}>{formatDate(fechaFinalizacion)}</Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>
            {errFechaFinalizacion ? <Text style={styles.errorText}>{errFechaFinalizacion}</Text> : null}

            {/* Botón Guardar/Finalizar */}
            <Pressable
              onPress={guardar}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                  {getTextoBoton()}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL CALENDARIO FECHA INICIO */}
      <Modal visible={calendarInicioVisible} transparent animationType="fade" onRequestClose={() => setCalendarInicioVisible(false)}>
        <Pressable style={styles.calendarOverlay} onPress={() => setCalendarInicioVisible(false)}>
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
                const isSelected = fechaInicio?.toDateString() === day.toDateString();
                return (
                  <Pressable key={i} style={[styles.calendarCell, isSelected && styles.calendarCellSelected]} onPress={() => { setFechaInicio(day); setCalendarInicioVisible(false); }}>
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>{day.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarInicioVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaInicio(null); setCalendarInicioVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CALENDARIO FECHA FINALIZACIÓN */}
      <Modal visible={calendarFinalizacionVisible} transparent animationType="fade" onRequestClose={() => setCalendarFinalizacionVisible(false)}>
        <Pressable style={styles.calendarOverlay} onPress={() => setCalendarFinalizacionVisible(false)}>
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
                const isSelected = fechaFinalizacion?.toDateString() === day.toDateString();
                return (
                  <Pressable key={i} style={[styles.calendarCell, isSelected && styles.calendarCellSelected]} onPress={() => { setFechaFinalizacion(day); setCalendarFinalizacionVisible(false); }}>
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>{day.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarFinalizacionVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaFinalizacion(null); setCalendarFinalizacionVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
