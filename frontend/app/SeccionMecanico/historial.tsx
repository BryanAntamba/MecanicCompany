// historial.tsx
// Pantalla de historial de mantenimientos completados para el mecánico.
// Permite buscar registros por placa, ver los detalles completos de cada
// mantenimiento y reenviar el reporte al correo del cliente.


// Hook de React para manejar estado local
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
  TextInput,            // Campo de entrada de texto (usado en modo solo lectura en detalles)
  View,                 // Contenedor genérico
} from 'react-native';

// Íconos vectoriales de FontAwesome (search, car, calendar, user, file-text, send, check-circle)
import { FontAwesome } from '@expo/vector-icons';

// Barra de navegación del mecánico con opciones Reportes, Historial y Cerrar sesión
import NavbarMecanico from '@/components/nadvarMecanico/nadvarMecanico';

// useFocusEffect: ejecuta un efecto solo mientras la pantalla está en foco
import { useFocusEffect } from 'expo-router';

// Estilos compartidos con ReportesClientes (tarjetas, modales, botones)
import styles from '@/Styles/ReportesClientes';

// Estilos exclusivos del historial (buscador, texto vacío, valores de detalle)
import histStyles from '@/Styles/historial';

// Contexto de autenticación
import { useAuth } from '@/context/AuthContext';

// API para cargar las solicitudes completadas y reenviar reportes
import { solicitudesApi, reportesApi, SolicitudBackend } from '@/utils/api';


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
  marca: string;               // Marca del vehículo (para mostrar en la tarjeta)
  modelo: string;              // Modelo del vehículo
  placa: string;               // Placa del vehículo (campo de búsqueda)
  fechaMantenimiento: string;  // Fecha en que se completó el mantenimiento
  mecanicoNombre: string;      // Nombre del mecánico que realizó el trabajo
  mantenimiento: Mantenimiento;// Datos completos del reporte técnico
};


// DATOS

// Lista vacía — los registros reales se cargan desde el backend
const MOCK_HISTORIAL: RegistroHistorial[] = [];

// Mapea una SolicitudBackend completada a RegistroHistorial
function backendAHistorial(s: SolicitudBackend): RegistroHistorial | null {
  if (!s.mantenimiento) return null;
  const m = s.mantenimiento;
  return {
    id: s.id,
    clienteNombre: s.nombreCliente,
    clienteCorreo: s.correoCliente,
    marca: m.marca,
    modelo: m.modelo,
    placa: m.placa,
    fechaMantenimiento: m.fechaFinalizacion,
    mecanicoNombre: m.mecanicoAsignado,
    mantenimiento: {
      marca: m.marca,
      modelo: m.modelo,
      placa: m.placa,
      año: m.año ?? s.anio,
      kilometraje: m.kilometraje ?? s.kilometraje,
      fechaServicio: m.fechaServicio,
      mecanicoAsignado: m.mecanicoAsignado,
      diagnostico: m.diagnostico,
      trabajoRealizado: m.trabajoRealizado,
      otroTrabajo: m.otroTrabajo,
      repuestosUtilizados: m.repuestosUtilizados,
      diagnosticoRealizado: m.diagnosticoRealizado,
      costoManoObra: String(m.costoManoObra),
      costoRepuestos: String(m.costoRepuestos),
      observaciones: m.observaciones,
      fechaInicio: m.fechaInicio,
      fechaFinalizacion: m.fechaFinalizacion,
    },
  };
}


// COMPONENTE PRINCIPAL


