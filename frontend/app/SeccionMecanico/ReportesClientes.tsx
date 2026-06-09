// ReportesClientes.tsx
// Pantalla principal del mecánico para gestionar las solicitudes de servicio.
// Permite: editar solicitudes, registrar/editar mantenimientos, eliminar registros
// y enviar el reporte técnico al correo del cliente.

// Hooks de React para manejar estado local y efectos secundarios
import { useCallback, useState } from 'react';

// Componentes nativos de React Native
import {
  BackHandler,          // Intercepta el botón físico de atrás en Android
  KeyboardAvoidingView, // Evita que el teclado tape los inputs en iOS
  Modal,                // Superposición de contenido sobre la pantalla principal
  Platform,             // Detecta el sistema operativo (iOS / Android)
  Pressable,            // Área táctil con feedback de presión
  ScrollView,           // Vista con scroll vertical
  Text,                 // Renderiza texto en pantalla
  TextInput,            // Campo de entrada de texto
  View,                 // Contenedor genérico
} from 'react-native';

// Íconos vectoriales de FontAwesome (pencil, trash, wrench, edit, send, lock, phone, car)
import { FontAwesome } from '@expo/vector-icons';

// Barra de navegación del mecánico con opciones Reportes, Historial y Cerrar sesión
import NavbarMecanico from '@/components/nadvarMecanico/nadvarMecanico';

// useFocusEffect: ejecuta un efecto solo mientras la pantalla está en foco
import { useFocusEffect } from 'expo-router';

// Hoja de estilos compartida entre ReportesClientes e historial
import styles from '@/Styles/ReportesClientes';

// Contexto de autenticación para obtener el token JWT
import { useAuth } from '@/context/AuthContext';

// API de mecánicos para cargar la lista dinámica
import { mecanicosApi, mantenimientosApi, solicitudesApi, reportesApi, SolicitudBackend } from '@/utils/api';

// Validación del nombre completo en el modal de edición
import {
  validarNombreCompleto,
  validarTelefono,
  validarCorreoGmail,
  validarSoloTexto,
  validarModelo,
  validarAño,
  validarPlaca,
  validarSoloNumeros,
  validarObligatorio,
  validarOtroServicio,
  validarTextoYNumeros,
  validarFecha,
  validarCosto,
  validarCostoObligatorio,
} from '@/utils/validaciones';


// TIPOS

// Posibles estados de una solicitud de servicio
type EstadoSolicitud = 'Pendiente' | 'En proceso' | 'Completado';

// Estructura completa de una solicitud de servicio enviada por un cliente
type Solicitud = {
  id: string;                    // Identificador único de la solicitud
  // Datos del cliente
  nombre: string;                // Nombre completo del cliente
  telefono: string;              // Teléfono de contacto
  correo: string;                // Correo para enviar el reporte
  // Vehículo
  marca: string;                 // Marca del vehículo
  modelo: string;                // Modelo del vehículo
  año: string;                   // Año de fabricación
  placa: string;                 // Placa del vehículo
  kilometraje: string;           // Kilometraje actual
  // Servicio solicitado
  tipoServicio: string;          // Tipo de servicio del catálogo
  otroServicio: string;          // Descripción si el servicio es "Otro"
  descripcionProblema: string;   // Descripción del problema por el cliente
  fechaCita: string;             // Fecha de la cita agendada
  horaCita: string;              // Hora de la cita agendada
  estado: EstadoSolicitud;       // Estado actual de la solicitud
  mantenimiento: Mantenimiento | null; // null = sin registro de mantenimiento aún
};

// Estructura del registro técnico de mantenimiento realizado por el mecánico
type Mantenimiento = {
  marca: string;               // Marca del vehículo
  modelo: string;              // Modelo del vehículo
  placa: string;               // Placa del vehículo
  año: string;                 // Año de fabricación
  kilometraje: string;         // Kilometraje al momento del servicio
  fechaServicio: string;       // Fecha en que se realizó el servicio
  mecanicoAsignado: string;    // Nombre del mecánico que atendió
  diagnostico: string;         // Diagnóstico inicial del problema
  trabajoRealizado: string;    // Tipo de trabajo del catálogo
  otroTrabajo: string;         // Descripción si el trabajo fue "Otros"
  repuestosUtilizados: string; // Lista de repuestos usados
  diagnosticoRealizado: string;// Descripción paso a paso del trabajo
  costoManoObra: string;       // Costo de mano de obra en dólares
  costoRepuestos: string;      // Costo total de repuestos en dólares
  observaciones: string;       // Recomendaciones post-servicio
  fechaInicio: string;         // Fecha de inicio del servicio
  fechaFinalizacion: string;   // Fecha de finalización del servicio
};


// CONSTANTES

// Los mecánicos se cargan dinámicamente desde el backend al montar el componente

// Catálogo de tipos de trabajo para el dropdown del registro de mantenimiento
const TRABAJOS_OPCIONES = [
  'Cambio de aceite y filtro',
  'Revisión de frenos',
  'Alineación y balanceo',
  'Cambio de correa de distribución',
  'Revisión eléctrica',
  'Mantenimiento de suspensión',
  'Diagnóstico computarizado',
  'Revisión general',
  'Otros',
];

// Solicitudes de prueba que simulan registros enviados por clientes
// En producción estos datos vendrán del backend
// Lista vacía — las solicitudes reales vendrán del backend
const MOCK_SOLICITUDES: Solicitud[] = [];

// Retorna un objeto Mantenimiento con todos los campos vacíos
// Usado para inicializar el formulario de registro de mantenimiento
function formMantVacio(): Mantenimiento {
  return {
    marca: '', modelo: '', placa: '', año: '', kilometraje: '', fechaServicio: '',
    mecanicoAsignado: '', diagnostico: '', trabajoRealizado: '',
    otroTrabajo: '', repuestosUtilizados: '', diagnosticoRealizado: '',
    costoManoObra: '', costoRepuestos: '', observaciones: '',
    fechaInicio: '', fechaFinalizacion: '',
  };
}


// COMPONENTE PRINCIPAL

