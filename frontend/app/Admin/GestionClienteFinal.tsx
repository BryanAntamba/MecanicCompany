// GestionClienteFinal.tsx
// Pantalla de gestión de clientes finales (usuarios del sistema) con filtros avanzados

import { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import NavbarAdmin from '@/components/navbarAdmin/navbarAdmin';
import styles from '@/Styles/pantallaAdmin/GestionClienteFinal';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/utils/api';
import { obtenerUsuarios, UsuarioRegistrado } from '@/utils/datosSimulados';

// Importar modales
import RegistrarCliente from '@/app/Admin/modalesClienteFinal/RegistrarCliente';
import EditarCliente from '@/app/Admin/modalesClienteFinal/EditarCliente';
// import VisualizarPerfilCliente from '@/app/Admin/modalesClienteFinal/VisualizarPerfilCliente'; // Comentado temporalmente - usando versión inline

// Importar modales de eliminación
import EliminarCliente from '@/app/Admin/modalesEliminacionDeRoles/eliminarCliente';
import EliminacionExitosa from '@/app/Admin/modalesEliminacionDeRoles/modalElimiancionConfirmada/eliminacionExitosa';

// Tipos
type EstadoConexion = 'LÍNEA' | 'DESCONECTADO' | 'SUSPENDIDO';

interface Cliente {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono?: string;
  fechaNacimiento?: Date;
  estadoConexion: EstadoConexion;
  cuentaActiva: boolean;
  createdAt?: string;
}

export default function GestionClienteFinalScreen() {
  const router = useRouter();
  const { token, logout } = useAuth();

  // Bloquear capturas de pantalla
  useEffect(() => {
    const preventCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    preventCapture();
    // No llamamos allowScreenCaptureAsync() al desmontar para mantener el bloqueo activo
  }, []);

  // BackHandler: navega a GestionUsuarios al presionar back
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/Admin/GestionUsuarios' as any);
      return true;
    });
    return () => backHandler.remove();
  }, [router]);

  // Estado de datos
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [ordenAZ, setOrdenAZ] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | EstadoConexion>('TODOS');
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

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  // Estados de modales
  const [modalRegistrarVisible, setModalRegistrarVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalPerfilVisible, setModalPerfilVisible] = useState(false);

  // Estados de modales de eliminación
  const [modalEliminarClienteVisible, setModalEliminarClienteVisible] = useState(false);
  const [modalEliminacionExitosaVisible, setModalEliminacionExitosaVisible] = useState(false);
  const [clienteEliminado, setClienteEliminado] = useState<{ nombre: string; rol: 'Usuario' } | null>(null);

  // Cargar clientes desde datos simulados
  useEffect(() => {
    const cargarClientesSimulados = () => {
      try {
        const usuariosSimulados = obtenerUsuarios();
        
        // Convertir usuarios simulados al formato Cliente
        const clientesData: Cliente[] = usuariosSimulados.map((u, index) => {
          const nombreCompleto = [
            u.nombre,
            u.segundoNombre,
            u.apellido,
            u.segundoApellido,
          ]
            .filter(Boolean)
            .join(' ');

          return {
            id: `cliente-${index + 1}`,
            nombreCompleto,
            correo: u.correo,
            telefono: u.telefono,
            fechaNacimiento: u.fechaNacimiento,
            estadoConexion: index % 3 === 0 ? 'LÍNEA' : 'DESCONECTADO', // Simulado
            cuentaActiva: true,
            createdAt: new Date(2024, 0, index + 1).toISOString(), // Simulado
          };
        });

        setClientes(clientesData);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los clientes.');
      } finally {
        setCargando(false);
      }
    };

    cargarClientesSimulados();
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

  // Filtrar y ordenar clientes
  const clientesFiltrados = clientes
    .filter((c) => {
      // Búsqueda por nombre completo
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda = c.nombreCompleto.toLowerCase().includes(textoBusqueda);

      // Filtro de estado
      let coincideEstado = false;
      if (filtroEstado === 'TODOS') {
        coincideEstado = true;
      } else if (filtroEstado === 'SUSPENDIDO') {
        // SUSPENDIDO = cuentas desactivadas
        coincideEstado = !c.cuentaActiva;
      } else {
        // LÍNEA o DESCONECTADO
        coincideEstado = c.estadoConexion === filtroEstado;
      }

      // Filtro de fechas
      let coincideFecha = true;
      if (c.createdAt) {
        if (fechaMinima) {
          const fechaCliente = new Date(c.createdAt);
          const fechaMin = new Date(fechaMinima);
          fechaMin.setHours(0, 0, 0, 0);
          fechaCliente.setHours(0, 0, 0, 0);
          if (fechaCliente < fechaMin) coincideFecha = false;
        }
        if (fechaMaxima) {
          const fechaCliente = new Date(c.createdAt);
          const fechaMax = new Date(fechaMaxima);
          fechaMax.setHours(23, 59, 59, 999);
          fechaCliente.setHours(0, 0, 0, 0);
          if (fechaCliente > fechaMax) coincideFecha = false;
        }
      }

      return coincideBusqueda && coincideEstado && coincideFecha;
    })
    .sort((a, b) => {
      const nombreA = a.nombreCompleto;
      const nombreB = b.nombreCompleto;
      return ordenAZ === 'A-Z' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

  // Calcular totales de TODOS los clientes (no solo filtrados)
  const totalClientes = clientes.length;
  // En Línea: solo usuarios activos con estado LÍNEA
  const totalEnLinea = clientes.filter((c) => c.estadoConexion === 'LÍNEA' && c.cuentaActiva).length;
  // Desconectados: solo usuarios activos con estado DESCONECTADO
  const totalDesconectados = clientes.filter((c) => c.estadoConexion === 'DESCONECTADO' && c.cuentaActiva).length;
  // Suspendidos: usuarios con cuenta desactivada
  const totalSuspendidos = clientes.filter((c) => !c.cuentaActiva).length;
  // Cuentas Activas: usuarios con cuenta activada
  const totalActivos = clientes.filter((c) => c.cuentaActiva).length;

  // Handlers
  const handleAbrirPerfil = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalPerfilVisible(true);
  };

  const handleAbrirEditar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditarVisible(true);
  };

  const handleSuccessRegistro = (cliente: any) => {
    const nuevoCliente: Cliente = {
      id: cliente.id,
      nombreCompleto: cliente.nombreCompleto,
      correo: cliente.correo,
      telefono: cliente.telefono,
      estadoConexion: cliente.estadoConexion || 'DESCONECTADO',
      cuentaActiva: cliente.cuentaActiva,
      createdAt: cliente.createdAt,
    };
    setClientes((prev) => [nuevoCliente, ...prev]);
  };

  const handleSuccessEditar = (clienteActualizado: any) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteActualizado.id
          ? {
              ...c,
              nombreCompleto: clienteActualizado.nombreCompleto,
              correo: clienteActualizado.correo,
              telefono: clienteActualizado.telefono,
              cuentaActiva: clienteActualizado.cuentaActiva,
            }
          : c
      )
    );
  };

  const handleEliminar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalEliminarClienteVisible(true);
  };

  const handleConfirmarEliminacion = async () => {
    if (!clienteSeleccionado) return;

    // Simulación: simplemente eliminar del estado local
    setClienteEliminado({
      nombre: clienteSeleccionado.nombreCompleto,
      rol: 'Usuario',
    });
    
    // Actualizar lista
    setClientes((prev) => prev.filter((c) => c.id !== clienteSeleccionado.id));
    
    // Cerrar modal de confirmación y abrir modal de éxito
    setModalEliminarClienteVisible(false);
    setModalEliminacionExitosaVisible(true);
  };

  const handleToggleCuenta = async (cliente: Cliente) => {
    // Simulación: simplemente cambiar el estado local
    setClientes((prev) =>
      prev.map((c) => (c.id === cliente.id ? { ...c, cuentaActiva: !c.cuentaActiva } : c))
    );
  };

  const handleSignOut = () => {
    logout();
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // RENDER
  return (
    <View style={styles.page}>
      <NavbarAdmin onSignOut={handleSignOut} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* TÍTULO */}
        <Text style={styles.screenTitle}>GESTIÓN DE USUARIOS</Text>
        <Text style={styles.screenSubtitle}>
          Administra los clientes finales del sistema con filtros avanzados
        </Text>

        {/* BOTÓN DE REGISTRO */}
        <Pressable
          onPress={() => setModalRegistrarVisible(true)}
          style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
        >
          {({ pressed }) => (
            <Text style={[styles.registerBtnText, pressed && styles.registerBtnTextPressed]}>
              REGISTRAR NUEVO USUARIO
            </Text>
          )}
        </Pressable>

        {/* FILTROS */}
        <View style={styles.filterContainer}>
          {/* Barra de búsqueda */}
          <Text style={styles.filterLabel}>Buscar Cliente</Text>
          <View style={styles.searchBox}>
            <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar cliente"
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

          {/* Estado de conexión */}
          <Text style={styles.filterLabel}>Estado</Text>
          <Pressable style={styles.filterDropdown} onPress={() => setEstadoDropdownOpen((v) => !v)}>
            <Text style={styles.filterDropdownText}>
              {filtroEstado === 'TODOS' ? 'Todos' : 
               filtroEstado === 'LÍNEA' ? 'En línea' :
               filtroEstado === 'DESCONECTADO' ? 'Desconectado' : 'Suspendido'}
            </Text>
            <Text style={styles.dropdownArrow}>{estadoDropdownOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {estadoDropdownOpen && (
            <ScrollView 
              style={styles.dropdownList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {(['TODOS', 'LÍNEA', 'DESCONECTADO', 'SUSPENDIDO'] as const).map((option) => {
                const displayText = option === 'TODOS' ? 'Todos' : 
                                   option === 'LÍNEA' ? 'En línea' :
                                   option === 'DESCONECTADO' ? 'Desconectado' : 'Suspendido';
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
            </ScrollView>
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
            <Text style={styles.summaryNumber}>{totalClientes}</Text>
            <Text style={styles.summaryLabel}>Total Usuarios</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalEnLinea}</Text>
            <Text style={styles.summaryLabel}>En Línea</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalDesconectados}</Text>
            <Text style={styles.summaryLabel}>Desconectados</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalSuspendidos}</Text>
            <Text style={styles.summaryLabel}>Suspendidos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalActivos}</Text>
            <Text style={styles.summaryLabel}>Cuentas Activas</Text>
          </View>
        </View>

        {/* INDICADOR DE CARGA */}
        {cargando && (
          <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 24 }}>
            Cargando clientes...
          </Text>
        )}

        {/* MENSAJE VACÍO */}
        {!cargando && clientesFiltrados.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron clientes</Text>
        )}

        {/* LISTA DE CLIENTES */}
        <View style={styles.usuariosContainer}>
          {clientesFiltrados.map((cliente) => (
            <View key={cliente.id} style={styles.userCard}>
              {/* Contenido de la cartilla - Sin foto de perfil */}
              <View style={styles.userContent}>
                {/* Nombre y datos básicos */}
                <Text style={styles.userName} numberOfLines={2}>
                  {cliente.nombreCompleto}
                </Text>
                
                <Text style={styles.userMeta} numberOfLines={1}>
                  {cliente.correo}
                </Text>
                
                {cliente.telefono && (
                  <Text style={styles.userMeta} numberOfLines={1}>
                    {cliente.telefono}
                  </Text>
                )}

                {/* Badges de Estado y Rol */}
                <View style={styles.badgeRow}>
                  {/* Badge de Estado de Conexión */}
                  <View
                    style={[
                      styles.badge,
                      cliente.estadoConexion === 'LÍNEA' && styles.badgeLinea,
                      cliente.estadoConexion === 'DESCONECTADO' && styles.badgeDesconectado,
                      cliente.estadoConexion === 'SUSPENDIDO' && styles.badgeSuspendido,
                    ]}
                  >
                    <Text style={styles.badgeText}>{cliente.estadoConexion}</Text>
                  </View>

                  {/* Badge de Rol USUARIO */}
                  <View style={[styles.badge, styles.badgeRolUsuario]}>
                    <Text style={styles.badgeText}>USUARIO</Text>
                  </View>
                </View>

                {/* Botón principal: VER PERFIL */}
                <Pressable
                  onPress={() => handleAbrirPerfil(cliente)}
                  style={({ pressed }) => [
                    styles.btnPerfil,
                    pressed && styles.btnPerfilPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btnPerfilText,
                        pressed && styles.btnPerfilTextPressed,
                      ]}
                    >
                      VER PERFIL
                    </Text>
                  )}
                </Pressable>

                {/* Botón Editar */}
                <Pressable
                  onPress={() => handleAbrirEditar(cliente)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    styles.btnEdit,
                    pressed && styles.btnEditPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btnSecundarioText,
                        pressed && styles.btnSecundarioTextPressed,
                      ]}
                    >
                      EDITAR
                    </Text>
                  )}
                </Pressable>

                {/* Botón Eliminar */}
                <Pressable
                  onPress={() => handleEliminar(cliente)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    styles.btnDelete,
                    pressed && styles.btnDeletePressed,
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btnSecundarioText,
                        pressed && styles.btnSecundarioTextPressed,
                      ]}
                    >
                      ELIMINAR
                    </Text>
                  )}
                </Pressable>

                {/* Botón Toggle Cuenta */}
                <Pressable
                  onPress={() => handleToggleCuenta(cliente)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    cliente.cuentaActiva ? styles.btnToggleOn : styles.btnToggleOff,
                    pressed && (cliente.cuentaActiva ? styles.btnToggleOnPressed : styles.btnToggleOffPressed),
                  ]}
                >
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.btnSecundarioText,
                        pressed && styles.btnSecundarioTextPressed,
                      ]}
                    >
                      {cliente.cuentaActiva ? 'DESACTIVAR' : 'ACTIVAR'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL CALENDARIO FECHA MÍNIMA */}
      <Modal
        visible={calendarMinimaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarMinimaVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCalendarMinimaVisible(false)}>
          <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable
                onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                style={styles.calendarNavBtn}
              >
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
                  <Pressable
                    key={i}
                    style={[styles.calendarCell, isSelected && styles.calendarCellSelected]}
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
              onPress={() => setCalendarMinimaVisible(false)}
              style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>
                  ACEPTAR
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setFechaMinima(null);
                setCalendarMinimaVisible(false);
              }}
              style={styles.calendarCancelBtn}
            >
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
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
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                style={styles.calendarNavBtn}
              >
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable
                onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                style={styles.calendarNavBtn}
              >
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
                  <Pressable
                    key={i}
                    style={[styles.calendarCell, isSelected && styles.calendarCellSelected]}
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
              onPress={() => setCalendarMaximaVisible(false)}
              style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>
                  ACEPTAR
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setFechaMaxima(null);
                setCalendarMaximaVisible(false);
              }}
              style={styles.calendarCancelBtn}
            >
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODALES DE GESTIÓN */}
      {/* MODALES DE GESTIÓN */}
      <RegistrarCliente
        visible={modalRegistrarVisible}
        onClose={() => setModalRegistrarVisible(false)}
        onSuccess={handleSuccessRegistro}
        token="" // No necesario para datos simulados
      />

      <EditarCliente
        visible={modalEditarVisible}
        cliente={clienteSeleccionado}
        onClose={() => setModalEditarVisible(false)}
        onSuccess={handleSuccessEditar}
        token="" // No necesario para datos simulados
      />

      {/* MODAL VISUALIZAR PERFIL - MISMO ESTILO QUE MECANICO */}
      <Modal visible={modalPerfilVisible} transparent animationType="fade" onRequestClose={() => setModalPerfilVisible(false)}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: '90%', maxWidth: 500, height: '85%', backgroundColor: '#1E293B', borderRadius: 16, padding: 20 }}>
            {/* Botón X para cerrar */}
            <Pressable onPress={() => setModalPerfilVisible(false)} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#DC2626', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 8 }}>
              <FontAwesome name="times" size={24} color="#FFFFFF" />
            </Pressable>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={true}>
              {/* Título */}
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F1F5F9', textAlign: 'center', marginBottom: 20 }}>Perfil de Usuario</Text>

              {clienteSeleccionado && (
                <>
                  {/* Nombre Completo */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nombre Completo:</Text>
                    <Text style={{ fontSize: 16, color: '#F1F5F9', fontWeight: '500' }}>{clienteSeleccionado.nombreCompleto}</Text>
                  </View>

                  {/* Fecha de Nacimiento */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fecha de Nacimiento:</Text>
                    <Text style={{ fontSize: 16, color: '#F1F5F9', fontWeight: '500' }}>
                      {clienteSeleccionado.fechaNacimiento ? new Date(clienteSeleccionado.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                    </Text>
                  </View>

                  {/* Teléfono */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Teléfono:</Text>
                    <Text style={{ fontSize: 16, color: '#F1F5F9', fontWeight: '500' }}>{clienteSeleccionado.telefono || 'No especificado'}</Text>
                  </View>

                  {/* Correo Electrónico */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Correo Electrónico:</Text>
                    <Text style={{ fontSize: 16, color: '#F1F5F9', fontWeight: '500' }}>{clienteSeleccionado.correo}</Text>
                  </View>

                  {/* Estado de Conexión */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estado de Conexión:</Text>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '700',
                      color: clienteSeleccionado.estadoConexion === 'LÍNEA' ? '#10B981' : clienteSeleccionado.estadoConexion === 'DESCONECTADO' ? '#64748B' : '#EF4444'
                    }}>
                      {clienteSeleccionado.estadoConexion || 'DESCONECTADO'}
                    </Text>
                  </View>

                  {/* Estado de Cuenta */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estado de Cuenta:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: clienteSeleccionado.cuentaActiva ? '#10B981' : '#EF4444' }}>
                      {clienteSeleccionado.cuentaActiva ? 'Activa' : 'Inactiva'}
                    </Text>
                  </View>

                  {/* Fecha de Registro */}
                  <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fecha de Registro:</Text>
                    <Text style={{ fontSize: 16, color: '#F1F5F9', fontWeight: '500' }}>
                      {clienteSeleccionado.createdAt ? new Date(clienteSeleccionado.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                    </Text>
                  </View>
                </>
              )}

              {/* Botón CERRAR */}
              <Pressable 
                onPress={() => setModalPerfilVisible(false)} 
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#2563EB' : '#FFFFFF',
                  borderRadius: 6,
                  paddingVertical: 14,
                  alignItems: 'center',
                  marginTop: 8
                })}
              >
                {({ pressed }) => (
                  <Text style={{ fontSize: 15, fontWeight: '800', color: pressed ? '#FFFFFF' : '#000000', letterSpacing: 1 }}>
                    CERRAR
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODALES DE ELIMINACIÓN */}
      <EliminarCliente
        visible={modalEliminarClienteVisible}
        cliente={clienteSeleccionado}
        onCancelar={() => setModalEliminarClienteVisible(false)}
        onConfirmar={handleConfirmarEliminacion}
      />

      <EliminacionExitosa
        visible={modalEliminacionExitosaVisible}
        nombreUsuario={clienteEliminado?.nombre || ''}
        rolUsuario={'Usuario' as any}
        onCerrar={() => setModalEliminacionExitosaVisible(false)}
      />
    </View>
  );
}
