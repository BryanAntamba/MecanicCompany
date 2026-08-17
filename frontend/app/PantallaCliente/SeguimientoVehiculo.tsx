// SeguimientoVehiculo.tsx
// Pantalla de seguimiento de vehículos para clientes
// Permite ver y filtrar todas las solicitudes de mantenimiento

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useCliente } from '@/context/ClienteContext';
import NavbarCliente from '@/components/navbarCliente/navbarCliente';
import FooterCliente from '@/components/footerCliente/footerCliente';
import DetallesSolicitud from './ModalSeguimientoVehicular/detallesSolicitud';
import FinalizacionSolicitud from './ModalSeguimientoVehicular/finalizacionSolicitud';
import styles from '@/Styles/pantallaCliente/seguimientoVehiculo';

// Tipo de solicitud
interface Solicitud {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  servicio: string;
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO';
  mecanico?: string;
  // Datos completos del formulario
  año: string;
  kilometraje: string;
  descripcion: string;
  fechaCita: string;
  horaCita: string;
  ubicacion: string;
}

// Datos de ejemplo - En producción vendrían del backend
const solicitudesEjemplo: Solicitud[] = [
  {
    id: '1',
    marca: 'Toyota',
    modelo: 'Corolla',
    placa: 'ABC1234',
    servicio: 'Cambio de aceite',
    fechaSolicitud: '2026-08-01',
    estado: 'COMPLETADO',
    mecanico: 'Juan Pérez',
    año: '2020',
    kilometraje: '50000',
    descripcion: 'El motor hace ruido al arrancar',
    fechaCita: '2026-08-05',
    horaCita: '10:00',
    ubicacion: 'Centro Histórico, Quito',
  },
  {
    id: '2',
    marca: 'Chevrolet',
    modelo: 'Sail',
    placa: 'DEF5678',
    servicio: 'Frenos',
    fechaSolicitud: '2026-08-05',
    estado: 'EN PROCESO',
    mecanico: 'Carlos López',
    año: '2019',
    kilometraje: '75000',
    descripcion: 'Los frenos chirrían al frenar',
    fechaCita: '2026-08-09',
    horaCita: '14:00',
    ubicacion: 'La Carolina, Quito',
  },
  {
    id: '3',
    marca: 'Mazda',
    modelo: 'CX-5',
    placa: 'GHI9012',
    servicio: 'Revisión general',
    fechaSolicitud: '2026-08-08',
    estado: 'PENDIENTE',
    año: '2021',
    kilometraje: '30000',
    descripcion: 'Mantenimiento preventivo programado',
    fechaCita: '2026-08-12',
    horaCita: '09:00',
    ubicacion: 'Cumbayá, Quito',
  },
];

