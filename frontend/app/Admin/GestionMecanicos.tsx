// GestionMecanicos.tsx
// Pantalla del panel de administración para gestionar el equipo de mecánicos.
// Permite: registrar, editar, eliminar y activar/desactivar cuentas de mecánicos.

// Hook de React para manejar estado local del componente
import { useState } from 'react';

// Componentes nativos de React Native necesarios para la pantalla
import {
  Alert,               // Diálogos nativos del sistema operativo
  KeyboardAvoidingView,// Evita que el teclado tape los inputs en iOS
  Modal,               // Superposición de contenido sobre la pantalla principal
  Platform,            // Detecta el sistema operativo (iOS / Android)
  Pressable,           // Área táctil con feedback de presión
  ScrollView,          // Vista con scroll vertical
  Text,                // Renderiza texto en pantalla
  TextInput,           // Campo de entrada de texto
  View,                // Contenedor genérico (equivalente a <div>)
} from 'react-native';

// Hook de navegación de Expo Router para redirigir entre pantallas
import { useRouter } from 'expo-router';

// Íconos vectoriales de FontAwesome (pencil, trash, toggle-on, etc.)
import { FontAwesome } from '@expo/vector-icons';

// Barra de navegación del administrador (logo + botón cerrar sesión)
import NavbarAdmin from '@/components/nadvarAdmin/nadvarAdmin';

// Hoja de estilos específica de esta pantalla
import styles from '@/Styles/GestionMecanicos';

// Validaciones reutilizables para formularios
import {
  validarDosPalabras,
  validarSoloNumeros,
  validarTextoYNumeros,
  validarObligatorio,
  validarCorreoGmail,
  validarCorreoMecanic,
  validarContrasena,
} from '@/utils/validaciones';


// TIPOS
// Posibles estados de disponibilidad de un mecánico en el taller
export type EstadoLaboral = 'Disponible' | 'Ocupado' | 'Inactivo';

// Estructura completa de un mecánico registrado en el sistema
export type Mecanico = {
  id: string;                    // Identificador único del mecánico
  nombres: string;               // Nombres del mecánico
  apellidos: string;             // Apellidos del mecánico
  edad: number;                  // Edad en años
  correo: string;                // Correo personal (Gmail, etc.)
  correoEmpresarial: string;     // Correo de acceso al sistema (@mecanic.com)
  especialidadCatalogo: string;  // Especialidad seleccionada del catálogo
  especialidadOtro: string;      // Descripción si la especialidad es "Otros"
  añosExperiencia: number;       // Años de experiencia en el oficio
  estadoLaboral: EstadoLaboral;  // Disponibilidad operativa en el taller
  cuentaActiva: boolean;         // Si puede iniciar sesión en el sistema
  contraseña: string;            // Contraseña de acceso al sistema
};


// CONSTANTES

// Catálogo de especialidades disponibles para asignar a un mecánico
// "as const" hace que TypeScript infiera los tipos literales exactos
const ESPECIALIDADES = [
  'Motor',
  'Frenos',
  'Suspensión',
  'Electricidad automotriz',
  'Aire acondicionado',
  'Transmisión',
  'Diagnóstico computarizado',
  'Enderezado y pintura',
  'Mecánica general',
  'Otros',
] as const;

// Opciones de estado laboral para el dropdown de disponibilidad
const ESTADOS_LABORAL: EstadoLaboral[] = ['Disponible', 'Ocupado', 'Inactivo'];

