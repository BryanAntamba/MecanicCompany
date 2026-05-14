// ReportesClientes.tsx
// Pantalla principal del mecánico para gestionar las solicitudes de servicio.
// Permite: editar solicitudes, registrar/editar mantenimientos, eliminar registros
// y enviar el reporte técnico al correo del cliente.

// Hook de React para manejar estado local del componente
import { useState } from 'react';

// Componentes nativos de React Native
import {
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

// Hoja de estilos compartida entre ReportesClientes e historial
import styles from '@/Styles/ReportesClientes';

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

// Lista de mecánicos disponibles para asignar en el registro de mantenimiento
// En producción vendrá del backend (lista de mecánicos registrados en GestionMecanicos)
const MECANICOS_DISPONIBLES = [
  'Luis Ramírez',
  'Carla Mendoza',
  'Diego Torres',
  'Bryan Justicia',
];

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
const MOCK_SOLICITUDES: Solicitud[] = [
  {
    id: 's-1',
    nombre: 'Carlos Pérez',
    telefono: '+593 99 123 4567',
    correo: 'carlos.perez@gmail.com',
    marca: 'Toyota', modelo: 'Corolla', año: '2019',
    placa: 'ABC-1234', kilometraje: '85000',
    tipoServicio: 'Cambio de aceite', otroServicio: '',
    descripcionProblema: 'El vehículo presenta ruido al frenar.',
    fechaCita: '2026-05-15', horaCita: '09:00',
    estado: 'Pendiente', mantenimiento: null,
  },
  {
    id: 's-2',
    nombre: 'María González',
    telefono: '+593 98 765 4321',
    correo: 'maria.g@gmail.com',
    marca: 'Chevrolet', modelo: 'Aveo', año: '2021',
    placa: 'XYZ-5678', kilometraje: '42000',
    tipoServicio: 'Frenos', otroServicio: '',
    descripcionProblema: 'Pierde potencia al acelerar.',
    fechaCita: '2026-05-16', horaCita: '11:00',
    estado: 'En proceso', mantenimiento: null,
  },
];

// Retorna un objeto Mantenimiento con todos los campos vacíos
// Usado para inicializar el formulario de registro de mantenimiento
function formMantVacio(): Mantenimiento {
  return {
    marca: '', modelo: '', placa: '', fechaServicio: '',
    mecanicoAsignado: '', diagnostico: '', trabajoRealizado: '',
    otroTrabajo: '', repuestosUtilizados: '', diagnosticoRealizado: '',
    costoManoObra: '', costoRepuestos: '', observaciones: '',
    fechaInicio: '', fechaFinalizacion: '',
  };
}


// COMPONENTE PRINCIPAL

export default function ReportesClientesScreen() {
  // Lista de solicitudes de clientes (inicia con los datos mock)
  const [lista, setLista] = useState<Solicitud[]>(MOCK_SOLICITUDES);

  // ESTADOS DEL MODAL EDITAR SOLICITUD 
  const [editModal, setEditModal]           = useState(false);
  const [editId, setEditId]                 = useState<string | null>(null);
  const [editForm, setEditForm]             = useState<Partial<Solicitud>>({});
  const [editServDropdown, setEditServDropdown] = useState(false);

  // Estados de error — uno por campo del modal de edición
  const [errNombre, setErrNombre]           = useState('');
  const [errTelefono, setErrTelefono]       = useState('');
  const [errCorreo, setErrCorreo]           = useState('');
  const [errMarca, setErrMarca]             = useState('');
  const [errModelo, setErrModelo]           = useState('');
  const [errAño, setErrAño]                 = useState('');
  const [errPlaca, setErrPlaca]             = useState('');
  const [errKm, setErrKm]                   = useState('');
  const [errServicio, setErrServicio]       = useState('');
  const [errOtroServicio, setErrOtroServicio] = useState('');
  const [errDescripcion, setErrDescripcion] = useState('');

  // ESTADOS DEL MODAL REGISTRO/EDITAR MANTENIMIENTO
  const [maintModal, setMaintModal]         = useState(false);           // Visibilidad del modal
  const [maintId, setMaintId]               = useState<string | null>(null); // ID de la solicitud a registrar
  const [maintForm, setMaintForm]           = useState<Mantenimiento>(formMantVacio()); // Datos del formulario
  const [mecDropdown, setMecDropdown]       = useState(false);           // Dropdown de mecánico abierto
  const [trabajoDropdown, setTrabajoDropdown] = useState(false);         // Dropdown de trabajo abierto

  // Estados de error del modal de mantenimiento
  const [errMaintMarca, setErrMaintMarca]       = useState('');
  const [errMaintModelo, setErrMaintModelo]     = useState('');
  const [errMaintPlaca, setErrMaintPlaca]       = useState('');
  const [errMaintAño, setErrMaintAño]           = useState('');
  const [errMaintKm, setErrMaintKm]             = useState('');
  const [errMaintFechaServ, setErrMaintFechaServ] = useState('');
  const [errMaintMecAsinado, setErrMaintMecAsinado] = useState('');
  const [errMaintDiagnost, setErrMaintDiagnost] = useState('');
  const [errMaintTrabajo, setErrMaintTrabajo]   = useState('');
  const [errMaintOtroTrabajo, setErrMaintOtroTrabajo] = useState('');
  const [errMaintRepuestos, setErrMaintRepuestos] = useState('');
  const [errMaintDiagReal, setErrMaintDiagReal] = useState('');
  const [errMaintManoObra, setErrMaintManoObra] = useState('');
  const [errMaintCostoRep, setErrMaintCostoRep] = useState('');
  const [errMaintObserv, setErrMaintObserv]     = useState('');
  const [errMaintFechaInit, setErrMaintFechaInit] = useState('');
  const [errMaintFechaFinal, setErrMaintFechaFinal] = useState('');

  // ESTADOS DEL MODAL ENVIAR REPORTE
  const [sendModal, setSendModal]           = useState(false);           // Visibilidad del modal
  const [sendTarget, setSendTarget]         = useState<Solicitud | null>(null); // Solicitud a enviar
  const [sendSuccess, setSendSuccess]       = useState(false);           // true = mostrar pantalla de éxito

  // ESTADOS DEL MODAL ELIMINAR
  const [deleteModal, setDeleteModal]       = useState(false);           // Visibilidad del modal
  const [deleteTarget, setDeleteTarget]     = useState<Solicitud | null>(null); // Solicitud a eliminar

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

  const guardarEditar = () => {
    if (!editId) return;

    const eNombre      = validarNombreCompleto(editForm.nombre ?? '');
    const eTelefono    = validarTelefono(editForm.telefono ?? '');
    const eCorreo      = validarCorreoGmail(editForm.correo ?? '');
    const eMarca       = validarSoloTexto(editForm.marca ?? '', 'La marca');
    const eModelo      = validarModelo(editForm.modelo ?? '');
    const eAño         = validarAño(editForm.año ?? '');
    const ePlaca       = validarPlaca(editForm.placa ?? '');
    const eKm          = validarSoloNumeros(editForm.kilometraje ?? '', 'El kilometraje');
    const eServicio    = validarObligatorio(editForm.tipoServicio, 'El tipo de servicio');
    const eOtroServ    = editForm.tipoServicio === 'Otro'
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

    setLista((prev) => prev.map((x) => x.id === editId ? { ...x, ...editForm } as Solicitud : x));
    setEditModal(false);
  };

  // FUNCIÓN: ABRIR MODAL MANTENIMIENTO
  // Si ya tiene mantenimiento, pre-llena con los datos existentes.
  // Si no, inicializa con los datos del vehículo de la solicitud.
  const abrirMantenimiento = (s: Solicitud) => {
    setMaintId(s.id);
    setMaintForm(s.mantenimiento
      ? { ...s.mantenimiento }          // Pre-llena con el mantenimiento existente
      : { ...formMantVacio(), marca: s.marca, modelo: s.modelo, placa: s.placa } // Datos del vehículo
    );
    setMecDropdown(false);
    setTrabajoDropdown(false);
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
  const guardarMantenimiento = () => {
    if (!maintId) return;

    const eMarca       = validarSoloTexto(maintForm.marca ?? '', 'La marca');
    const eModelo      = validarModelo(maintForm.modelo ?? '');
    const ePlaca       = validarPlaca(maintForm.placa ?? '');
    const eAño         = validarAño((maintForm as any).año ?? '');
    const eKm          = validarSoloNumeros((maintForm as any).kilometraje ?? '', 'El kilometraje');
    const eFechaServ   = validarFecha(maintForm.fechaServicio ?? '');
    const eMecAsignado = validarObligatorio(maintForm.mecanicoAsignado, 'El mecánico asignado');
    const eDiagnost    = validarTextoYNumeros(maintForm.diagnostico ?? '', 'El diagnóstico');
    const eTrabajo     = validarObligatorio(maintForm.trabajoRealizado, 'El trabajo realizado');
    const eOtroTrab    = maintForm.trabajoRealizado === 'Otros'
                          ? validarOtroServicio(maintForm.otroTrabajo ?? '')
                          : null;
    const eRepuestos   = validarTextoYNumeros(maintForm.repuestosUtilizados ?? '', 'Los repuestos utilizados');
    const eDiagReal    = validarTextoYNumeros(maintForm.diagnosticoRealizado ?? '', 'El diagnóstico realizado');
    const eManoObra    = validarCostoObligatorio(maintForm.costoManoObra ?? '', 'El costo de mano de obra');
    const eCostoRep    = validarCostoObligatorio(maintForm.costoRepuestos ?? '', 'El costo de repuestos');
    const eObserv      = validarTextoYNumeros(maintForm.observaciones ?? '', 'Las observaciones');
    const eFechaInit   = validarFecha(maintForm.fechaInicio ?? '');
    const eFechaFinal  = validarFecha(maintForm.fechaFinalizacion ?? '');

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
    
    if (errores.length > 0) {
      return;
    }

    setLista((prev) => prev.map((x) =>
      x.id === maintId
        ? { ...x, mantenimiento: { ...maintForm }, estado: 'Completado' as EstadoSolicitud }
        : x
    ));
    setMaintModal(false);
  };

  // FUNCIÓN: ABRIR MODAL ELIMINAR
  const eliminar = (s: Solicitud) => {
    setDeleteTarget(s);                 // Guarda la solicitud a eliminar
    setDeleteModal(true);               // Abre el modal de confirmación
  };

  // FUNCIÓN: CONFIRMAR ELIMINAR
  // Filtra la solicitud de la lista y cierra el modal
  const confirmarEliminar = () => {
    if (deleteTarget) setLista((p) => p.filter((x) => x.id !== deleteTarget.id));
    setDeleteModal(false);
    setDeleteTarget(null);              // Limpia el target
  };

  // FUNCIÓN: ABRIR MODAL ENVIAR
  const abrirEnviar = (s: Solicitud) => {
    setSendTarget(s);                   // Guarda la solicitud a enviar
    setSendSuccess(false);              // Resetea el estado de éxito
    setSendModal(true);
  };

  // FUNCIÓN: CONFIRMAR ENVÍO
  // Simula el envío del reporte y muestra la pantalla de éxito
  const confirmarEnvio = () => {
    setSendSuccess(true);               // Cambia a la vista de éxito dentro del modal
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
                    {['Cambio de aceite','Frenos','Suspensión','Motor','Electricidad','Aire acondicionado','Revisión general','Otro'].map((opt, i, arr) => (
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
                      value={(maintForm as any).año ?? ''}
                      onChangeText={(t) => { setMaintForm((p) => ({ ...p, año: t } as any)); setErrMaintAño(''); }} />
                    {errMaintAño ? <Text style={styles.errorText} numberOfLines={2}>{errMaintAño}</Text> : null}
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Kilometraje</Text>
                    <TextInput style={[styles.input, errMaintKm ? styles.inputError : null]} placeholder="km" placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      value={(maintForm as any).kilometraje ?? ''}
                      onChangeText={(t) => { setMaintForm((p) => ({ ...p, kilometraje: t } as any)); setErrMaintKm(''); }} />
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
                    {MECANICOS_DISPONIBLES.map((m, i) => (
                      <Pressable key={m}
                        style={[styles.dropdownItem, i === MECANICOS_DISPONIBLES.length - 1 && styles.dropdownItemLast, maintForm.mecanicoAsignado === m && styles.dropdownItemActive]}
                        onPress={() => { setMaintForm((p) => ({ ...p, mecanicoAsignado: m })); setMecDropdown(false); setErrMaintMecAsinado(''); }}>
                        <Text style={styles.dropdownItemText}>{m}</Text>
                      </Pressable>
                    ))}
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
              <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={guardarMantenimiento}>
                {({ pressed }) => <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>Guardar reporte</Text>}
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
        onRequestClose={() => { setSendModal(false); setSendSuccess(false); }}>
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
                  onPress={() => { setSendModal(false); setSendSuccess(false); }}>
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
                <View style={styles.sendModalBtns}>
                  {/* Botón confirmar: llama a confirmarEnvio() que cambia sendSuccess a true */}
                  <Pressable style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed]}
                    onPress={confirmarEnvio}>
                    <Text style={styles.sendModalBtnText}>Enviar al correo</Text>
                  </Pressable>
                  {/* Botón cancelar: cierra el modal sin enviar */}
                  <Pressable style={({ pressed }) => [styles.sendModalBtnCancel, pressed && styles.sendModalBtnCancelPressed]}
                    onPress={() => { setSendModal(false); setSendSuccess(false); }}>
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