export default function ReportesClientesScreen() {
  // Bloquea el botón físico de atrás en Android mientras esta pantalla está activa
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  // Token JWT del mecánico autenticado
  const { token, user } = useAuth();

  // Lista de solicitudes de clientes
  const [lista, setLista] = useState<Solicitud[]>([]);
  // true mientras carga desde el backend
  const [cargando, setCargando] = useState(false);
  // Mensaje de error si la carga falla
  const [errorCarga, setErrorCarga] = useState('');

  // Lista de mecánicos cargada desde el backend
  const [mecanicosList, setMecanicosList] = useState<string[]>([]);
  // Error al cargar mecánicos
  const [mecError, setMecError] = useState('');

  // Función reutilizable para cargar la lista de mecánicos
  const cargarMecanicos = (tkn: string) => {
    setMecError('');
    mecanicosApi.listar(tkn)
      .then((data) => {
        const nombres = data
          .filter((m) => m.cuentaActiva)
          .map((m) => `${m.nombres} ${m.apellidos}`);
        setMecanicosList(nombres);
        if (nombres.length === 0) setMecError('No hay mecánicos activos registrados.');
      })
      .catch((err) => {
        setMecError(err?.message ?? 'No se pudo cargar la lista de mecánicos.');
      });
  };

  // Carga solicitudes y mecánicos al montar la pantalla
  // Recarga solicitudes y mecánicos cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      setCargando(true);
      setErrorCarga('');

      solicitudesApi.listar(token)
        .then((data: SolicitudBackend[]) => {
          const mapped: Solicitud[] = data
            // Todas las solicitudes que aún no tienen reporte enviado (no Completado)
            .filter((s) => s.estado !== 'Completado')
            .map((s) => ({
            id: s.id,
            nombre: s.nombreCliente,
            telefono: s.telefono,
            correo: s.correoCliente,
            marca: s.marca,
            modelo: s.modelo,
            año: s.anio,
            placa: s.placa,
            kilometraje: s.kilometraje,
            tipoServicio: s.tipoServicio,
            otroServicio: s.otroServicio,
            descripcionProblema: s.descripcionProblema,
            fechaCita: s.fechaCita,
            horaCita: s.horaCita,
            estado: (s.estado === 'En_proceso' ? 'En proceso' : s.estado) as EstadoSolicitud,
            mantenimiento: s.mantenimiento ? {
              marca: s.mantenimiento.marca,
              modelo: s.mantenimiento.modelo,
              placa: s.mantenimiento.placa,
              año: s.mantenimiento.año ?? s.anio,
              kilometraje: s.mantenimiento.kilometraje ?? s.kilometraje,
              fechaServicio: s.mantenimiento.fechaServicio,
              mecanicoAsignado: s.mantenimiento.mecanicoAsignado,
              diagnostico: s.mantenimiento.diagnostico,
              trabajoRealizado: s.mantenimiento.trabajoRealizado,
              otroTrabajo: s.mantenimiento.otroTrabajo,
              repuestosUtilizados: s.mantenimiento.repuestosUtilizados,
              diagnosticoRealizado: s.mantenimiento.diagnosticoRealizado,
              costoManoObra: String(s.mantenimiento.costoManoObra),
              costoRepuestos: String(s.mantenimiento.costoRepuestos),
              observaciones: s.mantenimiento.observaciones,
              fechaInicio: s.mantenimiento.fechaInicio,
              fechaFinalizacion: s.mantenimiento.fechaFinalizacion,
            } : null,
          }));
          setLista(mapped);
        })
        .catch((err: any) => {
          setErrorCarga(err?.message ?? 'No se pudieron cargar las solicitudes.');
        })
        .finally(() => setCargando(false));

      cargarMecanicos(token);
    }, [token, user?.id]),
  );

  // ESTADOS DEL MODAL EDITAR SOLICITUD 
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Solicitud>>({});
  const [editServDropdown, setEditServDropdown] = useState(false);

  // Estados de error — uno por campo del modal de edición
  const [errNombre, setErrNombre] = useState('');
  const [errTelefono, setErrTelefono] = useState('');
  const [errCorreo, setErrCorreo] = useState('');
  const [errMarca, setErrMarca] = useState('');
  const [errModelo, setErrModelo] = useState('');
  const [errAño, setErrAño] = useState('');
  const [errPlaca, setErrPlaca] = useState('');
  const [errKm, setErrKm] = useState('');
  const [errServicio, setErrServicio] = useState('');
  const [errOtroServicio, setErrOtroServicio] = useState('');
  const [errDescripcion, setErrDescripcion] = useState('');

  // ESTADOS DEL MODAL REGISTRO/EDITAR MANTENIMIENTO
  const [maintModal, setMaintModal] = useState(false);           // Visibilidad del modal
  const [maintId, setMaintId] = useState<string | null>(null); // ID de la solicitud a registrar
  const [maintForm, setMaintForm] = useState<Mantenimiento>(formMantVacio()); // Datos del formulario
  const [mecDropdown, setMecDropdown] = useState(false);           // Dropdown de mecánico abierto
  const [trabajoDropdown, setTrabajoDropdown] = useState(false);         // Dropdown de trabajo abierto

  // Estados de error del modal de mantenimiento
  const [errMaintMarca, setErrMaintMarca] = useState('');
  const [errMaintModelo, setErrMaintModelo] = useState('');
  const [errMaintPlaca, setErrMaintPlaca] = useState('');
  const [errMaintAño, setErrMaintAño] = useState('');
  const [errMaintKm, setErrMaintKm] = useState('');
  const [errMaintFechaServ, setErrMaintFechaServ] = useState('');
  const [errMaintMecAsinado, setErrMaintMecAsinado] = useState('');
  const [errMaintDiagnost, setErrMaintDiagnost] = useState('');
  const [errMaintTrabajo, setErrMaintTrabajo] = useState('');
  const [errMaintOtroTrabajo, setErrMaintOtroTrabajo] = useState('');
  const [errMaintRepuestos, setErrMaintRepuestos] = useState('');
  const [errMaintDiagReal, setErrMaintDiagReal] = useState('');
  const [errMaintManoObra, setErrMaintManoObra] = useState('');
  const [errMaintCostoRep, setErrMaintCostoRep] = useState('');
  const [errMaintObserv, setErrMaintObserv] = useState('');
  const [errMaintFechaInit, setErrMaintFechaInit] = useState('');
  const [errMaintFechaFinal, setErrMaintFechaFinal] = useState('');

  // ESTADOS DEL MODAL ENVIAR REPORTE
  const [sendModal, setSendModal] = useState(false);
  const [sendTarget, setSendTarget] = useState<Solicitud | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);   // Cargando mientras espera respuesta
  const [sendError, setSendError] = useState('');          // Error del backend si falla

  // Estado de guardado del modal de mantenimiento
  const [maintSaving, setMaintSaving] = useState(false);
  const [maintSaveError, setMaintSaveError] = useState('');

  // ESTADOS DEL MODAL ELIMINAR
  const [deleteModal, setDeleteModal] = useState(false);           // Visibilidad del modal
  const [deleteTarget, setDeleteTarget] = useState<Solicitud | null>(null); // Solicitud a eliminar

  // FUNCIÓN: ABRIR MODAL EDITAR
  // Pre-llena el formulario con los datos actuales de la solicitud
  const abrirEditar = (s: Solicitud) => {
    setEditId(s.id);
    setEditForm({ ...s });
    setEditServDropdown(false);
    // Limpia todos los errores al abrir el modal
    setErrNombre(''); setErrTelefono(''); setErrCorreo('');
    setErrMarca(''); setErrModelo(''); setErrAño('');
    setErrPlaca(''); setErrKm(''); setErrServicio('');
    setErrOtroServicio(''); setErrDescripcion('');
    setEditModal(true);
  };

  const guardarEditar = async () => {
    if (!editId || !token) return;

    const eNombre = validarNombreCompleto(editForm.nombre ?? '');
    const eTelefono = validarTelefono(editForm.telefono ?? '');
    const eCorreo = validarCorreoGmail(editForm.correo ?? '');
    const eMarca = validarSoloTexto(editForm.marca ?? '', 'La marca');
    const eModelo = validarModelo(editForm.modelo ?? '');
    const eAño = validarAño(editForm.año ?? '');
    const ePlaca = validarPlaca(editForm.placa ?? '');
    const eKm = validarSoloNumeros(editForm.kilometraje ?? '', 'El kilometraje');
    const eServicio = validarObligatorio(editForm.tipoServicio, 'El tipo de servicio');
    const eOtroServ = editForm.tipoServicio === 'Otro'
      ? validarOtroServicio(editForm.otroServicio ?? '')
      : null;
    const eDescripcion = validarTextoYNumeros(editForm.descripcionProblema ?? '', 'La descripción');

    setErrNombre(eNombre ?? '');
    setErrTelefono(eTelefono ?? '');
    setErrCorreo(eCorreo ?? '');
    setErrMarca(eMarca ?? '');
    setErrModelo(eModelo ?? '');
    setErrAño(eAño ?? '');
    setErrPlaca(ePlaca ?? '');
    setErrKm(eKm ?? '');
    setErrServicio(eServicio ?? '');
    setErrOtroServicio(eOtroServ ?? '');
    setErrDescripcion(eDescripcion ?? '');

    if ([eNombre, eTelefono, eCorreo, eMarca, eModelo, eAño, ePlaca, eKm,
      eServicio, eOtroServ, eDescripcion].some(Boolean)) return;

    try {
      await solicitudesApi.actualizar(editId, {
        nombreCliente: editForm.nombre ?? '',
        telefono: editForm.telefono ?? '',
        correoCliente: editForm.correo ?? '',
        marca: editForm.marca ?? '',
        modelo: editForm.modelo ?? '',
        anio: editForm.año ?? '',
        placa: editForm.placa ?? '',
        kilometraje: editForm.kilometraje ?? '',
        tipoServicio: editForm.tipoServicio ?? '',
        otroServicio: editForm.otroServicio ?? '',
        descripcionProblema: editForm.descripcionProblema ?? '',
        fechaCita: editForm.fechaCita ?? '',
        horaCita: editForm.horaCita ?? '',
      }, token);

      setLista((prev) => prev.map((x) => x.id === editId ? { ...x, ...editForm } as Solicitud : x));
      setEditModal(false);
    } catch {
      // Error de red silenciado — el modal permanece abierto para reintentar
    }
  };

  // FUNCIÓN: ABRIR MODAL MANTENIMIENTO
  // Si ya tiene mantenimiento, pre-llena con los datos existentes.
  // Si no, inicializa con los datos del vehículo de la solicitud.
  const abrirMantenimiento = (s: Solicitud) => {
    setMaintId(s.id);
    setMaintForm(s.mantenimiento
      ? { ...s.mantenimiento }          // Pre-llena con el mantenimiento existente
      : { ...formMantVacio(), marca: s.marca, modelo: s.modelo, placa: s.placa, año: s.año, kilometraje: s.kilometraje } // Datos del vehículo
    );
    setMecDropdown(false);
    setTrabajoDropdown(false);
    // Recarga la lista de mecánicos cada vez que se abre el modal
    if (token) cargarMecanicos(token);
    // Limpia todos los errores al abrir el modal
    setErrMaintMarca(''); setErrMaintModelo(''); setErrMaintPlaca('');
    setErrMaintAño(''); setErrMaintKm('');
    setErrMaintFechaServ(''); setErrMaintMecAsinado(''); setErrMaintDiagnost('');
    setErrMaintTrabajo(''); setErrMaintOtroTrabajo(''); setErrMaintRepuestos('');
    setErrMaintDiagReal(''); setErrMaintManoObra(''); setErrMaintCostoRep('');
    setErrMaintObserv(''); setErrMaintFechaInit(''); setErrMaintFechaFinal('');
    setMaintModal(true);
  };

  // FUNCIÓN: GUARDAR MANTENIMIENTO
  // Guarda el registro de mantenimiento y cambia el estado a "Completado"
  const guardarMantenimiento = async () => {
    if (!maintId) return;

    const eMarca = validarSoloTexto(maintForm.marca ?? '', 'La marca');
    const eModelo = validarModelo(maintForm.modelo ?? '');
    const ePlaca = validarPlaca(maintForm.placa ?? '');
    const eAño = validarAño(maintForm.año ?? '');
    const eKm = validarSoloNumeros(maintForm.kilometraje ?? '', 'El kilometraje');
    const eFechaServ = validarFecha(maintForm.fechaServicio ?? '');
    const eMecAsignado = validarObligatorio(maintForm.mecanicoAsignado, 'El mecánico asignado');
    const eDiagnost = validarTextoYNumeros(maintForm.diagnostico ?? '', 'El diagnóstico');
    const eTrabajo = validarObligatorio(maintForm.trabajoRealizado, 'El trabajo realizado');
    const eOtroTrab = maintForm.trabajoRealizado === 'Otros'
      ? validarOtroServicio(maintForm.otroTrabajo ?? '')
      : null;
    const eRepuestos = validarTextoYNumeros(maintForm.repuestosUtilizados ?? '', 'Los repuestos utilizados');
    const eDiagReal = validarTextoYNumeros(maintForm.diagnosticoRealizado ?? '', 'El diagnóstico realizado');
    const eManoObra = validarCostoObligatorio(maintForm.costoManoObra ?? '', 'El costo de mano de obra');
    const eCostoRep = validarCostoObligatorio(maintForm.costoRepuestos ?? '', 'El costo de repuestos');
    const eObserv = validarTextoYNumeros(maintForm.observaciones ?? '', 'Las observaciones');
    const eFechaInit = validarFecha(maintForm.fechaInicio ?? '');
    const eFechaFinal = validarFecha(maintForm.fechaFinalizacion ?? '');

    setErrMaintMarca(eMarca ?? '');
    setErrMaintModelo(eModelo ?? '');
    setErrMaintPlaca(ePlaca ?? '');
    setErrMaintAño(eAño ?? '');
    setErrMaintKm(eKm ?? '');
    setErrMaintFechaServ(eFechaServ ?? '');
    setErrMaintMecAsinado(eMecAsignado ?? '');
    setErrMaintDiagnost(eDiagnost ?? '');
    setErrMaintTrabajo(eTrabajo ?? '');
    setErrMaintOtroTrabajo(eOtroTrab ?? '');
    setErrMaintRepuestos(eRepuestos ?? '');
    setErrMaintDiagReal(eDiagReal ?? '');
    setErrMaintManoObra(eManoObra ?? '');
    setErrMaintCostoRep(eCostoRep ?? '');
    setErrMaintObserv(eObserv ?? '');
    setErrMaintFechaInit(eFechaInit ?? '');
    setErrMaintFechaFinal(eFechaFinal ?? '');

    const errores = [eMarca, eModelo, ePlaca, eAño, eKm, eFechaServ, eMecAsignado, eDiagnost, eTrabajo,
      eOtroTrab, eRepuestos, eDiagReal, eManoObra, eCostoRep, eObserv, eFechaInit, eFechaFinal].filter(Boolean);

    if (errores.length > 0) return;

    if (!token) return;
    setMaintSaving(true);
    setMaintSaveError('');

    try {
      await mantenimientosApi.crear({
        solicitudId: maintId,
        marca: maintForm.marca,
        modelo: maintForm.modelo,
        placa: maintForm.placa,
        mecanicoAsignado: maintForm.mecanicoAsignado,
        diagnostico: maintForm.diagnostico,
        trabajoRealizado: maintForm.trabajoRealizado,
        otroTrabajo: maintForm.otroTrabajo,
        repuestosUtilizados: maintForm.repuestosUtilizados,
        diagnosticoRealizado: maintForm.diagnosticoRealizado,
        observaciones: maintForm.observaciones,
        costoManoObra: maintForm.costoManoObra,
        costoRepuestos: maintForm.costoRepuestos,
        fechaServicio: maintForm.fechaServicio,
        fechaInicio: maintForm.fechaInicio,
        fechaFinalizacion: maintForm.fechaFinalizacion,
      }, token);

      // Actualiza el estado local y cierra el modal
      setLista((prev) => prev.map((x) =>
        x.id === maintId
          ? { ...x, mantenimiento: { ...maintForm }, estado: 'Completado' as EstadoSolicitud }
          : x
      ));
      setMaintModal(false);
    } catch (err: any) {
      setMaintSaveError(err?.message ?? 'Error al guardar el mantenimiento. Intenta de nuevo.');
    } finally {
      setMaintSaving(false);
    }
  };

  // FUNCIÓN: ABRIR MODAL ELIMINAR
  const eliminar = (s: Solicitud) => {
    setDeleteTarget(s);                 // Guarda la solicitud a eliminar
    setDeleteModal(true);               // Abre el modal de confirmación
  };

  // FUNCIÓN: CONFIRMAR ELIMINAR
  // Llama al backend para eliminar la solicitud y luego la quita del estado local
  const confirmarEliminar = async () => {
    if (!deleteTarget || !token) return;
    try {
      await solicitudesApi.eliminar(deleteTarget.id, token);
      setLista((p) => p.filter((x) => x.id !== deleteTarget.id));
    } catch {
      // Si falla el backend, se cierra el modal sin modificar la lista
    } finally {
      setDeleteModal(false);
      setDeleteTarget(null);            // Limpia el target
    }
  };

  // FUNCIÓN: ABRIR MODAL ENVIAR
  const abrirEnviar = (s: Solicitud) => {
    setSendTarget(s);
    setSendSuccess(false);
    setSendError('');
    setSendLoading(false);
    setSendModal(true);
  };

  // FUNCIÓN: CONFIRMAR ENVÍO
  const confirmarEnvio = async () => {
    if (!sendTarget || !token) return;
    setSendLoading(true);
    setSendError('');
    try {
      await reportesApi.enviar(sendTarget.id, token);
      // Solo quitar de lista y mostrar éxito si el backend confirmó OK
      setLista((prev) => prev.filter((x) => x.id !== sendTarget.id));
      setSendSuccess(true);
    } catch (err: any) {
      setSendError(err?.message ?? 'No se pudo enviar el reporte. Verifica la conexión.');
    } finally {
      setSendLoading(false);
    }
  };


  // RENDER

  return (
    // Contenedor raíz que ocupa toda la pantalla
    <View style={styles.page}>

      {/* Navbar del mecánico con "reportes" como pestaña activa */}
      <NavbarMecanico activeTab="reportes" />

      {/* ScrollView principal con la lista de solicitudes */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título centrado */}
        <Text style={styles.screenTitle}>Reportes de clientes</Text>
        <Text style={styles.screenSubtitle}>Gestiona las solicitudes y registros de mantenimiento.</Text>

        {/* Estado de carga */}
        {cargando && (
          <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>Cargando solicitudes...</Text>
        )}

        {/* Error de carga */}
        {!cargando && errorCarga ? (
          <Text style={{ color: '#EF4444', textAlign: 'center', marginTop: 20, paddingHorizontal: 16 }}>
            ⚠️ {errorCarga}
          </Text>
        ) : null}

        {/* Lista vacía */}
        {!cargando && !errorCarga && lista.length === 0 && (
          <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>
            No hay solicitudes pendientes.
          </Text>
        )}

        {/* Itera sobre la lista de solicitudes para renderizar una tarjeta por cada una */}
        {lista.map((s) => (
          <View key={s.id} style={styles.rowCard}>

            {/* Nombre completo del cliente */}
            <Text style={styles.clientName}>{s.nombre}</Text>

            {/* Fila: ícono de teléfono + número de contacto */}
            <View style={styles.metaRow}>
              <FontAwesome name="phone" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>{s.telefono}</Text>
            </View>

            {/* Fila: ícono de carro + marca/modelo/placa */}
            <View style={styles.metaRow}>
              <FontAwesome name="car" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>{s.marca} {s.modelo} · {s.placa}</Text>
            </View>

            {/* Fila: ícono de tuerca + estado del mantenimiento
                Convierte "Pendiente" a "En proceso" para mostrar al mecánico */}
            <View style={styles.metaRow}>
              <FontAwesome name="wrench" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>
                Estado mantenimiento: {s.estado === 'Pendiente' ? 'En proceso' : s.estado}
              </Text>
            </View>

            {/* Línea divisoria entre la info y los botones */}
            <View style={styles.divider} />

            {/* Fila de botones de acción */}
            <View style={styles.actionsRow}>

              {/* Botón Editar: abre el modal de edición de la solicitud */}
              <Pressable
                onPress={() => abrirEditar(s)}
                style={({ pressed }) => [styles.actionBtn, styles.btnEdit, pressed && styles.btnEditPressed]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    <FontAwesome name="pencil" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnEditText, pressed && styles.btnEditTextPressed]}>
                      Editar
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Botón Eliminar: abre el modal de confirmación de eliminación */}
              <Pressable
                onPress={() => eliminar(s)}
                style={({ pressed }) => [styles.actionBtn, styles.btnDelete, pressed && styles.btnDeletePressed]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    <FontAwesome name="trash" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnDeleteText, pressed && styles.btnDeleteTextPressed]}>
                      Eliminar
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Botón Registro/Editar mantenimiento:
                  Muestra "Editar mantenimiento" (naranja) si ya tiene registro,
                  o "Registro mantenimiento" (verde) si aún no tiene */}
              {s.mantenimiento ? (
                <Pressable
                  onPress={() => abrirMantenimiento(s)}
                  style={({ pressed }) => [styles.actionBtn, styles.btnEditMaint, pressed && styles.btnEditMaintPressed]}
                >
                  {({ pressed }) => (
                    <View style={styles.btnInnerRow}>
                      <FontAwesome name="edit" size={12} color="#FFFFFF" style={styles.btnIcon} />
                      <Text style={[styles.actionBtnText, styles.btnEditMaintText, pressed && styles.btnEditMaintTextPressed]}>
                        Editar mantenimiento
                      </Text>
                    </View>
                  )}
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => abrirMantenimiento(s)}
                  style={({ pressed }) => [styles.actionBtn, styles.btnMaint, pressed && styles.btnMaintPressed]}
                >
                  {({ pressed }) => (
                    <View style={styles.btnInnerRow}>
                      <FontAwesome name="wrench" size={12} color="#FFFFFF" style={styles.btnIcon} />
                      <Text style={[styles.actionBtnText, styles.btnMaintText, pressed && styles.btnMaintTextPressed]}>
                        Registro mantenimiento
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}

              {/* Botón Enviar reporte: siempre visible.
                  Activo (morado) cuando hay mantenimiento registrado.
                  Bloqueado (gris semitransparente) cuando no hay mantenimiento.
                  disabled evita que sea presionable cuando está bloqueado. */}
              <Pressable
                onPress={() => s.mantenimiento ? abrirEnviar(s) : null}
                disabled={!s.mantenimiento}
                style={[
                  styles.actionBtn,
                  s.mantenimiento ? styles.btnSend : styles.btnSendLocked, // Estilo según estado
                ]}
              >
                <View style={styles.btnInnerRow}>
                  {/* Ícono send cuando activo, lock cuando bloqueado */}
                  <FontAwesome
                    name={s.mantenimiento ? 'send' : 'lock'}
                    size={12}
                    color={s.mantenimiento ? '#FFFFFF' : '#64748B'} // Blanco activo, gris bloqueado
                    style={styles.btnIcon}
                  />
                  <Text style={[
                    styles.actionBtnText,
                    s.mantenimiento ? styles.btnSendText : styles.btnSendLockedText,
                  ]}>
                    Enviar reporte
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 
          MODAL EDITAR SOLICITUD
          Permite al mecánico modificar los datos del cliente, vehículo y servicio.*/}
      <Modal visible={editModal} animationType="fade" transparent onRequestClose={() => setEditModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.modalTitle}>Editar solicitud</Text>
                <Text style={styles.modalSubtitle}>Modifica los datos del cliente y su vehículo.</Text>
              </View>
              {/* Botón X rojo para cerrar el modal */}
              <Pressable onPress={() => setEditModal(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>

              {/* SECCIÓN: DATOS PERSONALES */}
              <View style={[styles.modalSection, styles.modalSectionFirst]}>
                <Text style={styles.modalSectionTitle}>Datos personales</Text>

                <Text style={[styles.label, styles.labelFirstInSection]}>Nombre completo</Text>
                <TextInput
                  style={[styles.input, errNombre ? styles.inputError : null]}
                  placeholder="Nombre y apellido (mín. 2 palabras)"
                  placeholderTextColor="#64748B"
                  value={editForm.nombre}
                  onChangeText={(t) => { setEditForm((p) => ({ ...p, nombre: t })); setErrNombre(''); }}
                />
                {errNombre ? <Text style={styles.errorText}>{errNombre}</Text> : null}

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={[styles.input, errTelefono ? styles.inputError : null]}
                  placeholder="10 dígitos sin espacios"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={editForm.telefono}
                  onChangeText={(t) => { setEditForm((p) => ({ ...p, telefono: t })); setErrTelefono(''); }}
                />
                {errTelefono ? <Text style={styles.errorText}>{errTelefono}</Text> : null}

                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={[styles.input, errCorreo ? styles.inputError : null]}
                  placeholder="correo@gmail.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={editForm.correo}
                  onChangeText={(t) => { setEditForm((p) => ({ ...p, correo: t })); setErrCorreo(''); }}
                />
                {errCorreo ? <Text style={styles.errorText}>{errCorreo}</Text> : null}
              </View>

              {/* SECCIÓN: INFORMACIÓN DEL VEHÍCULO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Información del vehículo</Text>

                <Text style={[styles.label, styles.labelFirstInSection]}>Marca</Text>
                <TextInput
                  style={[styles.input, errMarca ? styles.inputError : null]}
                  placeholder="Marca"
                  placeholderTextColor="#64748B"
                  value={editForm.marca}
                  onChangeText={(t) => { setEditForm((p) => ({ ...p, marca: t })); setErrMarca(''); }}
                />
                {errMarca ? <Text style={styles.errorText}>{errMarca}</Text> : null}

                {/* Fila: Modelo + Año */}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput
                      style={[styles.input, errModelo ? styles.inputError : null]}
                      placeholder="Ej: Corolla-2019"
                      placeholderTextColor="#64748B"
                      value={editForm.modelo}
                      onChangeText={(t) => { setEditForm((p) => ({ ...p, modelo: t })); setErrModelo(''); }}
                    />
                    {errModelo ? <Text style={styles.errorText} numberOfLines={2}>{errModelo}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Año</Text>
                    <TextInput
                      style={[styles.input, errAño ? styles.inputError : null]}
                      placeholder="Año"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      maxLength={4}
                      value={editForm.año}
                      onChangeText={(t) => { setEditForm((p) => ({ ...p, año: t })); setErrAño(''); }}
                    />
                    {errAño ? <Text style={styles.errorText} numberOfLines={2}>{errAño}</Text> : null}
                  </View>
                </View>

                {/* Fila: Placa + Kilometraje */}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Placa</Text>
                    <TextInput
                      style={[styles.input, errPlaca ? styles.inputError : null]}
                      placeholder="Placa"
                      placeholderTextColor="#64748B"
                      value={editForm.placa}
                      onChangeText={(t) => { setEditForm((p) => ({ ...p, placa: t })); setErrPlaca(''); }}
                    />
                    {errPlaca ? <Text style={styles.errorText} numberOfLines={2}>{errPlaca}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Kilometraje</Text>
                    <TextInput
                      style={[styles.input, errKm ? styles.inputError : null]}
                      placeholder="km"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      value={editForm.kilometraje}
                      onChangeText={(t) => { setEditForm((p) => ({ ...p, kilometraje: t })); setErrKm(''); }}
                    />
                    {errKm ? <Text style={styles.errorText} numberOfLines={2}>{errKm}</Text> : null}
                  </View>
                </View>
              </View>

              {/* SECCIÓN: TIPO DE SERVICIO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Tipo de servicio</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Servicio solicitado</Text>
                <Pressable
                  style={[styles.dropdown, editServDropdown && styles.dropdownOpen, errServicio ? styles.inputError : null]}
                  onPress={() => setEditServDropdown((v) => !v)}
                >
                  <Text style={editForm.tipoServicio ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {editForm.tipoServicio || 'Selecciona un servicio'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{editServDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {errServicio ? <Text style={styles.errorText}>{errServicio}</Text> : null}
                {editServDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {['Cambio de aceite', 'Frenos', 'Suspensión', 'Motor', 'Electricidad', 'Aire acondicionado', 'Revisión general', 'Otro'].map((opt, i, arr) => (
                      <Pressable key={opt}
                        style={[styles.dropdownItem, i === arr.length - 1 && styles.dropdownItemLast, editForm.tipoServicio === opt && styles.dropdownItemActive]}
                        onPress={() => { setEditForm((p) => ({ ...p, tipoServicio: opt })); setEditServDropdown(false); setErrServicio(''); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                {/* Campo "Describe el servicio" — solo visible cuando se selecciona "Otro" */}
                {editForm.tipoServicio === 'Otro' && (
                  <>
                    <Text style={styles.label}>Describe el servicio</Text>
                    <TextInput
                      style={[styles.input, errOtroServicio ? styles.inputError : null]}
                      placeholder="Solo texto, sin números ni símbolos"
                      placeholderTextColor="#64748B"
                      value={editForm.otroServicio}
                      onChangeText={(t) => { setEditForm((p) => ({ ...p, otroServicio: t })); setErrOtroServicio(''); }}
                    />
                    {errOtroServicio ? <Text style={styles.errorText}>{errOtroServicio}</Text> : null}
                  </>
                )}

                <Text style={styles.label}>Descripción del problema</Text>
                <TextInput
                  style={[styles.input, styles.textarea, errDescripcion ? styles.inputError : null]}
                  placeholder="Describe el problema..."
                  placeholderTextColor="#64748B"
                  multiline
                  value={editForm.descripcionProblema}
                  onChangeText={(t) => { setEditForm((p) => ({ ...p, descripcionProblema: t })); setErrDescripcion(''); }}
                />
                {errDescripcion ? <Text style={styles.errorText}>{errDescripcion}</Text> : null}
              </View>

              {/* Botón guardar cambios — blanco en reposo, azul al presionar */}
              <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={guardarEditar}>
                {({ pressed }) => <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>Guardar cambios</Text>}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/*
          MODAL REGISTRO / EDITAR MANTENIMIENTO
          Formulario técnico completo que el mecánico llena después de atender el vehículo.*/}
      <Modal visible={maintModal} animationType="fade" transparent onRequestClose={() => setMaintModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.modalTitle}>Registro de mantenimiento</Text>
                <Text style={styles.modalSubtitle}>Completa el reporte técnico del vehículo.</Text>
              </View>
              <Pressable onPress={() => setMaintModal(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>

              {/* SECCIÓN: DATOS DEL VEHÍCULO */}
              <View style={[styles.modalSection, styles.modalSectionFirst]}>
                <Text style={styles.modalSectionTitle}>Datos del vehículo</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Marca</Text>
                <TextInput style={[styles.input, errMaintMarca ? styles.inputError : null]} placeholder="Marca" placeholderTextColor="#64748B"
                  value={maintForm.marca} onChangeText={(t) => { setMaintForm((p) => ({ ...p, marca: t })); setErrMaintMarca(''); }} />
                {errMaintMarca ? <Text style={styles.errorText}>{errMaintMarca}</Text> : null}

                {/* Modelo — ancho completo para ver la validación completa */}
                <Text style={styles.label}>Modelo</Text>
                <TextInput style={[styles.input, errMaintModelo ? styles.inputError : null]} placeholder="Ej: Corolla-2019" placeholderTextColor="#64748B"
                  value={maintForm.modelo} onChangeText={(t) => { setMaintForm((p) => ({ ...p, modelo: t })); setErrMaintModelo(''); }} />
                {errMaintModelo ? <Text style={styles.errorText}>{errMaintModelo}</Text> : null}

                {/* Placa — ancho completo para ver la validación completa */}
                <Text style={styles.label}>Placa</Text>
                <TextInput style={[styles.input, errMaintPlaca ? styles.inputError : null]} placeholder="Placa" placeholderTextColor="#64748B"
                  value={maintForm.placa} onChangeText={(t) => { setMaintForm((p) => ({ ...p, placa: t })); setErrMaintPlaca(''); }} />
                {errMaintPlaca ? <Text style={styles.errorText}>{errMaintPlaca}</Text> : null}

                {/* Fila: Año + Kilometraje */}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Año</Text>
                    <TextInput style={[styles.input, errMaintAño ? styles.inputError : null]} placeholder="Año" placeholderTextColor="#64748B"
                      keyboardType="numeric" maxLength={4}
                      value={maintForm.año}
                      onChangeText={(t) => { setMaintForm((p) => ({ ...p, año: t })); setErrMaintAño(''); }} />
                    {errMaintAño ? <Text style={styles.errorText} numberOfLines={2}>{errMaintAño}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Kilometraje</Text>
                    <TextInput style={[styles.input, errMaintKm ? styles.inputError : null]} placeholder="km" placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      value={maintForm.kilometraje}
                      onChangeText={(t) => { setMaintForm((p) => ({ ...p, kilometraje: t })); setErrMaintKm(''); }} />
                    {errMaintKm ? <Text style={styles.errorText} numberOfLines={2}>{errMaintKm}</Text> : null}
                  </View>
                </View>
                <Text style={styles.label}>Fecha del servicio</Text>
                <TextInput style={[styles.input, errMaintFechaServ ? styles.inputError : null]} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                  value={maintForm.fechaServicio} onChangeText={(t) => { setMaintForm((p) => ({ ...p, fechaServicio: t })); setErrMaintFechaServ(''); }} />
                {errMaintFechaServ ? <Text style={styles.errorText}>{errMaintFechaServ}</Text> : null}
              </View>

              {/* SECCIÓN: MECÁNICO ASIGNADO
                  Dropdown con la lista de mecánicos registrados en el sistema */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mecánico asignado</Text>
                <Pressable style={[styles.dropdown, mecDropdown && styles.dropdownOpen, errMaintMecAsinado ? styles.inputError : null]}
                  onPress={() => { setTrabajoDropdown(false); setMecDropdown((v) => !v); }}>
                  <Text style={maintForm.mecanicoAsignado ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {maintForm.mecanicoAsignado || 'Selecciona un mecánico'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{mecDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {errMaintMecAsinado ? <Text style={styles.errorText}>{errMaintMecAsinado}</Text> : null}
                {mecDropdown && (
                  <View style={styles.dropdownList}>
                    {mecError ? (
                      <View style={{ padding: 14 }}>
                        <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{mecError}</Text>
                      </View>
                    ) : mecanicosList.length === 0 ? (
                      <View style={{ padding: 14 }}>
                        <Text style={{ color: '#64748B', fontSize: 13, textAlign: 'center' }}>Cargando mecánicos...</Text>
                      </View>
                    ) : (
                      mecanicosList.map((m, i) => (
                        <Pressable key={m}
                          style={[styles.dropdownItem, i === mecanicosList.length - 1 && styles.dropdownItemLast, maintForm.mecanicoAsignado === m && styles.dropdownItemActive]}
                          onPress={() => { setMaintForm((p) => ({ ...p, mecanicoAsignado: m })); setMecDropdown(false); setErrMaintMecAsinado(''); }}>
                          <Text style={styles.dropdownItemText}>{m}</Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                )}
              </View>

              {/* SECCIÓN: DIAGNÓSTICO INICIAL */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Diagnóstico inicial</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Diagnóstico</Text>
                <Text style={styles.labelHint}>Descripción detallada de lo que presenta el vehículo.</Text>
                <TextInput style={[styles.input, styles.textarea, errMaintDiagnost ? styles.inputError : null]} placeholder="Describe detalladamente el problema..." placeholderTextColor="#64748B" multiline
                  value={maintForm.diagnostico} onChangeText={(t) => { setMaintForm((p) => ({ ...p, diagnostico: t })); setErrMaintDiagnost(''); }} />
                {errMaintDiagnost ? <Text style={styles.errorText}>{errMaintDiagnost}</Text> : null}
              </View>

              {/* SECCIÓN: TRABAJO REALIZADO
                  Dropdown del catálogo + campo extra si es "Otros" */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Trabajo realizado</Text>
                <Pressable style={[styles.dropdown, trabajoDropdown && styles.dropdownOpen, errMaintTrabajo ? styles.inputError : null]}
                  onPress={() => { setMecDropdown(false); setTrabajoDropdown((v) => !v); }}>
                  <Text style={maintForm.trabajoRealizado ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {maintForm.trabajoRealizado || 'Selecciona el trabajo'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{trabajoDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {errMaintTrabajo ? <Text style={styles.errorText}>{errMaintTrabajo}</Text> : null}
                {trabajoDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {TRABAJOS_OPCIONES.map((opt, i) => (
                      <Pressable key={opt}
                        style={[styles.dropdownItem, i === TRABAJOS_OPCIONES.length - 1 && styles.dropdownItemLast, maintForm.trabajoRealizado === opt && styles.dropdownItemActive]}
                        onPress={() => { setMaintForm((p) => ({ ...p, trabajoRealizado: opt })); setTrabajoDropdown(false); setErrMaintTrabajo(''); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {/* Campo extra solo visible cuando el trabajo es "Otros" */}
                {maintForm.trabajoRealizado === 'Otros' && (
                  <>
                    <Text style={styles.label}>Describe el trabajo realizado</Text>
                    <TextInput style={[styles.input, errMaintOtroTrabajo ? styles.inputError : null]} placeholder="Describe brevemente..." placeholderTextColor="#64748B"
                      value={maintForm.otroTrabajo} onChangeText={(t) => { setMaintForm((p) => ({ ...p, otroTrabajo: t })); setErrMaintOtroTrabajo(''); }} />
                    {errMaintOtroTrabajo ? <Text style={styles.errorText}>{errMaintOtroTrabajo}</Text> : null}
                  </>
                )}
                <Text style={styles.label}>Repuestos utilizados</Text>
                <TextInput style={[styles.input, styles.textarea, errMaintRepuestos ? styles.inputError : null]} placeholder="Lista los repuestos utilizados..." placeholderTextColor="#64748B" multiline
                  value={maintForm.repuestosUtilizados} onChangeText={(t) => { setMaintForm((p) => ({ ...p, repuestosUtilizados: t })); setErrMaintRepuestos(''); }} />
                {errMaintRepuestos ? <Text style={styles.errorText}>{errMaintRepuestos}</Text> : null}
                <Text style={styles.label}>Diagnóstico realizado</Text>
                <Text style={styles.labelHint}>Describe paso a paso lo que se realizó.</Text>
                <TextInput style={[styles.input, styles.textarea, errMaintDiagReal ? styles.inputError : null]} placeholder="Describe paso a paso el trabajo..." placeholderTextColor="#64748B" multiline
                  value={maintForm.diagnosticoRealizado} onChangeText={(t) => { setMaintForm((p) => ({ ...p, diagnosticoRealizado: t })); setErrMaintDiagReal(''); }} />
                {errMaintDiagReal ? <Text style={styles.errorText}>{errMaintDiagReal}</Text> : null}
              </View>

              {/* SECCIÓN: COSTOS DEL SERVICIO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Costos del servicio</Text>
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.label, styles.labelFirstInSection]}>Mano de obra ($)</Text>
                    <TextInput style={[styles.input, errMaintManoObra ? styles.inputError : null]} placeholder="0.00" placeholderTextColor="#64748B" keyboardType="decimal-pad"
                      value={maintForm.costoManoObra} onChangeText={(t) => { setMaintForm((p) => ({ ...p, costoManoObra: t })); setErrMaintManoObra(''); }} />
                    {errMaintManoObra ? <Text style={styles.errorText} numberOfLines={2}>{errMaintManoObra}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.label, styles.labelFirstInSection]}>Costo repuestos ($)</Text>
                    <TextInput style={[styles.input, errMaintCostoRep ? styles.inputError : null]} placeholder="0.00" placeholderTextColor="#64748B" keyboardType="decimal-pad"
                      value={maintForm.costoRepuestos} onChangeText={(t) => { setMaintForm((p) => ({ ...p, costoRepuestos: t })); setErrMaintCostoRep(''); }} />
                    {errMaintCostoRep ? <Text style={styles.errorText} numberOfLines={2}>{errMaintCostoRep}</Text> : null}
                  </View>
                </View>
              </View>

              {/* SECCIÓN: OBSERVACIONES Y FECHAS */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Observaciones y fechas</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Observaciones</Text>
                <Text style={styles.labelHint}>Recomendaciones para el cuidado posterior del vehículo.</Text>
                <TextInput style={[styles.input, styles.textarea, errMaintObserv ? styles.inputError : null]} placeholder="Recomendaciones post-servicio..." placeholderTextColor="#64748B" multiline
                  value={maintForm.observaciones} onChangeText={(t) => { setMaintForm((p) => ({ ...p, observaciones: t })); setErrMaintObserv(''); }} />
                {errMaintObserv ? <Text style={styles.errorText}>{errMaintObserv}</Text> : null}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Fecha de inicio</Text>
                    <TextInput style={[styles.input, errMaintFechaInit ? styles.inputError : null]} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                      value={maintForm.fechaInicio} onChangeText={(t) => { setMaintForm((p) => ({ ...p, fechaInicio: t })); setErrMaintFechaInit(''); }} />
                    {errMaintFechaInit ? <Text style={styles.errorText} numberOfLines={2}>{errMaintFechaInit}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Fecha de finalización</Text>
                    <TextInput style={[styles.input, errMaintFechaFinal ? styles.inputError : null]} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                      value={maintForm.fechaFinalizacion} onChangeText={(t) => { setMaintForm((p) => ({ ...p, fechaFinalizacion: t })); setErrMaintFechaFinal(''); }} />
                    {errMaintFechaFinal ? <Text style={styles.errorText} numberOfLines={2}>{errMaintFechaFinal}</Text> : null}
                  </View>
                </View>
              </View>

              {/* Botón guardar reporte — blanco en reposo, azul al presionar */}
              {maintSaveError ? (
                <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>
                  {maintSaveError}
                </Text>
              ) : null}
              <Pressable
                style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed, maintSaving && { opacity: 0.6 }]}
                onPress={guardarMantenimiento}
                disabled={maintSaving}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                    {maintSaving ? 'Guardando...' : 'Guardar reporte'}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 
          MODAL ENVIAR REPORTE
          Pide confirmación antes de enviar el reporte al correo del cliente.
          Muestra pantalla de éxito con ícono verde después del envío. */}
      <Modal visible={sendModal} animationType="fade" transparent
        onRequestClose={() => { if (!sendLoading) { setSendModal(false); setSendSuccess(false); setSendError(''); } }}>
        <View style={styles.sendModalOverlay}>
          <View style={styles.sendModalCard}>
            {sendSuccess ? (
              // PANTALLA DE ÉXITO
              <>
                <Text style={styles.sendModalTitle}>✅ Reporte enviado</Text>
                <Text style={styles.sendModalBody}>
                  El reporte fue enviado exitosamente al correo de{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.nombre}</Text>.
                </Text>
                <Pressable style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed]}
                  onPress={() => { setSendModal(false); setSendSuccess(false); setSendError(''); }}>
                  <Text style={styles.sendModalBtnText}>Cerrar</Text>
                </Pressable>
              </>
            ) : (
              // PANTALLA DE CONFIRMACIÓN
              <>
                <Text style={styles.sendModalTitle}>Enviar reporte</Text>
                <Text style={styles.sendModalBody}>
                  ¿Deseas enviar el siguiente reporte al señor{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.nombre}</Text>
                  {' '}a su correo personal{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.correo}</Text>?
                </Text>
                {/* Mensaje de error si el envío falló */}
                {sendError ? (
                  <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
                    ⚠️ {sendError}
                  </Text>
                ) : null}
                <View style={styles.sendModalBtns}>
                  <Pressable
                    style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed, sendLoading && { opacity: 0.6 }]}
                    onPress={confirmarEnvio}
                    disabled={sendLoading}>
                    <Text style={styles.sendModalBtnText}>{sendLoading ? 'Enviando...' : 'Enviar al correo'}</Text>
                  </Pressable>
                  {/* Botón cancelar: cierra el modal sin enviar */}
                  <Pressable
                    style={({ pressed }) => [styles.sendModalBtnCancel, pressed && styles.sendModalBtnCancelPressed, sendLoading && { opacity: 0.4 }]}
                    onPress={() => { if (!sendLoading) { setSendModal(false); setSendSuccess(false); setSendError(''); } }}
                    disabled={sendLoading}>
                    <Text style={styles.sendModalBtnCancelText}>Cancelar envío</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 
          MODAL CONFIRMAR ELIMINAR
          Pide confirmación antes de eliminar permanentemente un registro.
          Botón rojo "Eliminar" + botón azul "Cancelar".*/}
      <Modal visible={deleteModal} animationType="fade" transparent onRequestClose={() => setDeleteModal(false)}>
        <View style={styles.sendModalOverlay}>
          <View style={styles.sendModalCard}>
            <Text style={styles.sendModalTitle}>¿Eliminar registro?</Text>
            <Text style={styles.sendModalBody}>
              ¿Estás seguro de que deseas eliminar el registro de{' '}
              {/* Nombre del cliente resaltado en azul */}
              <Text style={styles.sendModalHighlight}>{deleteTarget?.nombre}</Text>?{'\n'}
              Esta acción no se puede deshacer.
            </Text>
            <View style={styles.sendModalBtns}>
              {/* Botón rojo: confirma la eliminación */}
              <Pressable
                style={({ pressed }) => [styles.sendModalBtnDelete, pressed && styles.sendModalBtnDeletePressed]}
                onPress={confirmarEliminar}
              >
                <Text style={styles.sendModalBtnText}>Eliminar</Text>
              </Pressable>
              {/* Botón azul: cancela y cierra el modal */}
              <Pressable
                style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed]}
                onPress={() => { setDeleteModal(false); setDeleteTarget(null); }}
              >
                <Text style={styles.sendModalBtnText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
