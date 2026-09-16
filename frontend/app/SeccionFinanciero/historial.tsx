// historial.tsx
// Pantalla de historial de pagos registrados con filtros y estadísticas

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
import stylesBase from '@/Styles/pantallaFinanciero/historial';
import stylesWeb from '@/Styles/pantallaFinanciero/historial.web';

const styles = Platform.OS === 'web' ? stylesWeb : stylesBase;
import { useAuth } from '@/context/AuthContext';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import {
  obtenerPagos,
  PagoServicio,
} from '@/utils/datosSimulados';

// Importar modales
import VisualizarPago from './modalesHistorial/visualizarPago';
import ConfirmarReenvio from './modalesHistorial/confirmacionReenvio';
import ReenvioExitoso from './modalesHistorial/reenvioExitoso';

export default function HistorialFinancieroScreen() {
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
      // En historial.tsx, regresar a financiero.tsx
      router.push('/SeccionFinanciero/financiero' as any);
      return true;
    });
    return () => backHandler.remove();
  }, [router]);

  const handleSignOut = () => {
    logout();
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // Estados para pagos
  const [pagos, setPagos] = useState<PagoServicio[]>([]);
  const [pagosFiltrados, setPagosFiltrados] = useState<PagoServicio[]>([]);

  // Estados de filtros
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState('Todos');
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('Todos');
  const [servicioSeleccionado, setServicioSeleccionado] = useState('Todos');
  const [servicioOtro, setServicioOtro] = useState('');

  // Estados de modales
  const [modalVisualizarVisible, setModalVisualizarVisible] = useState(false);
  const [modalConfirmarReenvioVisible, setModalConfirmarReenvioVisible] = useState(false);
  const [modalReenvioExitosoVisible, setModalReenvioExitosoVisible] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoServicio | null>(null);

  // Estados de dropdowns
  const [mecanicoDropdownOpen, setMecanicoDropdownOpen] = useState(false);
  const [metodoPagoDropdownOpen, setMetodoPagoDropdownOpen] = useState(false);
  const [servicioDropdownOpen, setServicioDropdownOpen] = useState(false);

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
  }, [pagos, fechaDesde, fechaHasta, busquedaCliente, mecanicoSeleccionado, metodoPagoSeleccionado, servicioSeleccionado, servicioOtro]);

  const cargarPagos = () => {
    const todosPagos = obtenerPagos();
    setPagos(todosPagos);
  };

  const aplicarFiltros = () => {
    let resultado = [...pagos];

    // Filtro: solo pagos PAGADOS en historial
    resultado = resultado.filter((p) => p.estado === 'PAGADO');

    // Filtro por fechas
    if (fechaDesde) {
      const inicioDelDia = new Date(fechaDesde);
      inicioDelDia.setHours(0, 0, 0, 0);
      resultado = resultado.filter((p) => {
        const [dia, mes, anio] = p.fecha.split('/').map(Number);
        const fechaPago = new Date(anio, mes - 1, dia);
        fechaPago.setHours(0, 0, 0, 0);
        return fechaPago >= inicioDelDia;
      });
    }
    if (fechaHasta) {
      const finDelDia = new Date(fechaHasta);
      finDelDia.setHours(23, 59, 59, 999);
      resultado = resultado.filter((p) => {
        const [dia, mes, anio] = p.fecha.split('/').map(Number);
        const fechaPago = new Date(anio, mes - 1, dia);
        fechaPago.setHours(0, 0, 0, 0);
        return fechaPago <= finDelDia;
      });
    }

    // Filtro por búsqueda de cliente
    if (busquedaCliente.trim()) {
      resultado = resultado.filter((p) =>
        p.clienteNombre.toLowerCase().includes(busquedaCliente.toLowerCase())
      );
    }

    // Filtro por mecánico
    if (mecanicoSeleccionado !== 'Todos') {
      resultado = resultado.filter((p) => p.mecanico === mecanicoSeleccionado);
    }

    // Filtro por método de pago
    if (metodoPagoSeleccionado !== 'Todos') {
      resultado = resultado.filter((p) => p.metodoPago === metodoPagoSeleccionado);
    }

    // Filtro por servicio
    if (servicioSeleccionado !== 'Todos') {
      if (servicioSeleccionado === 'Otro') {
        // Si seleccionó "Otro", buscar por el valor ingresado en servicioOtro
        if (servicioOtro.trim()) {
          resultado = resultado.filter((p) => 
            p.servicio.toLowerCase().includes(servicioOtro.toLowerCase())
          );
        }
      } else {
        // Si seleccionó un servicio predefinido
        resultado = resultado.filter((p) => p.servicio === servicioSeleccionado);
      }
    }

    setPagosFiltrados(resultado);
  };

  const obtenerMecanicosUnicos = () => {
    const pagosPagados = pagos.filter(p => p.estado === 'PAGADO');
    const mecanicos = pagosPagados.map((p) => p.mecanico);
    return ['Todos', ...Array.from(new Set(mecanicos))];
  };

  const obtenerServiciosUnicos = () => {
    return ['Todos', 'Frenos', 'Suspension', 'Motor', 'Electricidad', 'Aire acondicionado', 'Revision general', 'Otro'];
  };

  const handleVerPago = (pago: PagoServicio) => {
    setPagoSeleccionado(pago);
    setModalVisualizarVisible(true);
  };

  const handleReenviarComprobante = (pago: PagoServicio) => {
    setPagoSeleccionado(pago);
    setModalConfirmarReenvioVisible(true);
  };

  const handleConfirmarReenvio = () => {
    setModalConfirmarReenvioVisible(false);
    setModalReenvioExitosoVisible(true);
  };

  const handleCerrarReenvioExitoso = () => {
    setModalReenvioExitosoVisible(false);
    setModalVisualizarVisible(false);
    setPagoSeleccionado(null);
  };

  // Calcular estadísticas
  const pagosPagados = pagos.filter(p => p.estado === 'PAGADO');
  const pagosRegistrados = pagosPagados.length;
  const totalCancelado = pagosPagados.reduce((sum, p) => sum + p.total, 0);
  const serviciosCancelados = pagosPagados.length;

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
    setMetodoPagoDropdownOpen(false);
    setServicioDropdownOpen(false);
  };

  return (
    <ResponsiveContainer>
      <View style={styles.page}>
        <NavbarFinanciero onSignOut={handleSignOut} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={cerrarTodosLosDropdowns}>
            <Text style={styles.screenTitle}>HISTORIAL DE PAGOS</Text>
            <Text style={styles.screenSubtitle}>
              Consulta el historial completo de pagos registrados en el sistema
            </Text>
          </Pressable>

          {/* Filtros de búsqueda */}
          <View style={styles.filterContainer}>
              {/* Cliente */}
              <Text style={styles.filterLabel}>Cliente</Text>
              <View style={styles.searchBox}>
                <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
                <TextInput
                  placeholder="Buscar cliente..."
                  placeholderTextColor="#64748B"
                  value={busquedaCliente}
                  onChangeText={setBusquedaCliente}
                  style={styles.searchInput}
                />
              </View>

              {/* Fila de filtros: Mecánico, Método de Pago y Servicio juntos */}
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterRowContainer
              ]}>
                {/* Mecánico */}
                <View style={[
                  Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
                ]}>
                  <Text style={styles.filterLabel}>Mecánico</Text>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => {
                      cerrarTodosLosDropdowns();
                      setMecanicoDropdownOpen(!mecanicoDropdownOpen);
                    }}
                  >
                    <Text style={styles.dropdownText}>{mecanicoSeleccionado}</Text>
                    <FontAwesome name="chevron-down" size={12} color="#94A3B8" />
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

                {/* Método de pago */}
                <View style={[
                  Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
                ]}>
                  <Text style={styles.filterLabel}>Método de pago</Text>
                  <Pressable
                    style={styles.dropdown}
                    onPress={() => {
                      cerrarTodosLosDropdowns();
                      setMetodoPagoDropdownOpen(!metodoPagoDropdownOpen);
                    }}
                  >
                    <Text style={styles.dropdownText}>{metodoPagoSeleccionado}</Text>
                    <FontAwesome name="chevron-down" size={12} color="#94A3B8" />
                  </Pressable>
                  {metodoPagoDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                      {['Todos', 'EFECTIVO', 'TRANSFERENCIA'].map((metodo) => (
                        <Pressable
                          key={metodo}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setMetodoPagoSeleccionado(metodo);
                            setMetodoPagoDropdownOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{metodo}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Servicio */}
                <View style={[
                  Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
                ]}>
                  <Text style={styles.filterLabel}>Servicio</Text>
                  <Pressable
                    style={styles.filterDropdown}
                    onPress={() => {
                      cerrarTodosLosDropdowns();
                      setServicioDropdownOpen(!servicioDropdownOpen);
                    }}
                  >
                    <Text style={styles.filterDropdownText}>{servicioSeleccionado}</Text>
                    <Text style={styles.dropdownArrow}>{servicioDropdownOpen ? '▲' : '▼'}</Text>
                  </Pressable>
                  {servicioDropdownOpen && (
                    <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                      {obtenerServiciosUnicos().map((servicio) => (
                        <Pressable
                          key={servicio}
                          style={[styles.dropdownItem, servicioSeleccionado === servicio && styles.dropdownItemActive]}
                          onPress={() => {
                            setServicioSeleccionado(servicio);
                            setServicioDropdownOpen(false);
                            if (servicio !== 'Otro') {
                              setServicioOtro(''); // Limpiar campo "Otro" si selecciona otra opción
                            }
                          }}
                        >
                          <Text style={styles.dropdownItemCheck}>{servicioSeleccionado === servicio ? '✓ ' : '    '}</Text>
                          <Text style={styles.dropdownItemText}>{servicio}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* Campo "Otro" - solo visible cuando se selecciona "Otro" */}
              {servicioSeleccionado === 'Otro' && (
                <>
                  <Text style={styles.filterLabel}>Especificar servicio</Text>
                  <TextInput
                    placeholder="Ingrese el tipo de servicio..."
                    placeholderTextColor="#64748B"
                    value={servicioOtro}
                    onChangeText={(text) => {
                      // Solo permitir letras y espacios
                      const soloLetras = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                      setServicioOtro(soloLetras);
                    }}
                    style={styles.textInput}
                  />
                </>
              )}

              {/* Fechas */}
              <View style={styles.fechasContainer}>
                <View style={styles.filtroItem}>
                  <Text style={styles.filterLabel}>Fecha desde</Text>
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
                </View>

                <View style={styles.filtroItem}>
                  <Text style={styles.filterLabel}>Fecha hasta</Text>
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
                </View>
              </View>
            </View>

            {/* Tarjetas de resumen (estilo sistemaInventario) */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pagos Registrados</Text>
                <Text style={styles.summaryNumber}>{pagosRegistrados}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Cancelado</Text>
                <Text style={styles.summaryNumber}>${totalCancelado.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Servicios Cancelados</Text>
                <Text style={styles.summaryNumber}>{serviciosCancelados}</Text>
              </View>
            </View>

          {/* Resultados de filtros - Cartillas de pagos */}
          {pagosFiltrados.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay pagos registrados en el historial
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
                      <Text style={[styles.pagoEstado, styles.pagoEstadoPagado]}>PAGADO</Text>
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

                    {/* Método de pago */}
                    <View style={styles.separator} />
                    <Text style={styles.metodoPagoLabel}>Método de pago:</Text>
                    <Text style={styles.metodoPagoValue}>{pago.metodoPago}</Text>
                    {pago.fechaPago && (
                      <Text style={styles.pagoMeta}>Pagado el: {pago.fechaPago}</Text>
                    )}

                    <View style={styles.accionesContainer}>
                      {/* Botón reenviar comprobante */}
                      <Pressable
                      onPress={() => handleReenviarComprobante(pago)}
                      style={({ pressed }) => [
                        styles.btnReenviar,
                        pressed && styles.btnReenviarPressed,
                      ]}
                    >
                      {({ pressed }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <FontAwesome name="send" size={16} color={pressed ? '#F1F5F9' : '#FFFFFF'} />
                          <Text style={[styles.btnReenviarText, pressed && styles.btnReenviarTextPressed]}>
                            REENVIAR COMPROBANTE
                          </Text>
                        </View>
                      )}
                      </Pressable>

                      {/* Botón Ver */}
                      <Pressable
                      onPress={() => handleVerPago(pago)}
                      style={({ pressed }) => [
                        styles.btnVer,
                        pressed && styles.btnVerPressed,
                      ]}
                    >
                      {({ pressed }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <FontAwesome name="eye" size={16} color={pressed ? '#FFFFFF' : '#000000'} />
                          <Text
                            style={[
                              styles.btnVerText,
                              pressed && styles.btnVerTextPressed,
                            ]}
                          >
                            VER DETALLES
                          </Text>
                        </View>
                      )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Modales */}
        <VisualizarPago
          visible={modalVisualizarVisible}
          pago={pagoSeleccionado}
          onClose={() => {
            setModalVisualizarVisible(false);
            setPagoSeleccionado(null);
          }}
        />

        <ConfirmarReenvio
          visible={modalConfirmarReenvioVisible}
          clienteNombre={pagoSeleccionado?.clienteNombre || ''}
          onClose={() => setModalConfirmarReenvioVisible(false)}
          onConfirmar={handleConfirmarReenvio}
        />

        <ReenvioExitoso
          visible={modalReenvioExitosoVisible}
          onClose={handleCerrarReenvioExitoso}
        />

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
