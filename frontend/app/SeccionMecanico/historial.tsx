// historial.tsx
// Pantalla de historial de mantenimientos completados para el mecánico.
// Permite buscar registros por placa, ver los detalles completos de cada
// mantenimiento y reenviar el reporte al correo del cliente.


// Hook de React para manejar estado local
import { useCallback, useEffect, useState } from 'react';

// Componentes nativos de React Native
import {
  BackHandler,          // Intercepta el botón físico de atrás en Android
  KeyboardAvoidingView, // Evita que el teclado tape los inputs en iOS
  Modal,                // Superposición de contenido sobre la pantalla principal
  Platform,             // Detecta el sistema operativo (iOS / Android)
  Pressable,            // Área táctil con feedback de presión
  ScrollView,           // Vista con scroll vertical
  Text,                 // Renderiza texto en pantalla
  TextInput,            // Campo de entrada de texto (usado en modo solo lectura en detalles)
  View,                 // Contenedor genérico
} from 'react-native';

// Íconos vectoriales de FontAwesome (search, car, calendar, user, file-text, send, check-circle)
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';

// Barra de navegación del mecánico con opciones Reportes, Historial y Cerrar sesión
import NavbarMecanico from '@/components/navbarMecanico/navbarMecanico';

// useFocusEffect: ejecuta un efecto solo mientras la pantalla está en foco
// useRouter: para navegar entre pantallas
import { useFocusEffect, useRouter } from 'expo-router';

// Estilos compartidos con ReportesClientes (tarjetas, modales, botones)
import styles from '@/Styles/pantallaMecanico/ReportesClientes';

// Estilos exclusivos del historial (buscador, texto vacío, valores de detalle)
import histStyles from '@/Styles/pantallaMecanico/historial';

// Contexto de autenticación
import { useAuth } from '@/context/AuthContext';

// Modales del historial
import VisualizarReporte from './modalesHistorial/visualizarReporte';
import ConfirmarReenvioReporte from './modalesHistorial/confirmarReenvioReporte';
import ReenvioReporte from './modalesHistorial/reenvioReporte';


// TIPOS

// Estructura del registro de mantenimiento técnico
// Reutiliza el mismo tipo que ReportesClientes para consistencia
type Mantenimiento = {
  marca: string;              // Marca del vehículo
  modelo: string;             // Modelo del vehículo
  placa: string;              // Placa del vehículo
  año: string;                // Año de fabricación
  kilometraje: string;        // Kilometraje actual del vehículo
  fechaServicio: string;      // Fecha en que se realizó el servicio
  mecanicoAsignado: string;   // Nombre del mecánico que atendió
  diagnostico: string;        // Diagnóstico inicial del problema
  trabajoRealizado: string;   // Tipo de trabajo realizado (del catálogo)
  otroTrabajo: string;        // Descripción si el trabajo fue "Otros"
  repuestosUtilizados: string;// Lista de repuestos usados
  diagnosticoRealizado: string;// Descripción paso a paso del trabajo
  costoManoObra: string;      // Costo de la mano de obra en dólares
  costoRepuestos: string;     // Costo total de los repuestos en dólares
  observaciones: string;      // Recomendaciones post-servicio para el cliente
  fechaInicio: string;        // Fecha de inicio del servicio
  fechaFinalizacion: string;  // Fecha de finalización del servicio
};

// Estructura de un registro del historial (mantenimiento completado)
type RegistroHistorial = {
  id: string;                  // Identificador único del registro
  clienteNombre: string;       // Nombre completo del cliente
  clienteCorreo: string;       // Correo del cliente para reenviar el reporte
  telefono: string;            // Teléfono del cliente
  marca: string;               // Marca del vehículo (para mostrar en la tarjeta)
  modelo: string;              // Modelo del vehículo
  placa: string;               // Placa del vehículo (campo de búsqueda)
  fechaMantenimiento: string;  // Fecha en que se completó el mantenimiento
  mecanicoNombre: string;      // Nombre del mecánico que realizó el trabajo
  mantenimiento: Mantenimiento;// Datos completos del reporte técnico
};


// DATOS

// Lista vacía — los registros reales se cargan desde datosSimulados
const MOCK_HISTORIAL: RegistroHistorial[] = [];


// COMPONENTE PRINCIPAL


