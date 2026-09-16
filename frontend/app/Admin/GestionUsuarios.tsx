// GestionUsuarios.tsx
// Pantalla de gestión de usuarios y mecánicos con filtros avanzados

import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
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
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ScreenCapture from 'expo-screen-capture';
import NavbarAdmin from '@/components/navbarAdmin/navbarAdmin';
import stylesBase from '@/Styles/pantallaAdmin/GestionUsuarios';
import stylesWeb from '@/Styles/pantallaAdmin/GestionUsuarios.web';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/utils/api';
import ResponsiveContainer from '@/components/ResponsiveContainer';

const styles = Platform.OS === 'web' ? stylesWeb : stylesBase;

// Importar modales de gestión de personal
import RegistroPersonal from './modalesRegistros/registroPersonal';
import EditarPersonal from './modalesRegistros/EditarPersonal';
import VisualizarPerfilPersonal from './modalesRegistros/visualizarPerfilPersonal';

// Importar modales de eliminación
import EliminarPersonal from './modalesEliminacionDeRoles/eliminarPersonal';
import EliminacionExitosa from './modalesEliminacionDeRoles/modalElimiancionConfirmada/eliminacionExitosa';

// Tipos
type EstadoConexion = 'LÍNEA' | 'DESCONECTADO' | 'SUSPENDIDO';
type Rol = 'Mecánico' | 'Inventario' | 'Financiero' | 'Administrador';

interface Usuario {
  id: string;
  nombres: string;
  segundoNombre?: string;
  apellidos: string;
  segundoApellido?: string;
  edad: number;
  telefono?: string;
  correo: string;
  correoEmpresarial: string;
  estadoConexion: EstadoConexion;
  cuentaActiva: boolean;
  createdAt?: string;
  rol: Rol;
  // Solo para mecánicos
  especialidad?: string;
  anosExperiencia?: number;
  fotoPerfil?: string | null;
  tipoPersonal?: string; // Mecánico, Inventario, Financiero, Administrador
}

