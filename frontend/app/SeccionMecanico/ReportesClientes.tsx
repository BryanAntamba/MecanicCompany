// ReportesClientes.tsx
// Pantalla principal del mecánico - Gestión de solicitudes con filtros avanzados

import { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import NavbarMecanico from '@/components/navbarMecanico/navbarMecanico';
import styles from '@/Styles/pantallaMecanico/ReportesClientes';
import { useAuth } from '@/context/AuthContext';
import { 
  obtenerSolicitudesSimuladas, 
  actualizarSolicitud,
  eliminarSolicitud,
  type SolicitudMantenimiento 
} from '@/utils/datosSimulados';

// Importar modales
import EditarSolicitud from './modalesReporte/editarSolicitud';
import RegistroMantenimiento from './modalesReporte/registroMantenimiento';
import ConfirmacionSolicitud from './modalesReporte/confirmacionSolicitud';
import EliminacionSolicitud from './modalesConfirmacion/eliminacionSolicitud';
import ConfirmacionReporte from './modalReporteMatenimiento/confirmacionReporte';
import EnvioExitoso from './modalReporteMatenimiento/envioExitoso';
import VisualizarSolicitud from './modalesReporte/visualizarSolicitud';
import RegistroEnProceso from './modalesReporte/registroEnProceso';

// Tipos
type EstadoSolicitud = 'Pendiente' | 'En_proceso' | 'Completado';

export default function ReportesClientesScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  // Bloquear capturas de pantalla
  useEffect(() => {
    const preventCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    preventCapture();
    // No llamamos allowScreenCaptureAsync() al desmontar para mantener el bloqueo activo
  }, []);

  // BackHandler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      logout();
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, [logout]);

  // Estado de datos
  const [solicitudes, setSolicitudes] = useState<SolicitudMantenimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [ordenAZ, setOrdenAZ] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | EstadoSolicitud>('TODOS');
  const [fechaMinima, setFechaMinima] = useState<Date | null>(null);
  const [fechaMaxima, setFechaMaxima] = useState<Date | null>(null);

  // Estados de dropdowns
  const [ordenDropdownOpen, setOrdenDropdownOpen] = useState(false);
  const [estadoDropdownOpen, setEstadoDropdownOpen] = useState(false);

  // Estados de modales de calendario
  const [calendarMinimaVisible, setCalendarMinimaVisible] = useState(false);
  const [calendarMaximaVisible, setCalendarMaximaVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudMantenimiento | null>(null);

  // Estados de modales
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalVisualizarVisible, setModalVisualizarVisible] = useState(false);
  const [modalMantenimientoVisible, setModalMantenimientoVisible] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [modalEliminacionExitosaVisible, setModalEliminacionExitosaVisible] = useState(false);
  const [modalConfirmacionReporteVisible, setModalConfirmacionReporteVisible] = useState(false);
  const [modalEnvioExitosoVisible, setModalEnvioExitosoVisible] = useState(false);
  const [modalRegistroEnProcesoVisible, setModalRegistroEnProcesoVisible] = useState(false);

  // Cargar solicitudes simuladas
  useEffect(() => {
    const cargarSolicitudes = () => {
      try {
        const solicitudesData = obtenerSolicitudesSimuladas();
        setSolicitudes(solicitudesData);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitudes();
  }, []);

  // Funciones auxiliares
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

  // Filtrar y ordenar solicitudes
  const solicitudesFiltradas = solicitudes
    .filter((s) => {
      // Búsqueda por nombre, placa o correo
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda =
        s.nombreCliente.toLowerCase().includes(textoBusqueda) ||
        s.placa.toLowerCase().includes(textoBusqueda) ||
        s.correoCliente.toLowerCase().includes(textoBusqueda);

      // Filtro de estado
      const coincideEstado = filtroEstado === 'TODOS' || s.estado === filtroEstado;

      // Filtro de fechas
      let coincideFecha = true;
      if (s.createdAt) {
        if (fechaMinima) {
          const fechaSolicitud = new Date(s.createdAt);
          const fechaMin = new Date(fechaMinima);
          fechaMin.setHours(0, 0, 0, 0);
          fechaSolicitud.setHours(0, 0, 0, 0);
          if (fechaSolicitud < fechaMin) coincideFecha = false;
        }
        if (fechaMaxima) {
          const fechaSolicitud = new Date(s.createdAt);
          const fechaMax = new Date(fechaMaxima);
          fechaMax.setHours(23, 59, 59, 999);
          fechaSolicitud.setHours(0, 0, 0, 0);
          if (fechaSolicitud > fechaMax) coincideFecha = false;
        }
      }

      return coincideBusqueda && coincideEstado && coincideFecha;
    })
    .sort((a, b) => {
      const nombreA = a.nombreCliente;
      const nombreB = b.nombreCliente;
      return ordenAZ === 'A-Z' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

  // Calcular totales
  const totalReportes = solicitudes.length;
  const totalPendientes = solicitudes.filter((s) => s.estado === 'Pendiente').length;
  const totalEnProceso = solicitudes.filter((s) => s.estado === 'En_proceso').length;
  const totalCompletados = solicitudes.filter((s) => s.estado === 'Completado').length;

  // Handlers
  const handleVisualizarSolicitud = (solicitud: SolicitudMantenimiento) => {
    setSolicitudSeleccionada(solicitud);
    setModalVisualizarVisible(true);
  };

  const handleEditarSolicitud = (solicitud: SolicitudMantenimiento) => {
    setSolicitudSeleccionada(solicitud);
    setModalEditarVisible(true);
  };

  const handleRegistroMantenimiento = (solicitud: SolicitudMantenimiento) => {
    setSolicitudSeleccionada(solicitud);
    setModalMantenimientoVisible(true);
  };

  const handleEliminar = (solicitud: SolicitudMantenimiento) => {
    setSolicitudSeleccionada(solicitud);
    setModalEliminarVisible(true);
  };

  const handleConfirmarEliminacion = () => {
    if (!solicitudSeleccionada) return;

    try {
      eliminarSolicitud(solicitudSeleccionada.id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudSeleccionada.id));
      setModalEliminarVisible(false);
      setModalEliminacionExitosaVisible(true);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la solicitud.');
    }
  };

  const handleSuccessEditar = (solicitudActualizada: any) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === solicitudActualizada.id ? { ...s, ...solicitudActualizada } : s))
    );
  };

  const handleSuccessMantenimiento = (solicitudActualizada: any) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === solicitudActualizada.id ? { ...s, ...solicitudActualizada } : s))
    );
  };

  const handleEnviarReporte = (solicitud: SolicitudMantenimiento) => {
    setSolicitudSeleccionada(solicitud);
    setModalConfirmacionReporteVisible(true);
  };

  const handleConfirmarEnvioReporte = () => {
    setModalConfirmacionReporteVisible(false);
    setModalEnvioExitosoVisible(true);
  };

  // Verificar si el reporte está completo (solo verificar el estado)
  const reporteCompleto = (solicitud: SolicitudMantenimiento) => {
    return solicitud.estado === 'Completado';
  };

  // Determinar el texto del botón de mantenimiento
  const getTextoBotonMantenimiento = (solicitud: SolicitudMantenimiento) => {
    // Si ya tiene algún campo de mantenimiento lleno, es edición
    if (solicitud.diagnostico || solicitud.mecanicoAsignado || solicitud.trabajoRealizado || 
        solicitud.repuestosUtilizados || solicitud.diagnosticoRealizado ||
        solicitud.costoManoObra || solicitud.costoRepuestos || solicitud.observaciones ||
        solicitud.fechaInicio || solicitud.fechaFinalizacion) {
      return 'EDITAR REGISTRO DE MANTENIMIENTO';
    }
    return 'REGISTRO MANTENIMIENTO';
  };

  // Función para cerrar sesión y limpiar historial
  const handleSignOut = async () => {
    await logout();
    // Navegar al login con parámetro que indica cierre de sesión
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // RENDER
  return (
    <View style={styles.page}>
      <NavbarMecanico onSignOut={handleSignOut} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* TÍTULO */}
        <Text style={styles.screenTitle}>REPORTES DE CLIENTES</Text>

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

          {/* Estado de Mantenimiento */}
          <Text style={styles.filterLabel}>Estado de Mantenimiento</Text>
          <Pressable style={styles.filterDropdown} onPress={() => setEstadoDropdownOpen((v) => !v)}>
            <Text style={styles.filterDropdownText}>
              {filtroEstado === 'TODOS' ? 'Todos' :
               filtroEstado === 'Pendiente' ? 'Pendiente' :
               filtroEstado === 'En_proceso' ? 'En Proceso' : 'Completado'}
            </Text>
            <Text style={styles.dropdownArrow}>{estadoDropdownOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {estadoDropdownOpen && (
            <View style={styles.dropdownList}>
              {(['TODOS', 'Pendiente', 'En_proceso', 'Completado'] as const).map((option) => {
                const displayText = option === 'TODOS' ? 'Todos' :
                                   option === 'En_proceso' ? 'En Proceso' : option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.dropdownItem, filtroEstado === option && styles.dropdownItemActive]}
                    onPress={() => {
                      setFiltroEstado(option);
                      setEstadoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>{filtroEstado === option ? '✓ ' : '    '}</Text>
                    <Text style={styles.dropdownItemText}>{displayText}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Rango de fechas */}
          <Text style={styles.filterLabel}>Rango de Fechas de Registro</Text>
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
            <Text style={styles.summaryNumber}>{totalPendientes}</Text>
            <Text style={styles.summaryLabel}>Pendientes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalEnProceso}</Text>
            <Text style={styles.summaryLabel}>En Proceso</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalCompletados}</Text>
            <Text style={styles.summaryLabel}>Completados</Text>
          </View>
        </View>

        {/* INDICADOR DE CARGA */}
        {cargando && (
          <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 24 }}>
            Cargando solicitudes...
          </Text>
        )}

        {/* MENSAJE VACÍO */}
        {!cargando && solicitudesFiltradas.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron solicitudes</Text>
        )}

        {/* LISTA DE SOLICITUDES */}
        <View style={styles.solicitudesContainer}>
          {solicitudesFiltradas.map((solicitud) => (
            <View key={solicitud.id} style={styles.card}>
              {/* Contenido de la cartilla */}
              <View style={styles.cardContent}>
                {/* Nombre completo */}
                <Text style={styles.cardName} numberOfLines={2}>
                  {solicitud.nombreCliente}
                </Text>

                {/* Marca del vehículo */}
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {solicitud.marca} {solicitud.modelo}
                </Text>

                {/* Placa */}
                <Text style={styles.cardMeta} numberOfLines={1}>
                  Placa: {solicitud.placa}
                </Text>

                {/* Teléfono */}
                <Text style={styles.cardMeta} numberOfLines={1}>
                  📞 {solicitud.telefono}
                </Text>

                {/* Badge de Estado */}
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      solicitud.estado === 'Pendiente' && styles.badgePendiente,
                      solicitud.estado === 'En_proceso' && styles.badgeProceso,
                      solicitud.estado === 'Completado' && styles.badgeCompletado,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {solicitud.estado === 'En_proceso' ? 'EN PROCESO' : solicitud.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Botones */}
                <Pressable
                  onPress={() => handleVisualizarSolicitud(solicitud)}
                  style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.btnPrimaryText, pressed && styles.btnPrimaryTextPressed]}>
                      VISUALIZAR SOLICITUD
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => handleEditarSolicitud(solicitud)}
                  style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.btnSecondaryText, pressed && styles.btnSecondaryTextPressed]}>
                      EDITAR SOLICITUD
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => handleRegistroMantenimiento(solicitud)}
                  style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.btnSecondaryText, pressed && styles.btnSecondaryTextPressed]}>
                      {getTextoBotonMantenimiento(solicitud)}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => handleEliminar(solicitud)}
                  style={({ pressed }) => [styles.btnDelete, pressed && styles.btnDeletePressed]}
                >
                  {({ pressed }) => (
                    <Text style={[styles.btnDeleteText, pressed && styles.btnDeleteTextPressed]}>
                      ELIMINAR
                    </Text>
                  )}
                </Pressable>

                {/* Botón ENVIAR FACTURA */}
                <Pressable
                  onPress={() => handleEnviarReporte(solicitud)}
                  disabled={!reporteCompleto(solicitud)}
                  style={({ pressed }) => [
                    styles.btnEnviarReporte,
                    !reporteCompleto(solicitud) && styles.btnEnviarReporteLocked,
                    pressed && reporteCompleto(solicitud) && styles.btnEnviarReportePressed,
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btnEnviarReporteText,
                        !reporteCompleto(solicitud) && styles.btnEnviarReporteTextLocked,
                        pressed && reporteCompleto(solicitud) && styles.btnEnviarReporteTextPressed,
                      ]}
                    >
                      ENVIAR FACTURA
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

      {/* MODALES DE GESTIÓN */}
      <VisualizarSolicitud
        visible={modalVisualizarVisible}
        solicitud={solicitudSeleccionada}
        onClose={() => setModalVisualizarVisible(false)}
      />

      <EditarSolicitud
        visible={modalEditarVisible}
        solicitud={solicitudSeleccionada}
        onClose={() => setModalEditarVisible(false)}
        onSuccess={handleSuccessEditar}
        token=""
      />

      <RegistroMantenimiento
        visible={modalMantenimientoVisible}
        solicitud={solicitudSeleccionada}
        onClose={() => setModalMantenimientoVisible(false)}
        onSuccess={handleSuccessMantenimiento}
        onShowSuccessModal={() => setModalRegistroEnProcesoVisible(true)}
      />

      <ConfirmacionSolicitud
        visible={modalEliminarVisible}
        solicitud={solicitudSeleccionada}
        onCancelar={() => setModalEliminarVisible(false)}
        onConfirmar={handleConfirmarEliminacion}
      />

      <EliminacionSolicitud
        visible={modalEliminacionExitosaVisible}
        nombreCliente={solicitudSeleccionada?.nombreCliente || ''}
        onCerrar={() => setModalEliminacionExitosaVisible(false)}
      />

      <ConfirmacionReporte
        visible={modalConfirmacionReporteVisible}
        solicitud={solicitudSeleccionada}
        onCancelar={() => setModalConfirmacionReporteVisible(false)}
        onConfirmar={handleConfirmarEnvioReporte}
      />

      <EnvioExitoso
        visible={modalEnvioExitosoVisible}
        nombreCliente={solicitudSeleccionada?.nombreCliente || ''}
        correoCliente={solicitudSeleccionada?.correoCliente || ''}
        onCerrar={() => setModalEnvioExitosoVisible(false)}
      />

      <RegistroEnProceso
        visible={modalRegistroEnProcesoVisible}
        onCerrar={() => setModalRegistroEnProcesoVisible(false)}
      />
    </View>
  );
}