// Datos de prueba (mock) que simulan mecánicos ya registrados en el sistema
// En producción estos datos vendrán del backend
const MOCK_INICIAL: Mecanico[] = [
  {
    id: 'm-1',
    nombres: 'Luis',
    apellidos: 'Ramírez',
    edad: 34,
    correo: 'luis.ramirez@gmail.com',
    correoEmpresarial: 'luis.r@mecanic.com',
    especialidadCatalogo: 'Motor',
    especialidadOtro: '',
    añosExperiencia: 8,
    estadoLaboral: 'Disponible',
    cuentaActiva: true,
    contraseña: 'temp123',
  },
  {
    id: 'm-2',
    nombres: 'Carla',
    apellidos: 'Mendoza',
    edad: 29,
    correo: 'carla.m@gmail.com',
    correoEmpresarial: 'carla.m@mecanic.com',
    especialidadCatalogo: 'Electricidad automotriz',
    especialidadOtro: '',
    añosExperiencia: 5,
    estadoLaboral: 'Ocupado',
    cuentaActiva: false,
    contraseña: 'temp456',
  },
  {
    id: 'm-3',
    nombres: 'Diego',
    apellidos: 'Torres',
    edad: 41,
    correo: 'diego.t@gmail.com',
    correoEmpresarial: 'diego.t@mecanic.com',
    especialidadCatalogo: 'Otros',
    especialidadOtro: 'Híbridos y alta voltaje',
    añosExperiencia: 12,
    estadoLaboral: 'Inactivo',
    cuentaActiva: true,
    contraseña: 'temp789',
  },
];


// TIPO DEL FORMULARIO DEL MODAL

// Todos los campos del formulario de registro/edición son strings
// (los números se convierten al guardar con parseInt)
type FormState = {
  nombres: string;
  apellidos: string;
  edad: string;                  // String para el TextInput, se parsea al guardar
  correo: string;
  correoEmpresarial: string;
  especialidadCatalogo: string;
  especialidadOtro: string;
  añosExperiencia: string;       // String para el TextInput, se parsea al guardar
  estadoLaboral: EstadoLaboral;
  cuentaActiva: boolean;
  contraseña: string;
};

// Errores de validación del formulario del modal
type FormErrors = {
  nombres: string;
  apellidos: string;
  edad: string;
  correo: string;
  correoEmpresarial: string;
  especialidadCatalogo: string;
  especialidadOtro: string;
  añosExperiencia: string;
  estadoLaboral: string;
  contraseña: string;
};

// FUNCIONES AUXILIARES
// Retorna un FormState vacío para inicializar el formulario de registro
function formVacio(): FormState {
  return {
    nombres: '',
    apellidos: '',
    edad: '',
    correo: '',
    correoEmpresarial: '',
    especialidadCatalogo: 'Motor', // Valor por defecto del dropdown
    especialidadOtro: '',
    añosExperiencia: '',
    estadoLaboral: 'Disponible',   // Estado por defecto
    cuentaActiva: true,            // Nueva cuenta activa por defecto
    contraseña: '',
  };
}

// Convierte un objeto Mecanico al formato FormState para pre-llenar el formulario de edición
function mecanicoAForm(m: Mecanico): FormState {
  return {
    nombres: m.nombres,
    apellidos: m.apellidos,
    edad: String(m.edad),                         // Número → string para el TextInput
    correo: m.correo,
    correoEmpresarial: m.correoEmpresarial,
    especialidadCatalogo: m.especialidadCatalogo,
    especialidadOtro: m.especialidadOtro,
    añosExperiencia: String(m.añosExperiencia),   // Número → string para el TextInput
    estadoLaboral: m.estadoLaboral,
    cuentaActiva: m.cuentaActiva,
    contraseña: m.contraseña,
  };
}

// Retorna el texto de especialidad a mostrar en la tarjeta del mecánico
// Si la especialidad es "Otros" y tiene descripción, muestra la descripción
function textoEspecialidad(m: Mecanico): string {
  if (m.especialidadCatalogo === 'Otros' && m.especialidadOtro.trim()) {
    return m.especialidadOtro.trim(); // Muestra la especialidad personalizada
  }
  return m.especialidadCatalogo;      // Muestra la especialidad del catálogo
}

// Retorna el array de estilos para el pill (badge) de estado laboral
// Cada estado tiene su propio color de fondo
function pillLaboral(estado: EstadoLaboral) {
  if (estado === 'Disponible') return [styles.pill, styles.pillDisponible]; // Verde
  if (estado === 'Ocupado') return [styles.pill, styles.pillOcupado];    // Naranja
  return [styles.pill, styles.pillLabInactivo];                             // Gris
}

// Retorna el array de estilos para el texto del pill de estado laboral
function pillLaboralText(estado: EstadoLaboral) {
  if (estado === 'Disponible') return [styles.pillText, styles.pillDisponibleText];
  if (estado === 'Ocupado') return [styles.pillText, styles.pillOcupadoText];
  return [styles.pillText, styles.pillLabInactivoText];
}