export default function HistorialScreen() {
  // Bloquea el botón físico de atrás en Android mientras esta pantalla está activa
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  // Token y usuario autenticado
  const { token, user } = useAuth();

  // Estado del campo de búsqueda por placa
  const [busqueda, setBusqueda] = useState('');

  // Lista de registros del historial (se carga desde el backend)
  const [lista, setLista] = useState<RegistroHistorial[]>([]);

  // Recarga el historial cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      if (!token || !user?.id) return;
      solicitudesApi.listar(token)
        .then((data: SolicitudBackend[]) => {
          const registros = data
            .filter((s) => s.mecanicoId === user.id && s.estado === 'Completado')
            .map(backendAHistorial)
            .filter((r): r is RegistroHistorial => r !== null);
          setLista(registros);
        })
        .catch(() => { });
    }, [token, user?.id]),
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

  // Llama al backend para reenviar el reporte al correo del cliente
  const reenviarReporte = async () => {
    if (!sendTarget || !token) return;
    setSendLoading(true);
    setSendError('');
    try {
      await reportesApi.enviar(sendTarget.id, token);
      setSendSuccess(true);
    } catch (err: any) {
      setSendError(err?.message ?? 'No se pudo reenviar el reporte. Verifica la conexión.');
    } finally {
      setSendLoading(false);
    }
  };

  // Filtra la lista por placa cuando hay texto en el buscador.
  // Si el buscador está vacío, muestra todos los registros.
  // toLowerCase() hace la búsqueda insensible a mayúsculas/minúsculas.
  const listaFiltrada = busqueda.trim()
    ? lista.filter((r) => r.placa.toLowerCase().includes(busqueda.trim().toLowerCase()))
    : lista;

  // RENDER

  return (
    // Contenedor raíz que ocupa toda la pantalla
    <View style={styles.page}>

      {/* Navbar del mecánico con "historial" como pestaña activa (resaltada en azul) */}
      <NavbarMecanico activeTab="historial" />

      {/* ScrollView principal con la lista de registros */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Cierra el teclado al tocar fuera del input
      >
        {/* Título centrado de la pantalla */}
        <Text style={styles.screenTitle}>Historial</Text>

        {/* Subtítulo descriptivo */}
        <Text style={styles.screenSubtitle}>Registros de mantenimientos completados.</Text>

        {/* ── BUSCADOR POR PLACA ──
            Fila con ícono de lupa + input + botón limpiar (X) */}
        <View style={histStyles.searchRow}>
          {/* Ícono de lupa a la izquierda del input */}
          <FontAwesome name="search" size={16} color="#64748B" style={histStyles.searchIcon} />

          {/* Campo de texto para ingresar la placa a buscar
              autoCapitalize="characters" convierte automáticamente a mayúsculas */}
          <TextInput
            style={histStyles.searchInput}
            placeholder="Buscar por placa..."
            placeholderTextColor="#64748B"
            value={busqueda}
            onChangeText={setBusqueda}         // Actualiza el estado al escribir
            autoCapitalize="characters"        // Las placas suelen estar en mayúsculas
          />

          {/* Botón X para limpiar el buscador — solo visible cuando hay texto */}
          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda('')} hitSlop={8}>
              <FontAwesome name="times-circle" size={16} color="#64748B" />
            </Pressable>
          )}
        </View>

        {/* Mensaje cuando no hay resultados para la búsqueda actual */}
        {listaFiltrada.length === 0 && (
          <Text style={histStyles.emptyText}>No se encontraron registros para "{busqueda}".</Text>
        )}

        {/* Itera sobre los registros filtrados para renderizar una tarjeta por cada uno */}
        {listaFiltrada.map((r) => (
          <View key={r.id} style={styles.rowCard}>

            {/* Nombre completo del cliente */}
            <Text style={styles.clientName}>{r.clienteNombre}</Text>

            {/* Fila: ícono de carro + marca/modelo/placa */}
            <View style={styles.metaRow}>
              <FontAwesome name="car" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>{r.marca} {r.modelo} · {r.placa}</Text>
            </View>

            {/* Fila: ícono de calendario + fecha del mantenimiento */}
            <View style={styles.metaRow}>
              <FontAwesome name="calendar" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>Mantenimiento: {r.fechaMantenimiento}</Text>
            </View>

            {/* Fila: ícono de usuario + nombre del mecánico que atendió */}
            <View style={styles.metaRow}>
              <FontAwesome name="user" size={13} color="#64748B" style={styles.metaIcon} />
              <Text style={styles.clientMeta}>Mecánico: {r.mecanicoNombre}</Text>
            </View>

            {/* Línea divisoria entre la info y los botones */}
            <View style={styles.divider} />

            {/* Fila de botones de acción */}
            <View style={styles.actionsRow}>

              {/* Botón Detalles: abre el modal con el reporte completo del mantenimiento */}
              <Pressable
                onPress={() => { setDetallesTarget(r); setDetallesModal(true); }}
                style={({ pressed }) => [styles.actionBtn, styles.btnEdit, pressed && styles.btnEditPressed]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    {/* Ícono de documento de texto */}
                    <FontAwesome name="file-text" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnEditText]}>Detalles</Text>
                  </View>
                )}
              </Pressable>

              {/* Botón Reenviar: abre el modal de confirmación para reenviar el reporte */}
              <Pressable
                onPress={() => { setSendTarget(r); setSendSuccess(false); setSendModal(true); }}
                style={({ pressed }) => [styles.actionBtn, styles.btnSend, pressed && styles.btnSendPressed]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    {/* Ícono de envío */}
                    <FontAwesome name="send" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnSendText]}>Reenviar</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL DETALLES DEL MANTENIMIENTO
          Muestra todos los campos del reporte en modo solo lectura.
          Reutiliza el mismo diseño visual que el modal de registro de ReportesClientes.*/}
      <Modal
        visible={detallesModal}
        animationType="fade"
        transparent
        onRequestClose={() => setDetallesModal(false)} // Cierra con botón atrás en Android
      >
        {/* KeyboardAvoidingView evita que el teclado tape el contenido en iOS */}
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>

            {/* Cabecera del modal: título + marca/modelo/placa + botón cerrar */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.modalTitle}>Registro de mantenimiento</Text>
                {/* Subtítulo con los datos del vehículo del registro seleccionado */}
                <Text style={styles.modalSubtitle}>
                  {detallesTarget?.marca} {detallesTarget?.modelo} · {detallesTarget?.placa}
                </Text>
              </View>
              {/* Botón X rojo para cerrar el modal */}
              <Pressable
                onPress={() => setDetallesModal(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Contenido scrolleable del modal */}
            <ScrollView
              nestedScrollEnabled              // Permite scroll dentro del modal
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* IIFE: solo se ejecuta si hay un registro seleccionado */}
              {detallesTarget && (() => {
                const m = detallesTarget.mantenimiento; // Alias para acceder al mantenimiento

                // Función auxiliar que renderiza un campo de solo lectura.
                // Usa TextInput con editable={false} para mantener el mismo estilo visual
                // que los campos editables del modal de registro.
                const campo = (label: string, valor: string) => (
                  <View key={label}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                      style={styles.input}
                      value={valor}
                      editable={false}                    // Solo lectura
                      multiline={valor.length > 60}       // Multilínea si el texto es largo
                      placeholderTextColor="#64748B"
                    />
                  </View>
                );

                return (
                  <>
                    {/* Sección: Datos del vehículo */}
                    <View style={[styles.modalSection, styles.modalSectionFirst]}>
                      <Text style={styles.modalSectionTitle}>Datos del vehículo</Text>
                      {campo('Marca', m.marca)}
                      {campo('Modelo', m.modelo)}
                      {campo('Placa', m.placa)}
                      {campo('Año', m.año)}
                      {campo('Kilometraje (km)', m.kilometraje)}
                      {campo('Fecha del servicio', m.fechaServicio)}
                    </View>

                    {/* Sección: Mecánico asignado */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Mecánico asignado</Text>
                      {campo('Mecánico', m.mecanicoAsignado)}
                    </View>

                    {/* Sección: Diagnóstico inicial */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Diagnóstico inicial</Text>
                      {campo('Diagnóstico', m.diagnostico)}
                    </View>

                    {/* Sección: Trabajo realizado
                        Si el trabajo fue "Otros", muestra la descripción personalizada */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Trabajo realizado</Text>
                      {campo('Trabajo', m.trabajoRealizado === 'Otros' ? m.otroTrabajo : m.trabajoRealizado)}
                      {campo('Repuestos utilizados', m.repuestosUtilizados)}
                      {campo('Diagnóstico realizado', m.diagnosticoRealizado)}
                    </View>

                    {/* Sección: Costos del servicio */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Costos del servicio</Text>
                      {campo('Mano de obra ($)', m.costoManoObra)}
                      {campo('Costo repuestos ($)', m.costoRepuestos)}
                    </View>

                    {/* Sección: Observaciones y fechas */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Observaciones y fechas</Text>
                      {campo('Observaciones', m.observaciones)}
                      {campo('Fecha de inicio', m.fechaInicio)}
                      {campo('Fecha de finalización', m.fechaFinalizacion)}
                    </View>
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 
          MODAL REENVIAR REPORTE
          Muestra una confirmación antes de reenviar el reporte al cliente.
          Después del envío muestra una pantalla de éxito con ícono verde. */}
      <Modal
        visible={sendModal}
        animationType="fade"
        transparent
        onRequestClose={() => { if (!sendLoading) { setSendModal(false); setSendSuccess(false); setSendError(''); } }}
      >
        <View style={styles.sendModalOverlay}>
          <View style={styles.sendModalCard}>

            {/* Renderizado condicional: éxito o confirmación */}
            {sendSuccess ? (
              // PANTALLA DE ÉXITO 
              <>
                {/* Ícono grande de check verde centrado */}
                <FontAwesome
                  name="check-circle"
                  size={64}
                  color="#22C55E"
                  style={{ alignSelf: 'center', marginBottom: 16 }}
                />
                <Text style={styles.sendModalTitle}>Reporte reenviado</Text>
                <Text style={styles.sendModalBody}>
                  El reporte fue enviado exitosamente al correo de{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.clienteNombre}</Text>.
                </Text>
                <View style={styles.sendModalBtns}>
                  <Pressable
                    style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed]}
                    onPress={() => { setSendModal(false); setSendSuccess(false); setSendError(''); }}
                  >
                    <Text style={styles.sendModalBtnText}>Cerrar</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              // PANTALLA DE CONFIRMACIÓN 
              <>
                <Text style={styles.sendModalTitle}>Reenviar reporte</Text>
                <Text style={styles.sendModalBody}>
                  ¿Deseas reenviar el reporte al señor{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.clienteNombre}</Text>
                  {' '}a su correo{' '}
                  <Text style={styles.sendModalHighlight}>{sendTarget?.clienteCorreo}</Text>?
                </Text>
                {/* Mensaje de error si el reenvío falló */}
                {sendError ? (
                  <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
                    ⚠️ {sendError}
                  </Text>
                ) : null}

                {/* Fila de botones: Enviar al correo + Cancelar envío */}
                <View style={styles.sendModalBtns}>
                  <Pressable
                    style={({ pressed }) => [styles.sendModalBtnSend, pressed && styles.sendModalBtnSendPressed, sendLoading && { opacity: 0.6 }]}
                    onPress={reenviarReporte}
                    disabled={sendLoading}
                  >
                    <Text style={styles.sendModalBtnText}>{sendLoading ? 'Enviando...' : 'Enviar al correo'}</Text>
                  </Pressable>

                  {/* Botón cancelar: cierra el modal sin enviar */}
                  <Pressable
                    style={({ pressed }) => [styles.sendModalBtnCancel, pressed && styles.sendModalBtnCancelPressed, sendLoading && { opacity: 0.4 }]}
                    onPress={() => { if (!sendLoading) { setSendModal(false); setSendSuccess(false); setSendError(''); } }}
                    disabled={sendLoading}
                  >
                    <Text style={styles.sendModalBtnCancelText}>Cancelar envío</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