export default function GestionUsuariosScreen() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const { width } = useWindowDimensions();
  
  // Determinar breakpoints
  const isSmallScreen = width < 1024;

  // Bloquear capturas de pantalla (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const preventCapture = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
    };
    preventCapture();
    // No llamamos allowScreenCaptureAsync() al desmontar para mantener el bloqueo activo
  }, []);

  // BackHandler: cierra sesión y app (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      logout();
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, [logout]);

  // Estado de datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [ordenAZ, setOrdenAZ] = useState<'A-Z' | 'Z-A'>('A-Z');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | EstadoConexion>('TODOS');
  const [filtroRol, setFiltroRol] = useState<'TODOS' | Rol>('TODOS');
  const [fechaMinima, setFechaMinima] = useState<Date | null>(null);
  const [fechaMaxima, setFechaMaxima] = useState<Date | null>(null);

  // Estados de dropdowns
  const [ordenDropdownOpen, setOrdenDropdownOpen] = useState(false);
  const [estadoDropdownOpen, setEstadoDropdownOpen] = useState(false);
  const [rolDropdownOpen, setRolDropdownOpen] = useState(false);

  // Estados de modales de calendario
  const [calendarMinimaVisible, setCalendarMinimaVisible] = useState(false);
  const [calendarMaximaVisible, setCalendarMaximaVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Estados de modales de gestión
  const [modalRegistroPersonalVisible, setModalRegistroPersonalVisible] = useState(false);
  const [modalEditarPersonalVisible, setModalEditarPersonalVisible] = useState(false);
  const [modalPerfilPersonalVisible, setModalPerfilPersonalVisible] = useState(false);

  // Estados de modales de eliminación
  const [modalEliminarPersonalVisible, setModalEliminarPersonalVisible] = useState(false);
  const [modalEliminacionExitosaVisible, setModalEliminacionExitosaVisible] = useState(false);
  const [usuarioEliminado, setUsuarioEliminado] = useState<{ nombre: string; rol: Rol } | null>(null);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  // Cargar usuarios desde el backend
  const cargarUsuarios = useCallback(async () => {
    if (!token) return;
    
    setCargando(true);
    try {
      // Cargar mecánicos
      const respMecanicos = await fetch(`${BASE_URL}/mecanicos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!respMecanicos.ok) {
        throw new Error(`HTTP error! status: ${respMecanicos.status}`);
      }
      
      const mecanicos = await respMecanicos.json();

      // Convertir a formato Usuario
      const usuariosMecanicos: Usuario[] = mecanicos.map((m: any) => {
        // Determinar el tipoPersonal real
        const tipoPersonal = m.tipoPersonal || 'Mecánico';
        
        return {
          id: m.id,
          nombres: m.nombres,
          segundoNombre: m.segundoNombre || undefined,
          apellidos: m.apellidos,
          segundoApellido: m.segundoApellido || undefined,
          edad: m.edad,
          telefono: m.telefono || undefined,
          correo: m.correo,
          correoEmpresarial: m.correoEmpresarial,
          estadoConexion: m.estadoConexion || 'DESCONECTADO',
          cuentaActiva: m.cuentaActiva ?? true,
          createdAt: m.createdAt,
          rol: (tipoPersonal === 'Administrador' ? 'Administrador' : 'Mecánico') as Rol,
          especialidad: tipoPersonal === 'Mecánico' ? m.especialidad : tipoPersonal,
          anosExperiencia: m.anosExperiencia || 0,
          fotoPerfil: m.fotoPerfil,
          tipoPersonal: tipoPersonal,
        };
      });

      setUsuarios([...usuariosMecanicos]);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Alert.alert('Error', 'Error al cargar los usuarios. Verifica que el backend esté activo.');
    } finally {
      setCargando(false);
    }
  }, [token]);

  // Recargar usuarios cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      cargarUsuarios();
    }, [cargarUsuarios])
  );

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

  const nombreCompleto = (u: Usuario) =>
    [u.nombres, u.segundoNombre, u.apellidos, u.segundoApellido].filter(Boolean).join(' ');

  // Filtrar y ordenar usuarios
  const usuariosFiltrados = usuarios
    .filter((u) => {
      // Búsqueda por nombre completo
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda = nombreCompleto(u).toLowerCase().includes(textoBusqueda);

      // Filtro de estado
      let coincideEstado = false;
      if (filtroEstado === 'TODOS') {
        coincideEstado = true;
      } else if (filtroEstado === 'SUSPENDIDO') {
        // SUSPENDIDO = cuentas desactivadas
        coincideEstado = !u.cuentaActiva;
      } else {
        // LÍNEA o DESCONECTADO
        coincideEstado = u.estadoConexion === filtroEstado;
      }

      // Filtro de rol
      const coincideRol = filtroRol === 'TODOS' || u.tipoPersonal === filtroRol;

      // Filtro de fechas
      let coincideFecha = true;
      if (u.createdAt) {
        if (fechaMinima) {
          const fechaUsuario = new Date(u.createdAt);
          const fechaMin = new Date(fechaMinima);
          fechaMin.setHours(0, 0, 0, 0);
          fechaUsuario.setHours(0, 0, 0, 0);
          if (fechaUsuario < fechaMin) coincideFecha = false;
        }
        if (fechaMaxima) {
          const fechaUsuario = new Date(u.createdAt);
          const fechaMax = new Date(fechaMaxima);
          fechaMax.setHours(23, 59, 59, 999);
          fechaUsuario.setHours(0, 0, 0, 0);
          if (fechaUsuario > fechaMax) coincideFecha = false;
        }
      }

      return coincideBusqueda && coincideEstado && coincideRol && coincideFecha;
    })
    .sort((a, b) => {
      const nombreA = nombreCompleto(a);
      const nombreB = nombreCompleto(b);
      return ordenAZ === 'A-Z' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

  // Calcular totales de TODOS los usuarios (no solo filtrados)
  const totalUsuarios = usuarios.length;
  const totalMecanicos = usuarios.filter((u) => u.tipoPersonal === 'Mecánico').length;
  const totalInventario = usuarios.filter((u) => u.tipoPersonal === 'Inventario').length;
  const totalFinanciero = usuarios.filter((u) => u.tipoPersonal === 'Financiero').length;
  const totalAdmins = usuarios.filter((u) => u.tipoPersonal === 'Administrador').length;
  // En Línea: solo usuarios activos con estado LÍNEA
  const totalEnLinea = usuarios.filter((u) => u.estadoConexion === 'LÍNEA' && u.cuentaActiva).length;
  // Desconectados: solo usuarios activos con estado DESCONECTADO
  const totalDesconectados = usuarios.filter((u) => u.estadoConexion === 'DESCONECTADO' && u.cuentaActiva).length;
  // Suspendidos: usuarios con cuenta desactivada
  const totalSuspendidos = usuarios.filter((u) => !u.cuentaActiva).length;

  // Handlers de modales
  const handleAbrirPerfil = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalPerfilPersonalVisible(true);
  };

  const handleAbrirEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarPersonalVisible(true);
  };

  const handleEliminar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarPersonalVisible(true);
  };

  const handleConfirmarEliminacion = async () => {
    if (!usuarioSeleccionado) return;

    try {
      const endpoint = usuarioSeleccionado.rol === 'Mecánico' ? '/mecanicos' : '/admin';
      const resp = await fetch(`${BASE_URL}${endpoint}/${usuarioSeleccionado.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error();
      
      // Guardar info del usuario eliminado
      setUsuarioEliminado({
        nombre: nombreCompleto(usuarioSeleccionado),
        rol: usuarioSeleccionado.rol,
      });
      
      // Actualizar lista
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSeleccionado.id));
      
      // Cerrar modal de confirmación y abrir modal de éxito
      setModalEliminarPersonalVisible(false);
      setModalEliminacionExitosaVisible(true);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el usuario.');
    }
  };

  const handleToggleCuenta = async (usuario: Usuario) => {
    try {
      const endpoint = usuario.rol === 'Mecánico' ? '/mecanicos' : '/admin';
      const resp = await fetch(`${BASE_URL}${endpoint}/${usuario.id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cuentaActiva: !usuario.cuentaActiva }),
      });
      if (!resp.ok) throw new Error();
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, cuentaActiva: !u.cuentaActiva } : u))
      );
    } catch {
      Alert.alert('Error', 'No se pudo cambiar el estado de la cuenta.');
    }
  };

  const handleSuccessRegistroPersonal = (personal: any) => {
    // Determinar el rol basado en el tipoPersonal
    const tipoPersonal = personal.tipoPersonal || 'Mecánico';
    let rol: Rol = 'Mecánico';
    if (tipoPersonal === 'Administrador') {
      rol = 'Administrador';
    }
    
    const nuevoUsuario: Usuario = {
      id: personal.id,
      nombres: personal.nombres,
      segundoNombre: personal.segundoNombre,
      apellidos: personal.apellidos,
      segundoApellido: personal.segundoApellido,
      edad: personal.edad,
      telefono: personal.telefono,
      correo: personal.correo,
      correoEmpresarial: personal.correoEmpresarial,
      estadoConexion: personal.estadoConexion || 'DESCONECTADO',
      cuentaActiva: personal.cuentaActiva,
      createdAt: personal.createdAt,
      rol: rol,
      especialidad: tipoPersonal === 'Mecánico' ? personal.especialidad : tipoPersonal,
      anosExperiencia: personal.anosExperiencia || 0,
      fotoPerfil: personal.fotoPerfil,
      tipoPersonal: tipoPersonal,
    };
    setUsuarios((prev) => [nuevoUsuario, ...prev]);
  };

  const handleSuccessEditar = (usuarioActualizado: any) => {
    // Determinar el rol basado en el tipoPersonal
    const tipoPersonal = usuarioActualizado.tipoPersonal || 'Mecánico';
    let rol: Rol = 'Mecánico';
    if (tipoPersonal === 'Administrador') {
      rol = 'Administrador';
    }
    
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioActualizado.id
          ? {
              ...u,
              nombres: usuarioActualizado.nombres,
              segundoNombre: usuarioActualizado.segundoNombre,
              apellidos: usuarioActualizado.apellidos,
              segundoApellido: usuarioActualizado.segundoApellido,
              edad: usuarioActualizado.edad,
              telefono: usuarioActualizado.telefono,
              correo: usuarioActualizado.correo,
              correoEmpresarial: usuarioActualizado.correoEmpresarial,
              cuentaActiva: usuarioActualizado.cuentaActiva,
              rol: rol,
              especialidad: tipoPersonal === 'Mecánico' ? usuarioActualizado.especialidad : tipoPersonal,
              anosExperiencia: usuarioActualizado.anosExperiencia || 0,
              fotoPerfil: usuarioActualizado.fotoPerfil,
              tipoPersonal: tipoPersonal,
            }
          : u
      )
    );
  };

  const handleSignOut = () => {
    logout();
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  // RENDER
  return (
    <ResponsiveContainer>
      <View style={styles.page}>
        <NavbarAdmin onSignOut={handleSignOut} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* TÍTULO */}
        <Text style={styles.screenTitle}>GESTIÓN DE PERSONAL</Text>
        <Text style={styles.screenSubtitle}>
          Administra el personal del sistema con filtros avanzados
        </Text>

        {/* BOTONES DE REGISTRO */}
        <View style={styles.buttonsRow}>
          <Pressable
            onPress={() => setModalRegistroPersonalVisible(true)}
            style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
          >
            {({ pressed }) => (
              <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                <FontAwesome 
                  name="user-plus" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'}
                />
                <View style={{ width: 10 }} />
                <Text style={[styles.registerBtnText, pressed && styles.registerBtnTextPressed]}>
                  REGISTRAR PERSONAL
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* FILTROS */}
        <View style={styles.filterContainer}>
          {/* Barra de búsqueda */}
          <Text style={styles.filterLabel}>Buscar Usuario</Text>
          <View style={styles.searchBox}>
            <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar usuario"
              placeholderTextColor="#94A3B8"
              value={busqueda}
              onChangeText={setBusqueda}
              style={styles.searchInput}
            />
          </View>

          {/* Fila de filtros: Orden, Estado y Tipo de Personal */}
          {/* Fila 1: Orden y Estado lado a lado */}
          <View style={[
            Platform.OS === 'web' && !isSmallScreen && styles.filterRowContainer
          ]}>
            {/* Filtro Orden */}
            <View style={[
              Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
            ]}>
              <Text style={styles.filterLabel}>Orden</Text>
              <Pressable style={styles.filterDropdown} onPress={() => {
                setOrdenDropdownOpen((v) => !v);
                setEstadoDropdownOpen(false);
                setRolDropdownOpen(false);
              }}>
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
            </View>

            {/* Filtro Estado */}
            <View style={[
              Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
            ]}>
              <Text style={styles.filterLabel}>Estado</Text>
              <Pressable style={styles.filterDropdown} onPress={() => {
                setEstadoDropdownOpen((v) => !v);
                setOrdenDropdownOpen(false);
                setRolDropdownOpen(false);
              }}>
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
            </View>
          </View>

          {/* Filtro Tipo de Personal (fila separada) */}
          <View>
            <Text style={styles.filterLabel}>Tipo de Personal</Text>
            <Pressable style={styles.filterDropdown} onPress={() => {
              setRolDropdownOpen((v) => !v);
              setOrdenDropdownOpen(false);
              setEstadoDropdownOpen(false);
            }}>
              <Text style={styles.filterDropdownText}>
                {filtroRol === 'TODOS' ? 'Todos' : filtroRol}
              </Text>
              <Text style={styles.dropdownArrow}>{rolDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {rolDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {(['TODOS', 'Mecánico', 'Inventario', 'Financiero', 'Administrador'] as const).map((option) => {
                  const displayText = option === 'TODOS' ? 'Todos' : option;
                  return (
                    <Pressable
                      key={option}
                      style={[styles.dropdownItem, filtroRol === option && styles.dropdownItemActive]}
                      onPress={() => {
                        setFiltroRol(option);
                        setRolDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>{filtroRol === option ? '✓ ' : '    '}</Text>
                      <Text style={styles.dropdownItemText}>{displayText}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

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
            <Text style={styles.summaryNumber}>{totalUsuarios}</Text>
            <Text style={styles.summaryLabel}>Total Usuarios</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalMecanicos}</Text>
            <Text style={styles.summaryLabel}>Mecánicos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalInventario}</Text>
            <Text style={styles.summaryLabel}>Inventario</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalFinanciero}</Text>
            <Text style={styles.summaryLabel}>Financiero</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalAdmins}</Text>
            <Text style={styles.summaryLabel}>Administradores</Text>
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
        </View>

        {/* INDICADOR DE CARGA */}
        {cargando && (
          <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 24 }}>
            Cargando usuarios...
          </Text>
        )}

        {/* MENSAJE VACÍO */}
        {!cargando && usuariosFiltrados.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron usuarios</Text>
        )}

        {/* LISTA DE USUARIOS */}
        <View style={[
          styles.usuariosContainer,
          Platform.OS === 'web' && !isSmallScreen && { flexDirection: 'row', flexWrap: 'wrap' }
        ]}>
          {usuariosFiltrados.map((usuario) => (
            <View 
              key={usuario.id} 
              style={[
                styles.userCard,
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
              {/* Foto de perfil o placeholder */}
              {usuario.fotoPerfil ? (
                <Image source={{ uri: usuario.fotoPerfil }} style={styles.userFoto} contentFit="cover" />
              ) : (
                <View style={styles.userFotoPlaceholder}>
                  <FontAwesome
                    name={usuario.rol === 'Administrador' ? 'shield' : 'user'}
                    size={26}
                    color="#475569"
                  />
                </View>
              )}

              {/* Contenido de la cartilla */}
              <View style={styles.userContent}>
                {/* Nombre y datos básicos */}
                <Text style={styles.userName} numberOfLines={2}>
                  {nombreCompleto(usuario)}
                </Text>
                
                <Text style={styles.userMeta} numberOfLines={1}>
                  {usuario.edad} años
                </Text>
                
                <Text style={styles.userMeta} numberOfLines={1}>
                  {usuario.rol === 'Administrador' ? usuario.correoEmpresarial : usuario.correo}
                </Text>
                
                {/* Mostrar especialidad según el tipo de personal */}
                {usuario.especialidad && (
                  <Text style={styles.userMeta} numberOfLines={1}>
                    {usuario.especialidad}
                  </Text>
                )}

                {/* Badges debajo del texto */}
                <View style={styles.badgeRow}>
                  {/* Badge de Estado de Conexión */}
                  <View
                    style={[
                      styles.badge,
                      usuario.estadoConexion === 'LÍNEA' && styles.badgeLinea,
                      usuario.estadoConexion === 'DESCONECTADO' && styles.badgeDesconectado,
                      usuario.estadoConexion === 'SUSPENDIDO' && styles.badgeSuspendido,
                    ]}
                  >
                    <Text style={styles.badgeText}>{usuario.estadoConexion}</Text>
                  </View>

                  {/* Badge de Rol - Muestra el tipoPersonal real */}
                  <View
                    style={[
                      styles.badge,
                      usuario.tipoPersonal === 'Inventario' && styles.badgeRolInventario,
                      usuario.tipoPersonal === 'Financiero' && styles.badgeRolFinanciero,
                      usuario.tipoPersonal === 'Administrador' && styles.badgeRolAdmin,
                      (!usuario.tipoPersonal || usuario.tipoPersonal === 'Mecánico') && styles.badgeRolMecanico,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {(usuario.tipoPersonal || 'Mecánico').toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Botón principal: PERFIL */}
                <Pressable
                  onPress={() => handleAbrirPerfil(usuario)}
                  style={({ pressed }) => [
                    styles.btnPerfil,
                    pressed && styles.btnPerfilPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome 
                        name="user" 
                        size={16} 
                        color={pressed ? '#FFFFFF' : '#000000'}
                      />
                      <View style={{ width: 8 }} />
                      <Text
                        style={[
                          styles.btnPerfilText,
                          pressed && styles.btnPerfilTextPressed,
                        ]}
                      >
                        PERFIL
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Botones verticales: uno abajo del otro */}
                {/* Botón Editar */}
                <Pressable
                  onPress={() => handleAbrirEditar(usuario)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    styles.btnEdit,
                    pressed && styles.btnEditPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome 
                        name="edit" 
                        size={14} 
                        color={pressed ? '#F1F5F9' : '#FFFFFF'}
                      />
                      <View style={{ width: 8 }} />
                      <Text
                        style={[
                          styles.btnSecundarioText,
                          pressed && styles.btnSecundarioTextPressed,
                        ]}
                      >
                        EDITAR
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Botón Eliminar */}
                <Pressable
                  onPress={() => handleEliminar(usuario)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    styles.btnDelete,
                    pressed && styles.btnDeletePressed,
                  ]}
                >
                  {({ pressed }) => (
                    <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome 
                        name="trash" 
                        size={14} 
                        color={pressed ? '#F1F5F9' : '#FFFFFF'}
                      />
                      <View style={{ width: 8 }} />
                      <Text
                        style={[
                          styles.btnSecundarioText,
                          pressed && styles.btnSecundarioTextPressed,
                        ]}
                      >
                        ELIMINAR
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Botón Toggle Cuenta */}
                <Pressable
                  onPress={() => handleToggleCuenta(usuario)}
                  style={({ pressed }) => [
                    styles.btnSecundario,
                    usuario.cuentaActiva ? styles.btnToggleOn : styles.btnToggleOff,
                    pressed && (usuario.cuentaActiva ? styles.btnToggleOnPressed : styles.btnToggleOffPressed),
                  ]}
                >
                  {({ pressed }) => (
                    <View style={[styles.buttonContent, { flexDirection: 'row', alignItems: 'center' }]}>
                      <FontAwesome 
                        name={usuario.cuentaActiva ? 'ban' : 'check-circle'} 
                        size={14} 
                        color={pressed ? '#F1F5F9' : '#FFFFFF'}
                      />
                      <View style={{ width: 8 }} />
                      <Text
                        style={[
                          styles.btnSecundarioText,
                          pressed && styles.btnSecundarioTextPressed,
                        ]}
                      >
                        {usuario.cuentaActiva ? 'DESACTIVAR' : 'ACTIVAR'}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODALES DE GESTIÓN */}
      <RegistroPersonal
        visible={modalRegistroPersonalVisible}
        onClose={() => setModalRegistroPersonalVisible(false)}
        onSuccess={handleSuccessRegistroPersonal}
        token={token || ''}
      />

      <EditarPersonal
        visible={modalEditarPersonalVisible}
        mecanico={usuarioSeleccionado}
        onClose={() => setModalEditarPersonalVisible(false)}
        onSuccess={handleSuccessEditar}
        token={token || ''}
      />

      <VisualizarPerfilPersonal
        visible={modalPerfilPersonalVisible}
        mecanico={usuarioSeleccionado}
        onClose={() => setModalPerfilPersonalVisible(false)}
      />

      {/* MODALES DE ELIMINACIÓN */}
      <EliminarPersonal
        visible={modalEliminarPersonalVisible}
        personal={usuarioSeleccionado}
        onCancelar={() => setModalEliminarPersonalVisible(false)}
        onConfirmar={handleConfirmarEliminacion}
      />

      <EliminacionExitosa
        visible={modalEliminacionExitosaVisible}
        nombreUsuario={usuarioEliminado?.nombre || ''}
        rolUsuario={usuarioEliminado?.rol || 'Mecánico'}
        onCerrar={() => setModalEliminacionExitosaVisible(false)}
      />

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
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
                <Text key={d} style={styles.calendarWeekLabel}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {buildCalendarDays(calendarMonth).map((day, i) => {
                if (!day) return <View key={`b-${i}`} style={styles.calendarCell} />;
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
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
                <Text key={d} style={styles.calendarWeekLabel}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {buildCalendarDays(calendarMonth).map((day, i) => {
                if (!day) return <View key={`b-${i}`} style={styles.calendarCell} />;
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
      </View>
    </ResponsiveContainer>
  );
}
