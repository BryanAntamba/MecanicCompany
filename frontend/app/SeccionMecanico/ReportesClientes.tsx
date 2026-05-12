// ReportesClientes.tsx
// Pantalla principal del mecánico para gestionar las solicitudes de servicio.
// Permite: editar solicitudes, registrar/editar mantenimientos, eliminar registros
// y enviar el reporte técnico al correo del cliente.

// Hook de React para manejar estado local del componente
import { useState } from 'react';

// Componentes nativos de React Native
import {
  Alert,                // Diálogos nativos del sistema operativo
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
  const [editModal, setEditModal]           = useState(false);           // Visibilidad del modal
  const [editId, setEditId]                 = useState<string | null>(null); // ID de la solicitud en edición
  const [editForm, setEditForm]             = useState<Partial<Solicitud>>({}); // Datos del formulario de edición
  const [editServDropdown, setEditServDropdown] = useState(false);       // Dropdown de tipo de servicio abierto

  // ESTADOS DEL MODAL REGISTRO/EDITAR MANTENIMIENTO
  const [maintModal, setMaintModal]         = useState(false);           // Visibilidad del modal
  const [maintId, setMaintId]               = useState<string | null>(null); // ID de la solicitud a registrar
  const [maintForm, setMaintForm]           = useState<Mantenimiento>(formMantVacio()); // Datos del formulario
  const [mecDropdown, setMecDropdown]       = useState(false);           // Dropdown de mecánico abierto
  const [trabajoDropdown, setTrabajoDropdown] = useState(false);         // Dropdown de trabajo abierto

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
    setEditId(s.id);                    // Guarda el ID para saber qué solicitud actualizar
    setEditForm({ ...s });              // Copia todos los datos de la solicitud al formulario
    setEditServDropdown(false);         // Cierra el dropdown si estaba abierto
    setEditModal(true);                 // Abre el modal
  };

  // FUNCIÓN: GUARDAR EDICIÓN 
  // Actualiza la solicitud en la lista con los datos del formulario
  const guardarEditar = () => {
    if (!editId) return;                // Seguridad: no hace nada si no hay ID
    // Reemplaza la solicitud con el ID correspondiente manteniendo los demás sin cambios
    setLista((prev) => prev.map((x) => x.id === editId ? { ...x, ...editForm } as Solicitud : x));
    setEditModal(false);                // Cierra el modal
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
    setMaintModal(true);
  };

  // FUNCIÓN: GUARDAR MANTENIMIENTO
  // Guarda el registro de mantenimiento y cambia el estado a "Completado"
  const guardarMantenimiento = () => {
    if (!maintId) return;
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
                <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="#64748B"
                  value={editForm.nombre} onChangeText={(t) => setEditForm((p) => ({ ...p, nombre: t }))} />
                <Text style={styles.label}>Teléfono</Text>
                <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#64748B" keyboardType="phone-pad"
                  value={editForm.telefono} onChangeText={(t) => setEditForm((p) => ({ ...p, telefono: t }))} />
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor="#64748B" keyboardType="email-address" autoCapitalize="none"
                  value={editForm.correo} onChangeText={(t) => setEditForm((p) => ({ ...p, correo: t }))} />
              </View>

              {/* SECCIÓN: INFORMACIÓN DEL VEHÍCULO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Información del vehículo</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Marca</Text>
                <TextInput style={styles.input} placeholder="Marca" placeholderTextColor="#64748B"
                  value={editForm.marca} onChangeText={(t) => setEditForm((p) => ({ ...p, marca: t }))} />
                {/* Fila: Modelo + Año en la misma línea */}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput style={styles.input} placeholder="Modelo" placeholderTextColor="#64748B"
                      value={editForm.modelo} onChangeText={(t) => setEditForm((p) => ({ ...p, modelo: t }))} />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Año</Text>
                    <TextInput style={styles.input} placeholder="Año" placeholderTextColor="#64748B" keyboardType="numeric"
                      value={editForm.año} onChangeText={(t) => setEditForm((p) => ({ ...p, año: t }))} />
                  </View>
                </View>
                {/* Fila: Placa + Kilometraje en la misma línea */}
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Placa</Text>
                    <TextInput style={styles.input} placeholder="Placa" placeholderTextColor="#64748B"
                      value={editForm.placa} onChangeText={(t) => setEditForm((p) => ({ ...p, placa: t }))} />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Kilometraje</Text>
                    <TextInput style={styles.input} placeholder="km" placeholderTextColor="#64748B" keyboardType="numeric"
                      value={editForm.kilometraje} onChangeText={(t) => setEditForm((p) => ({ ...p, kilometraje: t }))} />
                  </View>
                </View>
              </View>

              {/* SECCIÓN: TIPO DE SERVICIO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Tipo de servicio</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Servicio solicitado</Text>
                {/* Dropdown de tipo de servicio */}
                <Pressable style={[styles.dropdown, editServDropdown && styles.dropdownOpen]}
                  onPress={() => setEditServDropdown((v) => !v)}>
                  <Text style={editForm.tipoServicio ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {editForm.tipoServicio || 'Selecciona un servicio'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{editServDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {/* Lista de opciones del dropdown */}
                {editServDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {['Cambio de aceite','Frenos','Suspensión','Motor','Electricidad','Aire acondicionado','Revisión general','Otro'].map((opt, i, arr) => (
                      <Pressable key={opt}
                        style={[styles.dropdownItem, i === arr.length - 1 && styles.dropdownItemLast, editForm.tipoServicio === opt && styles.dropdownItemActive]}
                        onPress={() => { setEditForm((p) => ({ ...p, tipoServicio: opt })); setEditServDropdown(false); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {/* Campo extra solo visible cuando el servicio es "Otro" */}
                {editForm.tipoServicio === 'Otro' && (
                  <>
                    <Text style={styles.label}>Describe el servicio</Text>
                    <TextInput style={styles.input} placeholder="Describe brevemente" placeholderTextColor="#64748B"
                      value={editForm.otroServicio} onChangeText={(t) => setEditForm((p) => ({ ...p, otroServicio: t }))} />
                  </>
                )}
                <Text style={styles.label}>Descripción del problema</Text>
                {/* Campo multilínea para la descripción del problema */}
                <TextInput style={[styles.input, styles.textarea]} placeholder="Describe el problema..." placeholderTextColor="#64748B" multiline
                  value={editForm.descripcionProblema} onChangeText={(t) => setEditForm((p) => ({ ...p, descripcionProblema: t }))} />
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
                <TextInput style={styles.input} placeholder="Marca" placeholderTextColor="#64748B"
                  value={maintForm.marca} onChangeText={(t) => setMaintForm((p) => ({ ...p, marca: t }))} />
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput style={styles.input} placeholder="Modelo" placeholderTextColor="#64748B"
                      value={maintForm.modelo} onChangeText={(t) => setMaintForm((p) => ({ ...p, modelo: t }))} />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Placa</Text>
                    <TextInput style={styles.input} placeholder="Placa" placeholderTextColor="#64748B"
                      value={maintForm.placa} onChangeText={(t) => setMaintForm((p) => ({ ...p, placa: t }))} />
                  </View>
                </View>
                <Text style={styles.label}>Fecha del servicio</Text>
                <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                  value={maintForm.fechaServicio} onChangeText={(t) => setMaintForm((p) => ({ ...p, fechaServicio: t }))} />
              </View>

              {/* SECCIÓN: MECÁNICO ASIGNADO
                  Dropdown con la lista de mecánicos registrados en el sistema */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mecánico asignado</Text>
                <Pressable style={[styles.dropdown, mecDropdown && styles.dropdownOpen]}
                  onPress={() => { setTrabajoDropdown(false); setMecDropdown((v) => !v); }}>
                  <Text style={maintForm.mecanicoAsignado ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {maintForm.mecanicoAsignado || 'Selecciona un mecánico'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{mecDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {mecDropdown && (
                  <View style={styles.dropdownList}>
                    {MECANICOS_DISPONIBLES.map((m, i) => (
                      <Pressable key={m}
                        style={[styles.dropdownItem, i === MECANICOS_DISPONIBLES.length - 1 && styles.dropdownItemLast, maintForm.mecanicoAsignado === m && styles.dropdownItemActive]}
                        onPress={() => { setMaintForm((p) => ({ ...p, mecanicoAsignado: m })); setMecDropdown(false); }}>
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
                <TextInput style={[styles.input, styles.textarea]} placeholder="Describe detalladamente el problema..." placeholderTextColor="#64748B" multiline
                  value={maintForm.diagnostico} onChangeText={(t) => setMaintForm((p) => ({ ...p, diagnostico: t }))} />
              </View>

              {/* SECCIÓN: TRABAJO REALIZADO
                  Dropdown del catálogo + campo extra si es "Otros" */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Trabajo realizado</Text>
                <Pressable style={[styles.dropdown, trabajoDropdown && styles.dropdownOpen]}
                  onPress={() => { setMecDropdown(false); setTrabajoDropdown((v) => !v); }}>
                  <Text style={maintForm.trabajoRealizado ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {maintForm.trabajoRealizado || 'Selecciona el trabajo'}
                  </Text>
                  <Text style={styles.dropdownArrow}>{trabajoDropdown ? '▲' : '▼'}</Text>
                </Pressable>
                {trabajoDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {TRABAJOS_OPCIONES.map((opt, i) => (
                      <Pressable key={opt}
                        style={[styles.dropdownItem, i === TRABAJOS_OPCIONES.length - 1 && styles.dropdownItemLast, maintForm.trabajoRealizado === opt && styles.dropdownItemActive]}
                        onPress={() => { setMaintForm((p) => ({ ...p, trabajoRealizado: opt })); setTrabajoDropdown(false); }}>
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {/* Campo extra solo visible cuando el trabajo es "Otros" */}
                {maintForm.trabajoRealizado === 'Otros' && (
                  <>
                    <Text style={styles.label}>Describe el trabajo realizado</Text>
                    <TextInput style={styles.input} placeholder="Describe brevemente..." placeholderTextColor="#64748B"
                      value={maintForm.otroTrabajo} onChangeText={(t) => setMaintForm((p) => ({ ...p, otroTrabajo: t }))} />
                  </>
                )}
                <Text style={styles.label}>Repuestos utilizados</Text>
                <TextInput style={[styles.input, styles.textarea]} placeholder="Lista los repuestos utilizados..." placeholderTextColor="#64748B" multiline
                  value={maintForm.repuestosUtilizados} onChangeText={(t) => setMaintForm((p) => ({ ...p, repuestosUtilizados: t }))} />
                <Text style={styles.label}>Diagnóstico realizado</Text>
                <Text style={styles.labelHint}>Describe paso a paso lo que se realizó.</Text>
                <TextInput style={[styles.input, styles.textarea]} placeholder="Describe paso a paso el trabajo..." placeholderTextColor="#64748B" multiline
                  value={maintForm.diagnosticoRealizado} onChangeText={(t) => setMaintForm((p) => ({ ...p, diagnosticoRealizado: t }))} />
              </View>

              {/* SECCIÓN: COSTOS DEL SERVICIO */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Costos del servicio</Text>
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.label, styles.labelFirstInSection]}>Mano de obra ($)</Text>
                    <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#64748B" keyboardType="decimal-pad"
                      value={maintForm.costoManoObra} onChangeText={(t) => setMaintForm((p) => ({ ...p, costoManoObra: t }))} />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={[styles.label, styles.labelFirstInSection]}>Costo repuestos ($)</Text>
                    <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#64748B" keyboardType="decimal-pad"
                      value={maintForm.costoRepuestos} onChangeText={(t) => setMaintForm((p) => ({ ...p, costoRepuestos: t }))} />
                  </View>
                </View>
              </View>

              {/* SECCIÓN: OBSERVACIONES Y FECHAS */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Observaciones y fechas</Text>
                <Text style={[styles.label, styles.labelFirstInSection]}>Observaciones</Text>
                <Text style={styles.labelHint}>Recomendaciones para el cuidado posterior del vehículo.</Text>
                <TextInput style={[styles.input, styles.textarea]} placeholder="Recomendaciones post-servicio..." placeholderTextColor="#64748B" multiline
                  value={maintForm.observaciones} onChangeText={(t) => setMaintForm((p) => ({ ...p, observaciones: t }))} />
                <View style={styles.formRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Fecha de inicio</Text>
                    <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                      value={maintForm.fechaInicio} onChangeText={(t) => setMaintForm((p) => ({ ...p, fechaInicio: t }))} />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>Fecha de finalización</Text>
                    <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#64748B"
                      value={maintForm.fechaFinalizacion} onChangeText={(t) => setMaintForm((p) => ({ ...p, fechaFinalizacion: t }))} />
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
