// Financiero.tsx
// Pantalla principal del sistema financiero con gestión de pagos en cartillas

import { useEffect, useState } from 'react';
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import NavbarFinanciero from '@/components/navbarFinanciero/navbarFinanciero';
import stylesBase from '@/Styles/pantallaFinanciero/financiero';
import stylesWeb from '@/Styles/pantallaFinanciero/financiero.web';

const styles = Platform.OS === 'web' ? stylesWeb : stylesBase;
import { useAuth } from '@/context/AuthContext';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import {
  obtenerPagos,
  actualizarPago,
  obtenerEstadisticasFinancieras,
  PagoServicio,
} from '@/utils/datosSimulados';

// Importar modales
import RegistrarPago from './modalesPago/registrarPago';
import ConfirmarPago from './modalesPago/confirmarPago';
import PagoAprobado from './modalesPago/pagoAprobado';

export default function FinancieroScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  
  // Determinar breakpoints
  const isSmallScreen = width < 1024;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    ScreenCapture.preventScreenCaptureAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // En Financiero.tsx (pantalla principal), cerrar la app
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSignOut = () => {
    logout();
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // Estados para pagos
  const [pagos, setPagos] = useState<PagoServicio[]>([]);
  const [pagosFiltrados, setPagosFiltrados] = useState<PagoServicio[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    ingresosMes: 0,
    costoRepuestosMes: 0,
    utilidadNeta: 0,
    serviciosCompletados: 0,
  });

  // Estados de filtros
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState('Todos');

  // Estados de modales
  const [modalRegistrarVisible, setModalRegistrarVisible] = useState(false);
  const [modalConfirmarVisible, setModalConfirmarVisible] = useState(false);
  const [modalAprobadoVisible, setModalAprobadoVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoServicio | null>(null);
  const [datosPagoTemp, setDatosPagoTemp] = useState<{
    metodoPago: string;
    fechaPago: string;
    observacion: string;
    comprobanteUri?: string;
  } | null>(null);

  // Estados de dropdowns
  const [mecanicoDropdownOpen, setMecanicoDropdownOpen] = useState(false);

  // Estados de calendarios
  const [calendarDesdeVisible, setCalendarDesdeVisible] = useState(false);
  const [calendarHastaVisible, setCalendarHastaVisible] = useState(false);
  const [calendarDesdeMonth, setCalendarDesdeMonth] = useState(new Date());
  const [calendarHastaMonth, setCalendarHastaMonth] = useState(new Date());

  // Cargar pagos al iniciar
  useEffect(() => {
    cargarPagos();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros();
  }, [pagos, fechaDesde, fechaHasta, mecanicoSeleccionado, busquedaCliente]);

  const cargarPagos = () => {
    const todosPagos = obtenerPagos();
    setPagos(todosPagos);
    const stats = obtenerEstadisticasFinancieras();
    setEstadisticas(stats);
  };

  const aplicarFiltros = () => {
    let resultado = [...pagos];

    // Filtro: solo pagos pendientes en Financiero.tsx
    resultado = resultado.filter((p) => p.estado === 'PENDIENTE');

    // Filtro por búsqueda global (nombre, placa, mecánico, correo, teléfono)
    if (busquedaCliente.trim()) {
      const busqueda = busquedaCliente.toLowerCase();
      resultado = resultado.filter((p) => {
        const coincideNombre = p.clienteNombre.toLowerCase().includes(busqueda);
        const coincidePlaca = p.placa.toLowerCase().includes(busqueda);
        const coincideMecanico = p.mecanico.toLowerCase().includes(busqueda);
        const coincideCorreo = p.clienteCorreo.toLowerCase().includes(busqueda);
        const coincideTelefono = p.clienteTelefono.includes(busqueda);
        
        return coincideNombre || coincidePlaca || coincideMecanico || coincideCorreo || coincideTelefono;
      });
    }

    // Filtro por fechas
    if (fechaDesde) {
      resultado = resultado.filter((p) => {
        const fechaPago = new Date(p.fecha.split('/').reverse().join('-'));
        return fechaPago >= fechaDesde;
      });
    }
    if (fechaHasta) {
      resultado = resultado.filter((p) => {
        const fechaPago = new Date(p.fecha.split('/').reverse().join('-'));
        return fechaPago <= fechaHasta;
      });
    }

    // Filtro por mecánico
    if (mecanicoSeleccionado !== 'Todos') {
      resultado = resultado.filter((p) => p.mecanico === mecanicoSeleccionado);
    }

    setPagosFiltrados(resultado);
  };

  const obtenerMecanicosUnicos = () => {
    const mecanicos = pagos.map((p) => p.mecanico);
    return ['Todos', ...Array.from(new Set(mecanicos))];
  };

  const handleRegistrarPago = (pago: PagoServicio) => {
    setPagoSeleccionado(pago);
    setModalRegistrarVisible(true);
  };

  const handleConfirmarRegistro = (metodoPago: string, fechaPago: string, observacion: string, comprobanteUri?: string) => {
    setDatosPagoTemp({ metodoPago, fechaPago, observacion, comprobanteUri });
    setModalRegistrarVisible(false);
    setModalConfirmarVisible(true);
  };

  const handleConfirmarPagoFinal = () => {
    if (!pagoSeleccionado || !datosPagoTemp) return;

    actualizarPago(pagoSeleccionado.id, {
      estado: 'PAGADO',
      metodoPago: datosPagoTemp.metodoPago as 'EFECTIVO' | 'TRANSFERENCIA',
      fechaPago: datosPagoTemp.fechaPago,
      observacion: datosPagoTemp.observacion,
      comprobanteUri: datosPagoTemp.comprobanteUri,
    });

    setModalConfirmarVisible(false);
    setModalAprobadoVisible(true);
    cargarPagos();
  };

  const handleCerrarAprobado = () => {
    setModalAprobadoVisible(false);
    setPagoSeleccionado(null);
    setDatosPagoTemp(null);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
    return [...blanks, ...days];
  };

  const cerrarTodosLosDropdowns = () => {
    setMecanicoDropdownOpen(false);
  };

  return (
    <ResponsiveContainer>
      <View style={styles.page}>
        <NavbarFinanciero onSignOut={handleSignOut} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={cerrarTodosLosDropdowns}>
            {/* Título y descripción principal */}
            <Text style={styles.screenTitle}>GESTIÓN FINANCIERA</Text>
            <Text style={styles.screenSubtitle}>
              Administra pagos de servicios y visualiza análisis detallado de ingresos y costos
            </Text>
          </Pressable>

          {/* Botón de análisis avanzado */}
          <Pressable
            style={({ pressed }) => [
              styles.btnAnalisisAvanzado,
              pressed && styles.btnAnalisisAvanzadoPressed,
            ]}
            onPress={() => {
              console.log('Abrir análisis avanzado');
            }}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.btnAnalisisAvanzadoText,
                  pressed && styles.btnAnalisisAvanzadoTextPressed,
                ]}
              >
                ABRIR ANÁLISIS AVANZADO
              </Text>
            )}
          </Pressable>

          {/* Filtros de búsqueda */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Buscar Cliente</Text>
            <View style={styles.searchBox}>
              <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
              <TextInput
                placeholder="Busca al cliente"
                placeholderTextColor="#94A3B8"
                value={busquedaCliente}
                onChangeText={setBusquedaCliente}
                style={styles.searchInput}
              />
            </View>

            <Text style={styles.filterLabel}>Fecha Desde</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => {
                setCalendarDesdeMonth(fechaDesde || new Date());
                setCalendarDesdeVisible(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {fechaDesde ? formatDate(fechaDesde) : 'DD/MM/AAAA'}
              </Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>

            <Text style={styles.filterLabel}>Fecha Hasta</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => {
                setCalendarHastaMonth(fechaHasta || new Date());
                setCalendarHastaVisible(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {fechaHasta ? formatDate(fechaHasta) : 'DD/MM/AAAA'}
              </Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>

            <Text style={styles.filterLabel}>Mecánico Asignado</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                cerrarTodosLosDropdowns();
                setMecanicoDropdownOpen(!mecanicoDropdownOpen);
              }}
            >
              <Text style={styles.dropdownText}>{mecanicoSeleccionado}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </Pressable>
            {mecanicoDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {obtenerMecanicosUnicos().map((mec) => (
                  <Pressable
                    key={mec}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMecanicoSeleccionado(mec);
                      setMecanicoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{mec}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Tarjetas de resumen (estilo sistemaInventario) */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Ingresos del Mes</Text>
              <Text style={styles.summaryNumber}>${estadisticas.ingresosMes.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Costo Repuestos</Text>
              <Text style={styles.summaryNumber}>${estadisticas.costoRepuestosMes.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Servicios Pendientes</Text>
              <Text style={styles.summaryNumber}>{pagosFiltrados.length}</Text>
            </View>
          </View>

          {/* Resultados de filtros - Cartillas de pagos */}
          {pagosFiltrados.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay pagos pendientes
            </Text>
          ) : (
            <View style={[
              styles.pagosContainer,
              Platform.OS === 'web' && !isSmallScreen && { flexDirection: 'row', flexWrap: 'wrap' }
            ]}>
              {pagosFiltrados.map((pago) => (
                <View 
                  key={pago.id} 
                  style={[
                    styles.pagoCard,
                    Platform.OS === 'web' && !isSmallScreen && { 
                      flex: 1, 
                      minWidth: 300, 
                      maxWidth: 'calc(50% - 8px)' 
                    },
                    Platform.OS === 'web' && isSmallScreen && { 
                      width: '100%',
                      maxWidth: '100%'
                    }
                  ]}
                >
                  <View style={styles.pagoContent}>
                    {/* ID y Estado */}
                    <View style={styles.pagoHeader}>
                      <Text style={styles.pagoId}>{pago.id}</Text>
                      <Text
                        style={[
                          styles.pagoEstado,
                          pago.estado === 'PENDIENTE'
                            ? styles.pagoEstadoPendiente
                            : styles.pagoEstadoPagado,
                        ]}
                      >
                        {pago.estado}
                      </Text>
                    </View>

                    {/* Fecha */}
                    <Text style={styles.pagoMeta}>Fecha: {pago.fecha}</Text>

                    {/* Cliente */}
                    <Text style={styles.pagoNombre} numberOfLines={1}>
                      {pago.clienteNombre}
                    </Text>

                    {/* Teléfono */}
                    <Text style={styles.pagoMeta}>Tel: {pago.clienteTelefono}</Text>

                    {/* Correo */}
                    <Text style={styles.pagoMeta} numberOfLines={1}>
                      {pago.clienteCorreo}
                    </Text>

                    {/* Vehículo con placa */}
                    <Text style={styles.pagoMeta} numberOfLines={1}>
                      {pago.vehiculo} - Placa: {pago.placa}
                    </Text>

                    {/* Kilometraje */}
                    <Text style={styles.pagoMeta}>
                      Kilometraje: {pago.kilometraje} km
                    </Text>

                    {/* Servicio */}
                    <Text style={styles.pagoMeta} numberOfLines={1}>
                      Servicio: {pago.servicio}
                    </Text>

                    {/* Mecánico */}
                    <Text style={styles.pagoMeta}>Mecánico: {pago.mecanico}</Text>

                    {/* Separador */}
                    <View style={styles.separator} />

                    {/* Costos */}
                    <Text style={styles.sectionTitle}>DESGLOSE</Text>
                    <View style={styles.costoRow}>
                      <Text style={styles.costoLabel}>Mano de obra:</Text>
                      <Text style={styles.costoValue}>${pago.costoManoObra.toFixed(2)}</Text>
                    </View>
                    <View style={styles.costoRow}>
                      <Text style={styles.costoLabel}>Repuestos:</Text>
                      <Text style={styles.costoValue}>${pago.costoRepuestos.toFixed(2)}</Text>
                    </View>

                    {/* Total */}
                    <View style={[styles.costoRow, { marginTop: 8 }]}>
                      <Text style={styles.totalLabel}>TOTAL:</Text>
                      <Text style={styles.totalValue}>${pago.total.toFixed(2)}</Text>
                    </View>

                    {/* Método de pago si está pagado */}
                    {pago.estado === 'PAGADO' && pago.metodoPago && (
                      <>
                        <View style={styles.separator} />
                        <Text style={styles.metodoPagoLabel}>Método de pago:</Text>
                        <Text style={styles.metodoPagoValue}>{pago.metodoPago}</Text>
                        {pago.fechaPago && (
                          <Text style={styles.pagoMeta}>Pagado el: {pago.fechaPago}</Text>
                        )}
                      </>
                    )}

                    {/* Botón registrar pago (solo para pendientes) */}
                    {pago.estado === 'PENDIENTE' && (
                      <Pressable
                        onPress={() => handleRegistrarPago(pago)}
                        style={({ pressed }) => [
                          styles.btnRegistrarPago,
                          pressed && styles.btnRegistrarPagoPressed,
                        ]}
                      >
                        {({ pressed }) => (
                          <Text
                            style={[
                              styles.btnRegistrarPagoText,
                              pressed && styles.btnRegistrarPagoTextPressed,
                            ]}
                          >
                            REGISTRAR PAGO
                          </Text>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Modales */}
        <RegistrarPago
          visible={modalRegistrarVisible}
          pago={pagoSeleccionado}
          onClose={() => {
            setModalRegistrarVisible(false);
            setPagoSeleccionado(null);
          }}
          onConfirmar={handleConfirmarRegistro}
        />

        <ConfirmarPago
          visible={modalConfirmarVisible}
          clienteNombre={pagoSeleccionado?.clienteNombre || ''}
          metodoPago={datosPagoTemp?.metodoPago || ''}
          total={pagoSeleccionado?.total || 0}
          onClose={() => setModalConfirmarVisible(false)}
          onConfirmar={handleConfirmarPagoFinal}
        />

        <PagoAprobado visible={modalAprobadoVisible} onClose={handleCerrarAprobado} />

        {/* Calendarios */}
        {/* Calendario Desde */}
        <Modal
          visible={calendarDesdeVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCalendarDesdeVisible(false)}
        >
          <Pressable
            style={styles.calendarOverlay}
            onPress={() => setCalendarDesdeVisible(false)}
          >
            <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={() =>
                    setCalendarDesdeMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
                    )
                  }
                  style={styles.calendarNavBtn}
                >
                  <Text style={styles.calendarNavText}>‹</Text>
                </Pressable>
                <Text style={styles.calendarMonthLabel}>
                  {calendarDesdeMonth
                    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                    .toUpperCase()}
                </Text>
                <Pressable
                  onPress={() =>
                    setCalendarDesdeMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
                    )
                  }
                  style={styles.calendarNavBtn}
                >
                  <Text style={styles.calendarNavText}>›</Text>
                </Pressable>
              </View>
              <View style={styles.calendarWeekRow}>
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <Text key={i} style={styles.calendarWeekLabel}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {buildCalendarDays(calendarDesdeMonth).map((day, i) => {
                  if (!day) return <View key={i} style={styles.calendarCell} />;
                  const isSelected = fechaDesde?.toDateString() === day.toDateString();
                  return (
                    <Pressable
                      key={i}
                      style={[
                        styles.calendarCell,
                        isSelected && styles.calendarCellSelected,
                      ]}
                      onPress={() => {
                        setFechaDesde(day);
                        setCalendarDesdeVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.calendarCellText,
                          isSelected && styles.calendarCellSelectedText,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                onPress={() => setCalendarDesdeVisible(false)}
                style={({ pressed }) => [
                  styles.calendarCloseBtn,
                  pressed && styles.calendarCloseBtnPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.calendarCloseBtnText,
                      pressed && styles.calendarCloseBtnTextPressed,
                    ]}
                  >
                    ACEPTAR
                  </Text>
                )}
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Calendario Hasta */}
        <Modal
          visible={calendarHastaVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCalendarHastaVisible(false)}
        >
          <Pressable
            style={styles.calendarOverlay}
            onPress={() => setCalendarHastaVisible(false)}
          >
            <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={() =>
                    setCalendarHastaMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
                    )
                  }
                  style={styles.calendarNavBtn}
                >
                  <Text style={styles.calendarNavText}>‹</Text>
                </Pressable>
                <Text style={styles.calendarMonthLabel}>
                  {calendarHastaMonth
                    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                    .toUpperCase()}
                </Text>
                <Pressable
                  onPress={() =>
                    setCalendarHastaMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
                    )
                  }
                  style={styles.calendarNavBtn}
                >
                  <Text style={styles.calendarNavText}>›</Text>
                </Pressable>
              </View>
              <View style={styles.calendarWeekRow}>
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <Text key={i} style={styles.calendarWeekLabel}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {buildCalendarDays(calendarHastaMonth).map((day, i) => {
                  if (!day) return <View key={i} style={styles.calendarCell} />;
                  const isSelected = fechaHasta?.toDateString() === day.toDateString();
                  return (
                    <Pressable
                      key={i}
                      style={[
                        styles.calendarCell,
                        isSelected && styles.calendarCellSelected,
                      ]}
                      onPress={() => {
                        setFechaHasta(day);
                        setCalendarHastaVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.calendarCellText,
                          isSelected && styles.calendarCellSelectedText,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                onPress={() => setCalendarHastaVisible(false)}
                style={({ pressed }) => [
                  styles.calendarCloseBtn,
                  pressed && styles.calendarCloseBtnPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.calendarCloseBtnText,
                      pressed && styles.calendarCloseBtnTextPressed,
                    ]}
                  >
                    ACEPTAR
                  </Text>
                )}
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </ResponsiveContainer>
  );
}