export default function HistorialScreen() {
  const router = useRouter();
  const { token, user, logout } = useAuth();

  // Bloquear capturas de pantalla
  useEffect(() => {
    const preventCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    preventCapture();
    // No llamamos allowScreenCaptureAsync() al desmontar para mantener el bloqueo activo
  }, []);

  // Función para cerrar sesión y limpiar historial
  const handleSignOut = async () => {
    await logout();
    // Navegar al login con parámetro que indica cierre de sesión
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // BackHandler: navega a ReportesClientes al presionar back
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        router.push('/SeccionMecanico/ReportesClientes' as any);
        return true; // Previene el comportamiento por defecto
      });
      return () => sub.remove();
    }, [router]),
  );

  // Estado del campo de búsqueda (placa, nombre, correo, teléfono)
  const [busqueda, setBusqueda] = useState('');
  
  // Estado de orden A-Z / Z-A
  const [ordenAZ, setOrdenAZ] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [ordenDropdownOpen, setOrdenDropdownOpen] = useState(false);
  
  // Estado de fechas
  const [fechaMinima, setFechaMinima] = useState<Date | null>(null);
  const [fechaMaxima, setFechaMaxima] = useState<Date | null>(null);
  const [calendarMinimaVisible, setCalendarMinimaVisible] = useState(false);
  const [calendarMaximaVisible, setCalendarMaximaVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Lista de registros del historial (se carga desde el backend)
  const [lista, setLista] = useState<RegistroHistorial[]>([]);

  // Recarga el historial cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      // Cargar desde datos simulados
      const { obtenerSolicitudesSimuladas } = require('@/utils/datosSimulados');
      const solicitudes = obtenerSolicitudesSimuladas();
      const registros = solicitudes
        .filter((s: any) => s.estado === 'Completado')
        .map((s: any) => ({
          id: s.id,
          clienteNombre: s.nombreCliente,
          clienteCorreo: s.correoCliente,
          telefono: s.telefono || 'No especificado',
          marca: s.marca,
          modelo: s.modelo,
          placa: s.placa,
          fechaMantenimiento: s.fechaFinalizacion || s.fechaCita,
          mecanicoNombre: s.mecanicoAsignado || 'No asignado',
          mantenimiento: {
            marca: s.marca,
            modelo: s.modelo,
            placa: s.placa,
            año: s.anio,
            kilometraje: s.kilometraje,
            fechaServicio: s.fechaServicio || s.fechaCita,
            mecanicoAsignado: s.mecanicoAsignado || 'No asignado',
            diagnostico: s.diagnostico || '',
            trabajoRealizado: s.trabajoRealizado || '',
            otroTrabajo: s.otroTrabajo || '',
            repuestosUtilizados: s.repuestosUtilizados || '',
            diagnosticoRealizado: s.diagnosticoRealizado || '',
            costoManoObra: s.costoManoObra || '0',
            costoRepuestos: s.costoRepuestos || '0',
            observaciones: s.observaciones || '',
            fechaInicio: s.fechaInicio || '',
            fechaFinalizacion: s.fechaFinalizacion || '',
          },
        }));
      setLista(registros);
    }, []),
  );

  // Estado: controla si el modal de detalles está visible
  const [detallesModal, setDetallesModal] = useState(false);
  // Estado: registro cuyo detalle se está mostrando (null cuando el modal está cerrado)
  const [detallesTarget, setDetallesTarget] = useState<RegistroHistorial | null>(null);

  // Estado: controla si el modal de reenvío está visible
  const [sendModal, setSendModal] = useState(false);
  // Estado: registro al que se va a reenviar el reporte
  const [sendTarget, setSendTarget] = useState<RegistroHistorial | null>(null);
  // Estado: true cuando el reenvío fue exitoso
  const [sendSuccess, setSendSuccess] = useState(false);
  // Estado: true mientras espera respuesta del backend
  const [sendLoading, setSendLoading] = useState(false);
  // Estado: mensaje de error si el envío falló
  const [sendError, setSendError] = useState('');

  // Llama al backend para reenviar el reporte al correo del cliente (SIMULADO)
  const reenviarReporte = async () => {
    if (!sendTarget) return;
    setSendLoading(true);
    setSendError('');
    
    // Simulación de envío exitoso
    setTimeout(() => {
      setSendLoading(false);
      setSendSuccess(true);
    }, 500);
  };

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

  // Filtra la lista por búsqueda, orden y rango de fechas
  const listaFiltrada = lista
    .filter((r) => {
      // Búsqueda por nombre, placa, correo o teléfono
      const textoBusqueda = busqueda.trim().toLowerCase();
      if (!textoBusqueda) return true;
      
      return (
        r.clienteNombre.toLowerCase().includes(textoBusqueda) ||
        r.placa.toLowerCase().includes(textoBusqueda) ||
        r.clienteCorreo.toLowerCase().includes(textoBusqueda)
      );
    })
    .filter((r) => {
      // Filtro de rango de fechas
      if (!fechaMinima && !fechaMaxima) return true;
      
      // Parsear la fecha del registro (formato DD/MM/YYYY)
      const partes = r.fechaMantenimiento.split('/');
      if (partes.length !== 3) return true;
      
      const fechaRegistro = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      fechaRegistro.setHours(0, 0, 0, 0);
      
      if (fechaMinima) {
        const fechaMin = new Date(fechaMinima);
        fechaMin.setHours(0, 0, 0, 0);
        if (fechaRegistro < fechaMin) return false;
      }
      
      if (fechaMaxima) {
        const fechaMax = new Date(fechaMaxima);
        fechaMax.setHours(23, 59, 59, 999);
        if (fechaRegistro > fechaMax) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenar por nombre del cliente
      const nombreA = a.clienteNombre;
      const nombreB = b.clienteNombre;
      return ordenAZ === 'A-Z' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

  // Calcular totales
  const totalReportes = lista.length;
  const reportesEncontrados = listaFiltrada.length;

  // RENDER

  return (
    // Contenedor raíz que ocupa toda la pantalla
    <View style={styles.page}>

      {/* Navbar del mecánico */}
      <NavbarMecanico onSignOut={handleSignOut} />

      {/* ScrollView principal con la lista de registros */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Cierra el teclado al tocar fuera del input
      >
        {/* Título centrado de la pantalla */}
        <Text style={styles.screenTitle}>HISTORIAL</Text>

        {/* FILTROS */}
        <View style={styles.filterContainer}>
          {/* Barra de búsqueda */}
          <Text style={styles.filterLabel}>Buscar Reporte</Text>
          <View style={styles.searchBox}>
            <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
            <TextInput
              placeholder="Busca lo que necesitas"
              placeholderTextColor="#94A3B8"
              value={busqueda}
              onChangeText={setBusqueda}
              style={styles.searchInput}
            />
          </View>

          {/* Orden A-Z / Z-A */}
          <Text style={styles.filterLabel}>Orden</Text>
          <Pressable style={styles.filterDropdown} onPress={() => setOrdenDropdownOpen((v) => !v)}>
            <Text style={styles.filterDropdownText}>{ordenAZ}</Text>
            <Text style={styles.dropdownArrow}>{ordenDropdownOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {ordenDropdownOpen && (
            <View style={styles.dropdownList}>
              {(['A-Z', 'Z-A'] as const).map((option) => (
                <Pressable
                  key={option}
                  style={[styles.dropdownItem, ordenAZ === option && styles.dropdownItemActive]}
                  onPress={() => {
                    setOrdenAZ(option);
                    setOrdenDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{ordenAZ === option ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Rango de fechas */}
          <Text style={styles.filterLabel}>Rango de Fechas del Reporte Generado</Text>
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Pressable
                style={styles.dateButton}
                onPress={() => {
                  setCalendarMonth(fechaMinima || new Date());
                  setCalendarMinimaVisible(true);
                }}
              >
                <Text style={styles.dateButtonText}>{formatDate(fechaMinima)}</Text>
                <FontAwesome name="calendar" size={14} color="#64748B" />
              </Pressable>
            </View>
            <View style={styles.filterHalf}>
              <Pressable
                style={styles.dateButton}
                onPress={() => {
                  setCalendarMonth(fechaMaxima || new Date());
                  setCalendarMaximaVisible(true);
                }}
              >
                <Text style={styles.dateButtonText}>{formatDate(fechaMaxima)}</Text>
                <FontAwesome name="calendar" size={14} color="#64748B" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* RESUMEN */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalReportes}</Text>
            <Text style={styles.summaryLabel}>Total Reportes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{reportesEncontrados}</Text>
            <Text style={styles.summaryLabel}>Reportes Encontrados</Text>
          </View>
        </View>

        {/* Mensaje cuando no hay resultados para la búsqueda actual */}
        {listaFiltrada.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron reportes</Text>
        )}

        {/* Itera sobre los registros filtrados para renderizar una tarjeta por cada uno */}
        <View style={styles.solicitudesContainer}>

        {/* Itera sobre los registros filtrados para renderizar una tarjeta por cada uno */}
        {listaFiltrada.map((r) => (
          <View key={r.id} style={styles.card}>

            {/* Nombre completo del cliente */}
            <Text style={styles.cardName}>{r.clienteNombre}</Text>

            {/* Correo */}
            <Text style={styles.cardMeta} numberOfLines={1}>
              {r.clienteCorreo}
            </Text>

            {/* Teléfono */}
            <Text style={styles.cardMeta} numberOfLines={1}>
              {r.telefono}
            </Text>

            {/* Marca y modelo */}
            <Text style={styles.cardMeta} numberOfLines={1}>
              {r.marca} {r.modelo}
            </Text>

            {/* Placa */}
            <Text style={styles.cardMeta} numberOfLines={1}>
              Placa: {r.placa}
            </Text>

            {/* Botones de acción */}
            <View style={{ marginTop: 16, gap: 8 }}>
              {/* Botón VISUALIZAR REPORTE */}
              <Pressable
                onPress={() => { setDetallesTarget(r); setDetallesModal(true); }}
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnPrimaryText, pressed && styles.btnPrimaryTextPressed]}>
                    VISUALIZAR REPORTE
                  </Text>
                )}
              </Pressable>

              {/* Botón REENVIAR FACTURA */}
              <Pressable
                onPress={() => { setSendTarget(r); setSendSuccess(false); setSendModal(true); }}
                style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.btnSecondaryText, pressed && styles.btnSecondaryTextPressed]}>
                    REENVIAR FACTURA
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ))}
        </View>
      </ScrollView>

      {/* MODAL CALENDARIO FECHA MÍNIMA */}
      <Modal visible={calendarMinimaVisible} transparent animationType="fade" onRequestClose={() => setCalendarMinimaVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCalendarMinimaVisible(false)}>
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
                const isSelected = fechaMinima?.toDateString() === day.toDateString();
                return (
                  <Pressable key={i} style={[styles.calendarCell, isSelected && styles.calendarCellSelected]} onPress={() => { setFechaMinima(day); setCalendarMinimaVisible(false); }}>
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>{day.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarMinimaVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaMinima(null); setCalendarMinimaVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CALENDARIO FECHA MÁXIMA */}
      <Modal visible={calendarMaximaVisible} transparent animationType="fade" onRequestClose={() => setCalendarMaximaVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setCalendarMaximaVisible(false)}>
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
                const isSelected = fechaMaxima?.toDateString() === day.toDateString();
                return (
                  <Pressable key={i} style={[styles.calendarCell, isSelected && styles.calendarCellSelected]} onPress={() => { setFechaMaxima(day); setCalendarMaximaVisible(false); }}>
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>{day.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarMaximaVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaMaxima(null); setCalendarMaximaVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODALES */}
      
      {/* Modal para visualizar el reporte completo */}
      <VisualizarReporte
        visible={detallesModal}
        registro={detallesTarget}
        onCerrar={() => setDetallesModal(false)}
      />

      {/* Modal de confirmación de reenvío */}
      <ConfirmarReenvioReporte
        visible={sendModal && !sendSuccess}
        nombreCliente={sendTarget?.clienteNombre || ''}
        onCancelar={() => {
          setSendModal(false);
          setSendSuccess(false);
          setSendError('');
        }}
        onConfirmar={reenviarReporte}
      />

      {/* Modal de éxito de reenvío */}
      <ReenvioReporte
        visible={sendModal && sendSuccess}
        nombreCliente={sendTarget?.clienteNombre || ''}
        correoCliente={sendTarget?.clienteCorreo || ''}
        onCerrar={() => {
          setSendModal(false);
          setSendSuccess(false);
        }}
      />
    </View>
  );
}