// COMPONENTE PRINCIPAL
export default function GestionMecanicosScreen() {
  // Hook de navegación para redirigir al login al cerrar sesión
  const router = useRouter();

  // Lista de mecánicos registrados (inicia con los datos mock)
  const [lista, setLista] = useState<Mecanico[]>(MOCK_INICIAL);

  // Controla si el modal de registro/edición está visible
  const [modalVisible, setModalVisible] = useState(false);

  // Modo del modal: 'crear' para nuevo mecánico, 'editar' para modificar uno existente
  const [modo, setModo] = useState<'crear' | 'editar'>('crear');

  // ID del mecánico que se está editando (null cuando se está creando)
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Estado del formulario del modal (todos los campos de entrada)
  const [form, setForm] = useState<FormState>(formVacio);

  // Controla si el dropdown de especialidad está abierto
  const [espDropdown, setEspDropdown] = useState(false);

  // Controla si el dropdown de estado laboral está abierto
  const [estadoDropdown, setEstadoDropdown] = useState(false);

  // Controla si la contraseña en el modal se muestra en texto plano
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Errores del formulario de registro/edición
  const [errors, setErrors] = useState<FormErrors>({
    nombres: '',
    apellidos: '',
    edad: '',
    correo: '',
    correoEmpresarial: '',
    especialidadCatalogo: '',
    especialidadOtro: '',
    añosExperiencia: '',
    estadoLaboral: '',
    contraseña: '',
  });

  // FUNCIONES DE CONTROL DEL MODAL

  // Cierra todos los dropdowns abiertos dentro del modal
  const cerrarDropdowns = () => {
    setEspDropdown(false);
    setEstadoDropdown(false);
  };

  // Abre el modal en modo "crear": limpia el formulario y resetea el estado
  const abrirRegistrar = () => {
    cerrarDropdowns();
    setShowModalPassword(false);
    setModo('crear');
    setEditandoId(null);
    setForm(formVacio());          // Formulario vacío para nuevo mecánico
    setErrors({
      nombres: '',
      apellidos: '',
      edad: '',
      correo: '',
      correoEmpresarial: '',
      especialidadCatalogo: '',
      especialidadOtro: '',
      añosExperiencia: '',
      estadoLaboral: '',
      contraseña: '',
    });
    setModalVisible(true);
  };

  // Abre el modal en modo "editar": pre-llena el formulario con los datos del mecánico
  const abrirEditar = (m: Mecanico) => {
    cerrarDropdowns();
    setShowModalPassword(false);
    setModo('editar');
    setEditandoId(m.id);           // Guarda el ID para saber qué mecánico actualizar
    setForm(mecanicoAForm(m));     // Pre-llena el formulario con los datos actuales
    setErrors({
      nombres: '',
      apellidos: '',
      edad: '',
      correo: '',
      correoEmpresarial: '',
      especialidadCatalogo: '',
      especialidadOtro: '',
      añosExperiencia: '',
      estadoLaboral: '',
      contraseña: '',
    });
    setModalVisible(true);
  };

  // Cierra el modal y resetea todo el estado relacionado
  const cerrarModal = () => {
    cerrarDropdowns();
    setShowModalPassword(false);
    setModalVisible(false);
    setEditandoId(null);
    setForm(formVacio());          // Limpia el formulario al cerrar
    setErrors({
      nombres: '',
      apellidos: '',
      edad: '',
      correo: '',
      correoEmpresarial: '',
      especialidadCatalogo: '',
      especialidadOtro: '',
      añosExperiencia: '',
      estadoLaboral: '',
      contraseña: '',
    });
  };

  //FUNCIÓN GUARDAR

  // Valida los datos del formulario y guarda el mecánico (crear o editar)
  const guardar = () => {
    const errorNombres = validarDosPalabras(form.nombres, 'Los nombres');
    const errorApellidos = validarDosPalabras(form.apellidos, 'Los apellidos');
    const errorEdad = validarSoloNumeros(form.edad, 'La edad');
    const errorCorreo = validarCorreoGmail(form.correo);
    const errorCorreoEmpresarial = validarCorreoMecanic(form.correoEmpresarial);
    const errorEspecialidadCatalogo = validarObligatorio(form.especialidadCatalogo, 'La especialidad');
    const errorEspecialidadOtro =
      form.especialidadCatalogo === 'Otros'
        ? validarTextoYNumeros(form.especialidadOtro, 'La especialidad')
        : null;
    const errorAñosExperiencia = validarSoloNumeros(form.añosExperiencia, 'Los años de experiencia');
    const errorEstadoLaboral = validarObligatorio(form.estadoLaboral, 'El estado laboral');
    const errorContraseña = validarContrasena(form.contraseña);

    const edad = Number.isNaN(parseInt(form.edad, 10)) ? NaN : parseInt(form.edad, 10);
    const años = Number.isNaN(parseInt(form.añosExperiencia, 10)) ? NaN : parseInt(form.añosExperiencia, 10);

    const errorEdadRango = !Number.isNaN(edad) && (edad < 16 || edad > 80)
      ? 'La edad debe estar entre 16 y 80 años.'
      : null;
    const errorAñosRango = !Number.isNaN(años) && años < 0
      ? 'Los años de experiencia no pueden ser negativos.'
      : null;

    const nuevosErrores: FormErrors = {
      nombres: errorNombres ?? '',
      apellidos: errorApellidos ?? '',
      edad: errorEdad ?? errorEdadRango ?? '',
      correo: errorCorreo ?? '',
      correoEmpresarial: errorCorreoEmpresarial ?? '',
      especialidadCatalogo: errorEspecialidadCatalogo ?? '',
      especialidadOtro: errorEspecialidadOtro ?? '',
      añosExperiencia: errorAñosExperiencia ?? errorAñosRango ?? '',
      estadoLaboral: errorEstadoLaboral ?? '',
      contraseña: errorContraseña ?? '',
    };

    setErrors(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some((value) => value.length > 0);
    if (hayErrores) return;

    const base: Mecanico = {
      id: editandoId ?? `m-${Date.now()}`,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      edad,
      correo: form.correo.trim(),
      correoEmpresarial: form.correoEmpresarial.trim().toLowerCase(),
      especialidadCatalogo: form.especialidadCatalogo,
      especialidadOtro: form.especialidadCatalogo === 'Otros' ? form.especialidadOtro.trim() : '',
      añosExperiencia: años,
      estadoLaboral: form.estadoLaboral,
      cuentaActiva: form.cuentaActiva,
      contraseña: form.contraseña.trim(),
    };

    if (modo === 'crear') {
      setLista((prev) => [...prev, base]);
    } else if (editandoId) {
      setLista((prev) => prev.map((x) => (x.id === editandoId ? { ...base, id: editandoId } : x)));
    }

    cerrarModal();
  };

  //FUNCIÓN ELIMINAR
  // Muestra un diálogo de confirmación antes de eliminar un mecánico
  const eliminar = (m: Mecanico) => {
    Alert.alert(
      'Eliminar mecánico',
      `¿Eliminar a ${m.nombres} ${m.apellidos}? Esta acción es de demostración.`,
      [
        { text: 'Cancelar', style: 'cancel' },                          // No hace nada
        {
          text: 'Eliminar',
          style: 'destructive',                                          // Texto rojo en iOS
          onPress: () => setLista((prev) => prev.filter((x) => x.id !== m.id)), // Filtra el mecánico
        },
      ],
    );
  };

  //FUNCIÓN TOGGLE CUENTA

  // Alterna el estado de cuentaActiva del mecánico (activa ↔ inactiva)
  const toggleCuenta = (m: Mecanico) => {
    setLista((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, cuentaActiva: !x.cuentaActiva } : x)),
    );
  };

  //CERRAR SESIÓN

  // Redirige al login (cierre de sesión del administrador)
  const handleSignOut = () => {
    router.replace('/(auth)/login' as any);
  };

  // RENDER
  return (
    // Contenedor raíz que ocupa toda la pantalla
    <View style={styles.page}>

      {/* Barra de navegación del admin con botón de cerrar sesión */}
      <NavbarAdmin onSignOut={handleSignOut} />

      {/* ScrollView principal con la lista de mecánicos */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Cierra el teclado al tocar fuera de un input
      >
        {/* Título centrado de la pantalla */}
        <Text style={styles.screenTitle}>Gestión de mecánicos</Text>

        {/* Subtítulo informativo */}
        <Text style={styles.screenSubtitle}>
          Disponibilidad en taller y cuenta de acceso son independientes.
        </Text>

        {/* Botón para abrir el modal de registro de nuevo mecánico
            Blanco en reposo → azul al presionar */}
        <Pressable
          onPress={abrirRegistrar}
          style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
        >
          {({ pressed }) => (
            <Text style={[styles.registerBtnText, pressed && styles.registerBtnTextPressed]}>
              Registrar mecánico
            </Text>
          )}
        </Pressable>

        {/* Itera sobre la lista de mecánicos para renderizar una tarjeta por cada uno */}
        {lista.map((m) => (
          <View key={m.id} style={styles.rowCard}>

            {/* Parte superior de la tarjeta: nombre/meta a la izquierda, badges a la derecha */}
            <View style={styles.rowCardTop}>

              {/* Bloque de nombre y metadata del mecánico */}
              <View style={styles.nameBlock}>
                {/* Nombre completo del mecánico */}
                <Text style={styles.mechanicName} numberOfLines={2}>
                  {m.nombres} {m.apellidos}
                </Text>
                {/* Edad y especialidad como metadata secundaria */}
                <Text style={styles.mechanicMeta} numberOfLines={2}>
                  {m.edad} años · {textoEspecialidad(m)}
                </Text>
              </View>

              {/* Fila de badges (pills) de estado */}
              <View style={styles.badgeRow}>
                {/* Badge de estado laboral: verde/naranja/gris según disponibilidad */}
                <View style={pillLaboral(m.estadoLaboral)}>
                  <Text style={pillLaboralText(m.estadoLaboral)}>{m.estadoLaboral}</Text>
                </View>

                {/* Badge de estado de cuenta: azul si activa, rojo si inactiva */}
                <View
                  style={[
                    styles.pill,
                    m.cuentaActiva ? styles.pillCuentaOn : styles.pillCuentaOff,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      m.cuentaActiva ? styles.pillCuentaOnText : styles.pillCuentaOffText,
                    ]}
                  >
                    {m.cuentaActiva ? 'Cuenta activa' : 'Cuenta inactiva'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Línea divisoria entre la info y los botones de acción */}
            <View style={styles.divider} />

            {/* Fila de botones de acción */}
            <View style={styles.actionsRow}>

              {/* Botón Editar: abre el modal en modo edición con los datos del mecánico */}
              <Pressable
                onPress={() => abrirEditar(m)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.btnEdit,
                  pressed && styles.btnEditPressed, // Azul más oscuro al presionar
                ]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    {/* Ícono de lápiz */}
                    <FontAwesome name="pencil" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnEditText, pressed && styles.btnEditTextPressed]}>
                      Editar
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Botón Eliminar: muestra diálogo de confirmación antes de eliminar */}
              <Pressable
                onPress={() => eliminar(m)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.btnDelete,
                  pressed && styles.btnDeletePressed, // Rojo más oscuro al presionar
                ]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    {/* Ícono de papelera */}
                    <FontAwesome name="trash" size={12} color="#FFFFFF" style={styles.btnIcon} />
                    <Text style={[styles.actionBtnText, styles.btnDeleteText, pressed && styles.btnDeleteTextPressed]}>
                      Eliminar
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Botón Activar/Desactivar cuenta: alterna el estado de cuentaActiva
                  Color gris si activa (para desactivar), verde si inactiva (para activar) */}
              <Pressable
                onPress={() => toggleCuenta(m)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  m.cuentaActiva ? styles.btnCuentaOn : styles.btnCuentaOff,
                  pressed && (m.cuentaActiva ? styles.btnCuentaOnPressed : styles.btnCuentaOffPressed),
                ]}
              >
                {({ pressed }) => (
                  <View style={styles.btnInnerRow}>
                    {/* Ícono toggle-on si activa, toggle-off si inactiva */}
                    <FontAwesome
                      name={m.cuentaActiva ? 'toggle-on' : 'toggle-off'}
                      size={12}
                      color="#FFFFFF"
                      style={styles.btnIcon}
                    />
                    <Text style={[
                      styles.actionBtnText,
                      m.cuentaActiva ? styles.btnCuentaOnText : styles.btnCuentaOffText,
                      pressed && (m.cuentaActiva ? styles.btnCuentaOnTextPressed : styles.btnCuentaOffTextPressed),
                    ]}>
                      {/* Texto dinámico según el estado actual de la cuenta */}
                      {m.cuentaActiva ? 'Desactivar cuenta' : 'Activar cuenta'}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/*
          MODAL DE REGISTRO y EDICIÓN DE MECÁNICO
          Se muestra sobre toda la pantalla con fondo semitransparente.
          KeyboardAvoidingView evita que el teclado tape los inputs en iOS.*/}
      <Modal
        visible={modalVisible}          // Visible cuando modalVisible === true
        animationType="fade"            // Aparece con transición de opacidad
        transparent                     // Fondo semitransparente (no bloquea la vista)
        onRequestClose={cerrarModal}    // Cierra al presionar el botón atrás en Android
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Solo ajusta en iOS
        >
          {/* Tarjeta principal del modal */}
          <View style={styles.modalCard}>

            {/* Cabecera del modal: título, subtítulo, badge y botón cerrar */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>

                {/* Título dinámico según el modo del modal */}
                <Text style={styles.modalTitle}>
                  {modo === 'crear' ? 'Registrar mecánico' : 'Editar mecánico'}
                </Text>

                {/* Subtítulo con instrucciones contextuales */}
                <Text style={styles.modalSubtitle}>
                  {modo === 'crear'
                    ? 'Añade un profesional al equipo. Los campos con contexto te guían en cada paso.'
                    : 'Actualiza los datos del mecánico. La cuenta y la disponibilidad en taller son independientes.'}
                </Text>

                {/* Badge que indica el modo actual del modal */}
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>
                    {modo === 'crear' ? 'Nuevo ingreso' : 'Edición'}
                  </Text>
                </View>
              </View>

              {/* Botón X para cerrar el modal — rojo con X blanca */}
              <Pressable
                onPress={cerrarModal}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
                hitSlop={8} // Área de toque extra alrededor del botón
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Contenido scrolleable del modal (formulario) */}
            <ScrollView
              keyboardShouldPersistTaps="handled" // Cierra el teclado al tocar fuera
              nestedScrollEnabled                  // Permite scroll dentro del modal
              showsVerticalScrollIndicator={false} // Oculta la barra de scroll
              contentContainerStyle={styles.modalScrollContent}
            >

              {/*SECCIÓN: DATOS PERSONALES*/}
              <View style={[styles.modalSection, styles.modalSectionFirst]}>
                <Text style={styles.modalSectionTitle}>Datos personales</Text>

                {/* Campo: Nombres */}
                <Text style={[styles.label, styles.labelFirstInSection]}>Nombres</Text>
                <TextInput
                  style={[styles.input, errors.nombres ? styles.inputError : null]}
                  placeholder="Nombres"
                  placeholderTextColor="#64748B"
                  value={form.nombres}
                  onChangeText={(t) => { setForm((p) => ({ ...p, nombres: t })); setErrors((e) => ({ ...e, nombres: '' })); }}
                />
                {errors.nombres ? <Text style={styles.errorText}>{errors.nombres}</Text> : null}

                {/* Campo: Apellidos */}
                <Text style={styles.label}>Apellidos</Text>
                <TextInput
                  style={[styles.input, errors.apellidos ? styles.inputError : null]}
                  placeholder="Apellidos"
                  placeholderTextColor="#64748B"
                  value={form.apellidos}
                  onChangeText={(t) => { setForm((p) => ({ ...p, apellidos: t })); setErrors((e) => ({ ...e, apellidos: '' })); }}
                />
                {errors.apellidos ? <Text style={styles.errorText}>{errors.apellidos}</Text> : null}

                {/* Campo: Edad — teclado numérico */}
                <Text style={styles.label}>Edad</Text>
                <TextInput
                  style={[styles.input, errors.edad ? styles.inputError : null]}
                  placeholder="Edad"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={form.edad}
                  onChangeText={(t) => { setForm((p) => ({ ...p, edad: t })); setErrors((e) => ({ ...e, edad: '' })); }}
                />
                {errors.edad ? <Text style={styles.errorText}>{errors.edad}</Text> : null}
              </View>

              {/*SECCIÓN: CONTACTO*/}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Contacto</Text>

                {/* Campo: Correo personal */}
                <Text style={[styles.label, styles.labelFirstInSection]}>Correo electrónico</Text>
                <TextInput
                  style={[styles.input, errors.correo ? styles.inputError : null]}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"           // No capitaliza automáticamente
                  value={form.correo}
                  onChangeText={(t) => { setForm((p) => ({ ...p, correo: t })); setErrors((e) => ({ ...e, correo: '' })); }}
                />
                {errors.correo ? <Text style={styles.errorText}>{errors.correo}</Text> : null}

                {/* Campo: Correo empresarial (@mecanic.com) */}
                <Text style={styles.label}>Correo empresarial</Text>
                <TextInput
                  style={[styles.input, errors.correoEmpresarial ? styles.inputError : null]}
                  placeholder="nombre@mecanic.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.correoEmpresarial}
                  onChangeText={(t) => { setForm((p) => ({ ...p, correoEmpresarial: t })); setErrors((e) => ({ ...e, correoEmpresarial: '' })); }}
                />
                {errors.correoEmpresarial ? <Text style={styles.errorText}>{errors.correoEmpresarial}</Text> : null}
              </View>

              {/*SECCIÓN: PERFIL PROFESIONAL*/}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Perfil profesional</Text>

                {/* Dropdown de especialidad: abre/cierra al presionar */}
                <Pressable
                  style={[styles.dropdown, espDropdown && styles.dropdownOpen, errors.especialidadCatalogo ? styles.inputError : null]}
                  onPress={() => {
                    setEstadoDropdown(false); // Cierra el otro dropdown si está abierto
                    setEspDropdown((v) => !v);
                  }}
                >
                  {/* Muestra la especialidad seleccionada */}
                  <Text style={styles.dropdownText}>{form.especialidadCatalogo}</Text>
                  <View style={styles.dropdownChevronWrap}>
                    {/* Flecha ▲ cuando abierto, ▼ cuando cerrado */}
                    <Text style={styles.dropdownArrow}>{espDropdown ? '▲' : '▼'}</Text>
                  </View>
                </Pressable>

                {/* Lista de opciones del dropdown de especialidad */}
                {espDropdown && (
                  <ScrollView
                    style={styles.dropdownList}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {ESPECIALIDADES.map((opt, i) => (
                      <Pressable
                        key={opt}
                        style={[
                          styles.dropdownItem,
                          i === ESPECIALIDADES.length - 1 && styles.dropdownItemLast, // Sin borde en el último
                          form.especialidadCatalogo === opt && styles.dropdownItemActive, // Resalta la seleccionada
                        ]}
                        onPress={() => {
                          setForm((p) => ({ ...p, especialidadCatalogo: opt }));
                          setErrors((e) => ({ ...e, especialidadCatalogo: '' }));
                          setEspDropdown(false); // Cierra el dropdown al seleccionar
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {errors.especialidadCatalogo ? <Text style={styles.errorText}>{errors.especialidadCatalogo}</Text> : null}

                {/* Campo extra: solo visible cuando la especialidad es "Otros" */}
                {form.especialidadCatalogo === 'Otros' && (
                  <>
                    <Text style={styles.label}>Describe la especialidad</Text>
                    <TextInput
                      style={[styles.input, errors.especialidadOtro ? styles.inputError : null]}
                      placeholder="Ej.: preparación de rally, GLP…"
                      placeholderTextColor="#64748B"
                      value={form.especialidadOtro}
                      onChangeText={(t) => { setForm((p) => ({ ...p, especialidadOtro: t })); setErrors((e) => ({ ...e, especialidadOtro: '' })); }}
                    />
                    {errors.especialidadOtro ? <Text style={styles.errorText}>{errors.especialidadOtro}</Text> : null}
                  </>
                )}

                {/* Campo: Años de experiencia */}
                <Text style={styles.label}>Años de experiencia</Text>
                <TextInput
                  style={[styles.input, errors.añosExperiencia ? styles.inputError : null]}
                  placeholder="Años"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={form.añosExperiencia}
                  onChangeText={(t) => { setForm((p) => ({ ...p, añosExperiencia: t })); setErrors((e) => ({ ...e, añosExperiencia: '' })); }}
                />
                {errors.añosExperiencia ? <Text style={styles.errorText}>{errors.añosExperiencia}</Text> : null}
              </View>

              {/*SECCIÓN: DISPONIBILIDAD EN TALLER*/}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Disponibilidad en taller</Text>

                {/* Texto de ayuda: aclara que este campo no afecta el acceso al sistema */}
                <Text style={styles.labelHint}>
                  Solo afecta cómo se muestra la disponibilidad operativa (no el acceso al sistema).
                </Text>

                {/* Dropdown de estado laboral */}
                <Pressable
                  style={[styles.dropdown, estadoDropdown && styles.dropdownOpen, errors.estadoLaboral ? styles.inputError : null]}
                  onPress={() => {
                    setEspDropdown(false); // Cierra el otro dropdown si está abierto
                    setEstadoDropdown((v) => !v);
                  }}
                >
                  <Text style={styles.dropdownText}>{form.estadoLaboral}</Text>
                  <View style={styles.dropdownChevronWrap}>
                    <Text style={styles.dropdownArrow}>{estadoDropdown ? '▲' : '▼'}</Text>
                  </View>
                </Pressable>

                {/* Lista de opciones del dropdown de estado laboral */}
                {estadoDropdown && (
                  <View style={styles.dropdownList}>
                    {ESTADOS_LABORAL.map((opt, i) => (
                      <Pressable
                        key={opt}
                        style={[
                          styles.dropdownItem,
                          i === ESTADOS_LABORAL.length - 1 && styles.dropdownItemLast,
                          form.estadoLaboral === opt && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setForm((p) => ({ ...p, estadoLaboral: opt }));
                          setErrors((e) => ({ ...e, estadoLaboral: '' }));
                          setEstadoDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                {errors.estadoLaboral ? <Text style={styles.errorText}>{errors.estadoLaboral}</Text> : null}
              </View>

              {/*SECCIÓN: CONTRASEÑA */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Contraseña</Text>

                {/* Etiqueta dinámica: indica que en edición el campo vacío conserva la contraseña */}
                <Text style={styles.label}>
                  {modo === 'editar' ? 'Contraseña' : 'Contraseña'}
                </Text>

                {/* Fila: input de contraseña + botón ojo para mostrar/ocultar */}
                <View style={[styles.modalPasswordRow, errors.contraseña ? styles.inputError : null]}>
                  <TextInput
                    style={styles.modalPasswordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#64748B"
                    secureTextEntry={!showModalPassword} // Oculta el texto si showModalPassword es false
                    value={form.contraseña}
                    onChangeText={(t) => { setForm((p) => ({ ...p, contraseña: t })); setErrors((e) => ({ ...e, contraseña: '' })); }}
                  />

                  {/* Botón ojo: alterna entre mostrar y ocultar la contraseña */}
                  <Pressable
                    onPress={() => setShowModalPassword((v) => !v)}
                    style={styles.eyeBtn}
                    hitSlop={8}
                  >
                    {/* eye-slash cuando visible, eye cuando oculta */}
                    <FontAwesome
                      name={showModalPassword ? 'eye-slash' : 'eye'}
                      size={20}
                      color="#94A3B8"
                    />
                  </Pressable>
                </View>
                {/* Mensaje de error de contraseña */}
                {errors.contraseña ? <Text style={styles.errorText}>{errors.contraseña}</Text> : null}
              </View>

              {/* Botón guardar: ejecuta la función guardar() con validaciones
                  Blanco en reposo → azul al presionar */}
              <Pressable
                style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
                onPress={guardar}
              >
                {({ pressed }) => (
                  <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                    {/* Texto dinámico según el modo del modal */}
                    {modo === 'crear' ? 'Registrar mecánico' : 'Guardar cambios'}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