export default function SeguimientoVehiculoScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { estaLogueado } = useCliente();
  
  // Protección: redirigir si no hay sesión AL MONTAR el componente
  // (no reaccionar a cambios posteriores para evitar conflictos con logout)
  const sesionInicialRef = useRef(estaLogueado);
  
  useEffect(() => {
    if (!sesionInicialRef.current) {
      // Si no había sesión al montar, redirigir al index
      router.replace('/PantallaCliente' as any);
    }
  }, [router]);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [ordenAZ, setOrdenAZ] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO'>('TODOS');
  const [fechaMinima, setFechaMinima] = useState<Date | null>(null);
  const [fechaMaxima, setFechaMaxima] = useState<Date | null>(null);

  // Estados de dropdowns
  const [ordenDropdownOpen, setOrdenDropdownOpen] = useState(false);
  const [estadoDropdownOpen, setEstadoDropdownOpen] = useState(false);

  // Estados de modales
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [modalFinalizacionVisible, setModalFinalizacionVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

  // Estados para modales de calendario
  const [calendarMinimaVisible, setCalendarMinimaVisible] = useState(false);
  const [calendarMaximaVisible, setCalendarMaximaVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Genera la cuadrícula de días del mes
  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  // Formatea la fecha para mostrar
  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar';

  // Filtrar y ordenar solicitudes
  const solicitudesFiltradas = solicitudesEjemplo
    .filter((sol) => {
      // Filtro de búsqueda (marca, modelo, placa)
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda =
        sol.marca.toLowerCase().includes(textoBusqueda) ||
        sol.modelo.toLowerCase().includes(textoBusqueda) ||
        sol.placa.toLowerCase().includes(textoBusqueda);

      // Filtro de estado
      const coincideEstado = filtroEstado === 'TODOS' || sol.estado === filtroEstado;

      // Filtro de fechas
      let coincideFecha = true;
      if (fechaMinima) {
        const fechaSol = new Date(sol.fechaSolicitud);
        const fechaMin = new Date(fechaMinima);
        fechaMin.setHours(0, 0, 0, 0);
        fechaSol.setHours(0, 0, 0, 0);
        if (fechaSol < fechaMin) coincideFecha = false;
      }
      if (fechaMaxima) {
        const fechaSol = new Date(sol.fechaSolicitud);
        const fechaMax = new Date(fechaMaxima);
        fechaMax.setHours(23, 59, 59, 999);
        fechaSol.setHours(0, 0, 0, 0);
        if (fechaSol > fechaMax) coincideFecha = false;
      }

      return coincideBusqueda && coincideEstado && coincideFecha;
    })
    .sort((a, b) => {
      // Ordenar alfabéticamente por marca
      if (ordenAZ === 'A-Z') {
        return a.marca.localeCompare(b.marca);
      } else {
        return b.marca.localeCompare(a.marca);
      }
    });

  // Calcular totales por estado
  const totalSolicitudes = solicitudesFiltradas.length;
  const totalPendientes = solicitudesFiltradas.filter((s) => s.estado === 'PENDIENTE').length;
  const totalEnProceso = solicitudesFiltradas.filter((s) => s.estado === 'EN PROCESO').length;
  const totalCompletados = solicitudesFiltradas.filter((s) => s.estado === 'COMPLETADO').length;

  // Navega al index pasando el parámetro scrollTo='cards'
  const handleScrollToAbout = () => {
    router.push({ pathname: '/PantallaCliente' as any, params: { scrollTo: 'cards' } });
  };

  // Navega al inicio del index
  const handleScrollToTop = () => {
    router.push('/PantallaCliente' as any);
  };

  // Abre modal según el estado
  const handleVerDetalles = (solicitud: Solicitud) => {
    setSolicitudSeleccionada(solicitud);
    if (solicitud.estado === 'COMPLETADO') {
      setModalFinalizacionVisible(true);
    } else {
      setModalDetallesVisible(true);
    }
  };

  // Manejo del botón de retroceso del teléfono
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.push('/PantallaCliente' as any);
        return true;
      });
      return () => backHandler.remove();
    }, [router]),
  );

  return (
    <View style={styles.page}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Navbar sticky del cliente */}
        <NavbarCliente onScrollToAbout={handleScrollToAbout} onScrollToTop={handleScrollToTop} />

        {/* TÍTULO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SEGUIMIENTO DEL VEHÍCULO</Text>
          <Text style={styles.sectionSubtitle}>
            Consulta el estado de todas tus solicitudes de mantenimiento vehicular
          </Text>

          {/* FILTROS */}
          <View style={styles.filterContainer}>
            {/* Campo de búsqueda */}
            <Text style={styles.filterLabel}>Buscar Vehículo</Text>
            <View style={styles.searchBox}>
              <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar por marca, modelo o placa"
                placeholderTextColor="#94A3B8"
                value={busqueda}
                onChangeText={setBusqueda}
                style={styles.searchInput}
              />
            </View>

            {/* Selector de orden A-Z / Z-A */}
            <Text style={styles.filterLabel}>Orden</Text>
            <Pressable
              style={styles.filterDropdown}
              onPress={() => setOrdenDropdownOpen((v) => !v)}
            >
              <Text style={styles.filterDropdownText}>{ordenAZ}</Text>
              <Text style={styles.dropdownArrow}>{ordenDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {ordenDropdownOpen && (
              <View style={styles.dropdownList}>
                {(['A-Z', 'Z-A'] as const).map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.dropdownItem,
                      ordenAZ === option && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setOrdenAZ(option);
                      setOrdenDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {ordenAZ === option ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Selector de estado */}
            <Text style={styles.filterLabel}>Estado</Text>
            <Pressable
              style={styles.filterDropdown}
              onPress={() => setEstadoDropdownOpen((v) => !v)}
            >
              <Text style={styles.filterDropdownText}>
                {filtroEstado === 'TODOS' ? 'Todos' : 
                 filtroEstado === 'PENDIENTE' ? 'Pendiente' :
                 filtroEstado === 'EN PROCESO' ? 'En proceso' : 'Completado'}
              </Text>
              <Text style={styles.dropdownArrow}>{estadoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {estadoDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {(['TODOS', 'PENDIENTE', 'EN PROCESO', 'COMPLETADO'] as const).map((option) => {
                  const displayText = option === 'TODOS' ? 'Todos' : 
                                     option === 'PENDIENTE' ? 'Pendiente' :
                                     option === 'EN PROCESO' ? 'En proceso' : 'Completado';
                  return (
                    <Pressable
                      key={option}
                      style={[
                        styles.dropdownItem,
                        filtroEstado === option && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setFiltroEstado(option);
                        setEstadoDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>
                        {filtroEstado === option ? '✓ ' : '    '}
                      </Text>
                      <Text style={styles.dropdownItemText}>{displayText}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* Filtro de rango de fechas */}
            <Text style={styles.filterLabel}>Rango de Fechas</Text>
            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => {
                    setCalendarMonth(fechaMinima || new Date());
                    setCalendarMinimaVisible(true);
                  }}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDate(fechaMinima)}
                  </Text>
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
                  <Text style={styles.dateButtonText}>
                    {formatDate(fechaMaxima)}
                  </Text>
                  <FontAwesome name="calendar" size={14} color="#64748B" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* RESUMEN DE RESULTADOS */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: '#FFFFFF' }]}>{totalSolicitudes}</Text>
              <Text style={styles.summaryLabel}>Solicitudes</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: '#FFFFFF' }]}>{totalPendientes}</Text>
              <Text style={styles.summaryLabel}>Pendientes</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: '#FFFFFF' }]}>{totalEnProceso}</Text>
              <Text style={styles.summaryLabel}>En Proceso</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryNumber, { color: '#FFFFFF' }]}>{totalCompletados}</Text>
              <Text style={styles.summaryLabel}>Completados</Text>
            </View>
          </View>

          {/* LISTA DE SOLICITUDES */}
          <View style={styles.solicitudesContainer}>
            {solicitudesFiltradas.length === 0 ? (
              <Text style={styles.emptyText}>No se encontraron solicitudes</Text>
            ) : (
              solicitudesFiltradas.map((solicitud) => (
                <View key={solicitud.id} style={styles.solicitudCard}>
                  <Text style={styles.solicitudTitulo}>{solicitud.marca}</Text>
                  <Text style={styles.solicitudSubtitulo}>{solicitud.modelo}</Text>

                  <View style={styles.solicitudDetalle}>
                    <Text style={styles.detalleLabel}>Placa:</Text>
                    <Text style={styles.detalleValor}>{solicitud.placa}</Text>
                  </View>

                  <View style={styles.solicitudDetalle}>
                    <Text style={styles.detalleLabel}>Servicio:</Text>
                    <Text style={styles.detalleValor}>{solicitud.servicio}</Text>
                  </View>

                  <View style={styles.solicitudDetalle}>
                    <Text style={styles.detalleLabel}>Solicitado:</Text>
                    <Text style={styles.detalleValor}>
                      {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES')}
                    </Text>
                  </View>

                  {solicitud.estado === 'EN PROCESO' && solicitud.mecanico && (
                    <View style={styles.solicitudDetalle}>
                      <Text style={styles.detalleLabel}>Mecánico:</Text>
                      <Text style={styles.detalleValor}>{solicitud.mecanico}</Text>
                    </View>
                  )}

                  {/* Badge de estado */}
                  <View
                    style={[
                      styles.estadoBadge,
                      solicitud.estado === 'PENDIENTE' && styles.estadoPendiente,
                      solicitud.estado === 'EN PROCESO' && styles.estadoEnProceso,
                      solicitud.estado === 'COMPLETADO' && styles.estadoCompletado,
                    ]}
                  >
                    <Text style={styles.estadoTexto}>{solicitud.estado}</Text>
                  </View>

                  {/* Botón Ver Detalles */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.verDetallesButton,
                      pressed && styles.verDetallesButtonPressed,
                    ]}
                    onPress={() => handleVerDetalles(solicitud)}
                  >
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.verDetallesButtonText,
                          pressed && styles.verDetallesButtonTextPressed,
                        ]}
                      >
                        VER DETALLES
                      </Text>
                    )}
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>

        {/* FOOTER */}
        <FooterCliente onScrollToTop={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      </ScrollView>

      {/* MODALES */}
      {solicitudSeleccionada && (
        <>
          <DetallesSolicitud
            visible={modalDetallesVisible}
            solicitud={solicitudSeleccionada}
            onCerrar={() => setModalDetallesVisible(false)}
          />
          <FinalizacionSolicitud
            visible={modalFinalizacionVisible}
            onCerrar={() => setModalFinalizacionVisible(false)}
          />
        </>
      )}

      {/* MODAL CALENDARIO FECHA MÍNIMA */}
      <Modal
        visible={calendarMinimaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarMinimaVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCalendarMinimaVisible(false)}>
          <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
            {/* Cabecera del calendario */}
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable
                onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>›</Text>
              </Pressable>
            </View>

            {/* Días de la semana */}
            <View style={styles.calendarWeekRow}>
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
                <Text key={d} style={styles.calendarWeekLabel}>{d}</Text>
              ))}
            </View>

            {/* Cuadrícula de días */}
            <View style={styles.calendarGrid}>
              {buildCalendarDays(calendarMonth).map((day, i) => {
                if (!day) return <View key={`b-${i}`} style={styles.calendarCell} />;
                const isSelected = fechaMinima?.toDateString() === day.toDateString();
                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.calendarCell,
                      isSelected && styles.calendarCellSelected,
                    ]}
                    onPress={() => {
                      setFechaMinima(day);
                      setCalendarMinimaVisible(false);
                    }}
                  >
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.calendarCloseBtn,
                pressed && styles.calendarCloseBtnPressed,
              ]}
              onPress={() => {
                setFechaMinima(null);
                setCalendarMinimaVisible(false);
              }}
            >
              {({ pressed }) => (
                <Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>
                  LIMPIAR
                </Text>
              )}
            </Pressable>

            <Pressable style={styles.calendarCancelBtn} onPress={() => setCalendarMinimaVisible(false)}>
              <Text style={styles.calendarCancelBtnText}>CERRAR</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CALENDARIO FECHA MÁXIMA */}
      <Modal
        visible={calendarMaximaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarMaximaVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCalendarMaximaVisible(false)}>
          <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
            {/* Cabecera del calendario */}
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable
                onPress={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>›</Text>
              </Pressable>
            </View>

            {/* Días de la semana */}
            <View style={styles.calendarWeekRow}>
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
                <Text key={d} style={styles.calendarWeekLabel}>{d}</Text>
              ))}
            </View>

            {/* Cuadrícula de días */}
            <View style={styles.calendarGrid}>
              {buildCalendarDays(calendarMonth).map((day, i) => {
                if (!day) return <View key={`b-${i}`} style={styles.calendarCell} />;
                const isSelected = fechaMaxima?.toDateString() === day.toDateString();
                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.calendarCell,
                      isSelected && styles.calendarCellSelected,
                    ]}
                    onPress={() => {
                      setFechaMaxima(day);
                      setCalendarMaximaVisible(false);
                    }}
                  >
                    <Text style={[styles.calendarCellText, isSelected && styles.calendarCellSelectedText]}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.calendarCloseBtn,
                pressed && styles.calendarCloseBtnPressed,
              ]}
              onPress={() => {
                setFechaMaxima(null);
                setCalendarMaximaVisible(false);
              }}
            >
              {({ pressed }) => (
                <Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>
                  LIMPIAR
                </Text>
              )}
            </Pressable>

            <Pressable style={styles.calendarCancelBtn} onPress={() => setCalendarMaximaVisible(false)}>
              <Text style={styles.calendarCancelBtnText}>CERRAR</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
