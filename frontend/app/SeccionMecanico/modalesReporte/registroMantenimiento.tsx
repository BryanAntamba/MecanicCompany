// registroMantenimiento.tsx
// Modal para registrar el mantenimiento realizado a una solicitud CON SISTEMA DE REPUESTOS

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import * as ImagePicker from '@/utils/imagePicker';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'react-native';
import styles from '../../../Styles/pantallaMecanico/modalesReporte/registroMantenimiento';
import { type Producto } from '@/utils/datosSimulados';
import { productosApi, solicitudesApi, mantenimientosApi } from '@/utils/api';
import {
  validarTextoNumerosCaracteresEspeciales,
} from '@/utils/validaciones';
import { manejarCambioPrecioEstadounidense } from '@/utils/formatNumbers';
import { useAuth } from '@/context/AuthContext';

const TIPOS_TRABAJO = [
  'Cambio de aceite',
  'Revisión de frenos',
  'Alineación y balanceo',
  'Cambio de neumáticos',
  'Revisión de motor',
  'Cambio de filtros',
  'Diagnóstico computarizado',
  'Reparación de suspensión',
  'Reparación eléctrica',
  'Otros',
] as const;

// Asociación de trabajos con productos
const TRABAJOS_CON_PRODUCTOS: Record<string, string[]> = {
  'Cambio de aceite': ['Filtro de aceite', 'ACEITE MOTOR'], // Productos que incluyan "aceite" o "filtro"
  'Revisión de frenos': ['PASTILLAS'], // Productos con "freno" o "pastilla"
  'Revisión de motor': ['Bujía', 'Correa'], // Bujías y correas
  'Cambio de filtros': ['Filtro'], // Cualquier filtro
  'Diagnóstico computarizado': ['Bujía'], // Bujías
  'Reparación eléctrica': ['Alternador', 'Batería'], // Partes eléctricas
  'Reparación de suspensión': ['Amortiguador'], // Amortiguadores
  'Alineación y balanceo': [],
  'Cambio de neumáticos': [],
  'Otros': [],
};

// Constantes compartidas con sistemaInventario.tsx
const MARCAS_COMPONENTES = [
  'ACDelco', 'Aisin', 'Bosch', 'Brembo', 'Champion', 'Dayco', 'Denso', 'Delphi',
  'Eaton', 'EBC', 'Exedy', 'Ferodo', 'Gates', 'GKN', 'Goodridge', 'Hella',
  'Holley', 'KYB', 'Lucas', 'Mahle', 'Mann-Filter', 'Mevotech', 'Moog',
  'Monroe', 'NGK', 'NTN', 'Pennzoil', 'Pertronix', 'Sachs', 'SKF',
  'Timken', 'TRW', 'Valeo', 'Wagner', 'Wix', 'ZF', 'Otro'
];

const MARCAS_VEHICULOS = [
  'Chevrolet', 'Toyota', 'Ford', 'Nissan', 'Honda', 'Mazda', 'Hyundai',
  'Kia', 'Volkswagen', 'Renault', 'Suzuki', 'Mitsubishi', 'Jeep', 'RAM', 'Otro'
];

const MODELOS_BASE_POR_MARCA: Record<string, string[]> = {
  Chevrolet: ['Aveo', 'Spark', 'Cruze', 'Sail', 'Onix', 'Tracker', 'Captiva', 'Colorado', 'Silverado'],
  Toyota: ['Corolla', 'Yaris', 'Hilux', 'RAV4', 'Land Cruiser', 'Prado', 'Fortuner', 'Camry'],
  Ford: ['Fiesta', 'Focus', 'Escape', 'Explorer', 'F-150', 'Ranger', 'Mustang', 'Edge'],
  Nissan: ['Versa', 'Sentra', 'Altima', 'X-Trail', 'Kicks', 'Frontier', 'Pathfinder', 'Murano'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Fit', 'Pilot', 'Odyssey'],
  Mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'BT-50'],
  Hyundai: ['Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Kona'],
  Kia: ['Rio', 'Forte', 'Optima', 'Sportage', 'Sorento', 'Seltos', 'Soul'],
  Volkswagen: ['Gol', 'Polo', 'Jetta', 'Tiguan', 'Amarok', 'Passat', 'Atlas'],
  Renault: ['Logan', 'Sandero', 'Duster', 'Stepway', 'Kwid', 'Captur', 'Koleos'],
  Suzuki: ['Swift', 'Vitara', 'Jimny', 'Baleno', 'S-Cross', 'Ertiga'],
  Mitsubishi: ['Mirage', 'Lancer', 'Outlander', 'Montero', 'L200', 'Eclipse Cross'],
  Jeep: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator'],
  RAM: ['1500', '2500', '3500', '700']
};

const agregarPrefijo = (marca: string, modelos: string[]) => 
  modelos.map(modelo => `${marca} ${modelo}`);

const MODELOS_POR_MARCA: Record<string, string[]> = Object.keys(MODELOS_BASE_POR_MARCA).reduce(
  (acc, marca) => {
    acc[marca] = agregarPrefijo(marca, MODELOS_BASE_POR_MARCA[marca]);
    return acc;
  },
  {} as Record<string, string[]>
);

const TODOS_LOS_MODELOS = Object.values(MODELOS_POR_MARCA)
  .flat()
  .sort((a, b) => a.localeCompare(b));

interface RegistroMantenimientoProps {
  visible: boolean;
  solicitud: any | null;
  onClose: () => void;
  onSuccess: (solicitud: any, repuestosSeleccionados: RepuestoSeleccionado[]) => void;
  onShowSuccessModal: () => void;
}

// Interface para repuestos seleccionados
interface RepuestoSeleccionado {
  id: string;
  nombre: string;
  codigoSKU: string;
  marcaComponente: string;
  categoria: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function RegistroMantenimiento({
  visible,
  solicitud,
  onClose,
  onSuccess,
  onShowSuccessModal,
}: RegistroMantenimientoProps) {
  const { token, user } = useAuth();
  
  // Obtener nombre del mecánico desde la sesión
  const nombreMecanico = user ? `${user.nombres} ${user.apellidos}` : 'No asignado';
  
  // Estados para todos los campos del mantenimiento
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajoRealizadoTipo, setTrabajoRealizadoTipo] = useState('Cambio de aceite');
  const [otroTrabajo, setOtroTrabajo] = useState('');
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState('');
  const [costoManoObra, setCostoManoObra] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFinalizacion, setFechaFinalizacion] = useState<Date | null>(null);
  const [fotoVehiculo, setFotoVehiculo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [trabajoDropdownOpen, setTrabajoDropdownOpen] = useState(false);

  // Estados de modales de calendario
  const [calendarInicioVisible, setCalendarInicioVisible] = useState(false);
  const [calendarFinalizacionVisible, setCalendarFinalizacionVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // ========== SISTEMA DE BÚSQUEDA DE REPUESTOS ==========
  // Orden de filtrado: 1) Tipo de Trabajo → 2) Marca del Repuesto → 3) Seleccionar Producto
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [marcaDropdownOpen, setMarcaDropdownOpen] = useState(false);
  const [productoDropdownOpen, setProductoDropdownOpen] = useState(false);
  
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<RepuestoSeleccionado[]>([]);

  // Estados de error
  const [errDiagnostico, setErrDiagnostico] = useState('');
  const [errOtroTrabajo, setErrOtroTrabajo] = useState('');
  const [errDiagnosticoRealizado, setErrDiagnosticoRealizado] = useState('');
  const [errCostoManoObra, setErrCostoManoObra] = useState('');
  const [errObservaciones, setErrObservaciones] = useState('');
  const [errFechaInicio, setErrFechaInicio] = useState('');
  const [errFechaFinalizacion, setErrFechaFinalizacion] = useState('');
  const [errRepuestos, setErrRepuestos] = useState('');

  // Cargar productos disponibles desde la API real
  useEffect(() => {
    if (visible) {
      const cargarProductos = async () => {
        try {
          const respuesta = await productosApi.listar();
          if (respuesta && respuesta.productos) {
            setProductosDisponibles(respuesta.productos);
          }
          setProductosFiltrados([]);
        } catch (error) {
          console.error('Error cargando productos:', error);
          Alert.alert('Error', 'No se pudieron cargar los productos');
          setProductosDisponibles([]);
        }
      };
      cargarProductos();
    }
  }, [visible]);

  // Ejecutar búsqueda automáticamente cuando cambian los filtros o el tipo de trabajo
  useEffect(() => {
    buscarProductos();
  }, [marcaFiltro, trabajoRealizadoTipo, productosDisponibles]);

  // Obtener marcas de productos disponibles para el trabajo seleccionado
  const obtenerMarcasProducto = (): string[] => {
    const productosDelTrabajo = obtenerProductosPorTrabajo();
    const marcas = new Set(productosDelTrabajo.map(p => p.marcaComponente));
    return Array.from(marcas).sort();
  };

  // Función para obtener productos compatibles con el trabajo realizado
  const obtenerProductosPorTrabajo = (): Producto[] => {
    if (!trabajoRealizadoTipo || trabajoRealizadoTipo === 'Otros') return productosDisponibles;
    
    const palabrasClave = TRABAJOS_CON_PRODUCTOS[trabajoRealizadoTipo] || [];
    if (palabrasClave.length === 0) return [];
    
    return productosDisponibles.filter(p => 
      palabrasClave.some(palabra => 
        p.nombreProducto?.toUpperCase().includes(palabra.toUpperCase()) ||
        p.marcaComponente?.toUpperCase().includes(palabra.toUpperCase())
      )
    );
  };

  // Función de búsqueda simplificada
  const buscarProductos = () => {
    // Filtrar por tipo de trabajo
    let resultados = obtenerProductosPorTrabajo();

    // Filtro por marca del repuesto
    if (marcaFiltro) {
      resultados = resultados.filter(p => p.marcaComponente === marcaFiltro);
    }

    setProductosFiltrados(resultados);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setMarcaFiltro('');
    setMarcaDropdownOpen(false);
    setProductoDropdownOpen(false);
    setProductosFiltrados([]);
  };

  // Agregar repuesto a la selección
  const agregarRepuesto = (producto: Producto) => {
    // Verificar que no esté ya agregado
    if (repuestosSeleccionados.some(r => r.id === producto.id)) {
      return;
    }

    const nuevoRepuesto: RepuestoSeleccionado = {
      id: producto.id,
      nombre: producto.nombreProducto,
      codigoSKU: producto.codigoSKU,
      marcaComponente: producto.marcaComponente,
      categoria: producto.categoria,
      precio: Number(producto.precioVenta),
      cantidad: 1,
      subtotal: Number(producto.precioVenta),
    };

    setRepuestosSeleccionados([...repuestosSeleccionados, nuevoRepuesto]);
  };

  // Eliminar repuesto de la selección
  const eliminarRepuesto = (id: string) => {
    setRepuestosSeleccionados(repuestosSeleccionados.filter(r => r.id !== id));
  };

  // Actualizar cantidad de repuesto
  const actualizarCantidadRepuesto = (id: string, cantidad: number) => {
    if (cantidad < 1) return;
    
    const producto = productosDisponibles.find(p => p.id === id);
    if (!producto) return;

    // Verificar stock disponible
    if (cantidad > producto.stockActual) {
      return; // No permitir cantidad mayor al stock
    }

    setRepuestosSeleccionados(repuestosSeleccionados.map(r => 
      r.id === id 
        ? { ...r, cantidad, subtotal: r.precio * cantidad }
        : r
    ));
  };

  // Calcular subtotal de repuestos
  const calcularSubtotalRepuestos = (): number => {
    return repuestosSeleccionados.reduce((sum, r) => sum + r.subtotal, 0);
  };

  // Calcular costo total
  const calcularCostoTotal = (): number => {
    const manoObra = parseFloat(costoManoObra.replace(/,/g, '')) || 0;
    const repuestos = calcularSubtotalRepuestos();
    return manoObra + repuestos;
  };

  // Bloquear capturas de pantalla cuando el modal está visible (solo en móvil)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    
    if (visible) {
      const preventCapture = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
      };
      preventCapture();
    }
  }, [visible]);

  // Cargar datos existentes si los hay
  useEffect(() => {
    if (solicitud) {
      setDiagnostico(solicitud.diagnostico || '');
      setTrabajoRealizadoTipo(solicitud.trabajoRealizado || 'Cambio de aceite');
      setOtroTrabajo(solicitud.otroTrabajo || '');
      setDiagnosticoRealizado(solicitud.diagnosticoRealizado || '');
      setCostoManoObra(solicitud.costoManoObra || '');
      setObservaciones(solicitud.observaciones || '');
      
      // Cargar repuestos si existen, o limpiar si no existen
      if (solicitud.repuestosSeleccionados && solicitud.repuestosSeleccionados.length > 0) {
        setRepuestosSeleccionados(solicitud.repuestosSeleccionados);
      } else {
        setRepuestosSeleccionados([]);
      }
      
      // Fechas
      if (solicitud.fechaInicio) {
        const [d, m, y] = solicitud.fechaInicio.split('/');
        setFechaInicio(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
      } else {
        setFechaInicio(null);
      }
      if (solicitud.fechaFinalizacion) {
        const [d, m, y] = solicitud.fechaFinalizacion.split('/');
        setFechaFinalizacion(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
      } else {
        setFechaFinalizacion(null);
      }
      
      // Limpiar errores
      setErrDiagnostico('');
      setErrOtroTrabajo('');
      setErrDiagnosticoRealizado('');
      setErrCostoManoObra('');
      setErrObservaciones('');
      setErrFechaInicio('');
      setErrFechaFinalizacion('');
      setErrRepuestos('');
    }
  }, [solicitud]);

  // Limpiar todo cuando el modal se cierra
  useEffect(() => {
    if (!visible) {
      // Resetear todos los estados cuando el modal se cierra
      setDiagnostico('');
      setTrabajoRealizadoTipo('Cambio de aceite');
      setOtroTrabajo('');
      setDiagnosticoRealizado('');
      setCostoManoObra('');
      setObservaciones('');
      setFechaInicio(null);
      setFechaFinalizacion(null);
      setFotoVehiculo(null);
      setRepuestosSeleccionados([]);
      setMarcaFiltro('');
      setProductosFiltrados([]);
      setProductoDropdownOpen(false);
      setMarcaDropdownOpen(false);
      
      // Limpiar errores
      setErrDiagnostico('');
      setErrOtroTrabajo('');
      setErrDiagnosticoRealizado('');
      setErrCostoManoObra('');
      setErrObservaciones('');
      setErrFechaInicio('');
      setErrFechaFinalizacion('');
      setErrRepuestos('');
    }
  }, [visible]);

  // Funciones auxiliares de calendario
  const buildCalendarDays = (monthStart: Date): (Date | null)[] => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks: null[] = Array(firstWeekday).fill(null);
    const days: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    const dateYear = date.getFullYear();
    
    // Bloquear fechas anteriores a hoy
    if (date < today) return true;
    
    // Bloquear fechas de años futuros (solo permitir año actual)
    if (dateYear > currentYear) return true;
    
    return false;
  };

  const isDateFinalizacionDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    const dateYear = date.getFullYear();
    
    // Bloquear fechas anteriores a hoy
    if (date < today) return true;
    
    // Bloquear fechas de años futuros (solo permitir año actual)
    if (dateYear > currentYear) return true;
    
    // Si existe fecha de inicio, bloquear fechas anteriores a ella
    if (fechaInicio) {
      const inicioComparable = new Date(fechaInicio);
      inicioComparable.setHours(0, 0, 0, 0);
      if (date < inicioComparable) return true;
    }
    
    return false;
  };

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar';

  const formatDateDDMMYYYY = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Verificar si todos los campos están llenos
  const todosLosCamposLlenos = () => {
    const camposBasicos = 
      (diagnostico?.trim() || '') !== '' &&
      (diagnosticoRealizado?.trim() || '') !== '' &&
      (costoManoObra?.trim() || '') !== '' &&
      (observaciones?.trim() || '') !== '' &&
      fechaInicio !== null &&
      fechaFinalizacion !== null &&
      repuestosSeleccionados.length > 0;
    
    const campoTrabajo = trabajoRealizadoTipo === 'Otros' 
      ? (otroTrabajo?.trim() || '') !== ''
      : true;
    
    return camposBasicos && campoTrabajo;
  };

  // Verificar si al menos un campo tiene datos
  const tieneDatos = () => {
    return (
      (diagnostico?.trim() || '') !== '' ||
      (otroTrabajo?.trim() || '') !== '' ||
      (diagnosticoRealizado?.trim() || '') !== '' ||
      (costoManoObra?.trim() || '') !== '' ||
      (observaciones?.trim() || '') !== '' ||
      fechaInicio !== null ||
      fechaFinalizacion !== null ||
      repuestosSeleccionados.length > 0
    );
  };

  // Capturar foto del vehículo
  const capturarFotoVehiculo = async () => {
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para capturar la foto del vehículo');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!resultado.cancelled && resultado.assets && resultado.assets.length > 0) {
        const uri = resultado.assets[0].uri;
        console.log('[registroMantenimiento] 📸 Foto seleccionada:', uri);

        // Convertir a base64
        try {
          let fotoBase64: string;

          // En web: usar fetch para leer el archivo
          if (Platform.OS === 'web') {
            try {
              const response = await fetch(uri);
              const blob = await response.blob();
              const reader = new FileReader();
              
              fotoBase64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                  const result = reader.result as string;
                  // El resultado ya es data:image/...;base64,...
                  resolve(result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (webError) {
              console.error('[registroMantenimiento] ❌ Error en web:', webError);
              // Fallback: usar el URI directamente si es un data URL
              if (uri.startsWith('data:')) {
                fotoBase64 = uri;
              } else {
                throw webError;
              }
            }
          } else {
            // En móvil: usar FileSystem
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: 'base64',
            });
            fotoBase64 = `data:image/jpeg;base64,${base64}`;
          }

          console.log('[registroMantenimiento] ✅ Foto convertida a base64. Tamaño:', fotoBase64.length);
          setFotoVehiculo(fotoBase64);
        } catch (convertError) {
          console.error('[registroMantenimiento] ❌ Error convirtiendo a base64:', convertError);
          Alert.alert('Error', 'No se pudo procesar la imagen');
        }
      }
    } catch (error) {
      console.error('Error capturando foto:', error);
      Alert.alert('Error', 'No se pudo capturar la foto del vehículo');
    }
  };

  const guardar = async () => {
    if (!solicitud) return;

    // Limpiar errores primero
    setErrDiagnostico('');
    setErrOtroTrabajo('');
    setErrDiagnosticoRealizado('');
    setErrCostoManoObra('');
    setErrObservaciones('');
    setErrFechaInicio('');
    setErrFechaFinalizacion('');
    setErrRepuestos('');

    // Determinar el nuevo estado ANTES de validar
    let nuevoEstado: 'Pendiente' | 'En_proceso' | 'Completado';
    const todosLlenos = todosLosCamposLlenos();
    const hayDatos = tieneDatos();

    if (todosLlenos) {
      nuevoEstado = 'En_proceso';  // Al guardar siempre es En_proceso, Completado es cuando se envía email
      // Solo validar si están todos los campos llenos (finalizar)
      const eDiagnostico = validarTextoNumerosCaracteresEspeciales(diagnostico, 'El diagnóstico');
      const eOtroTrabajo = trabajoRealizadoTipo === 'Otros' 
        ? validarTextoNumerosCaracteresEspeciales(otroTrabajo, 'La especificación del trabajo')
        : null;
      const eDiagnosticoRealizado = validarTextoNumerosCaracteresEspeciales(diagnosticoRealizado, 'La descripción del trabajo realizado');
      
      const costoLimpio = (costoManoObra || '').replace(/,/g, '');
      const eCostoManoObra = !(costoManoObra || '').trim() 
        ? 'El costo de mano de obra es obligatorio.' 
        : !/^\d+(\.\d{1,2})?$/.test(costoLimpio) 
          ? 'El costo debe ser un número válido (ej: 1,250.50)' 
          : null;
      
      const eObservaciones = validarTextoNumerosCaracteresEspeciales(observaciones, 'Las observaciones');
      const eFechaInicio = !fechaInicio ? 'La fecha de inicio es obligatoria.' : null;
      
      // Validar que fecha de inicio no sea anterior a la fecha de cita
      let eFechaInicioVsCita = null;
      if (fechaInicio && solicitud?.fechaCita) {
        try {
          const [dia, mes, anio] = solicitud.fechaCita.split('/').map(Number);
          const fechaCitaDate = new Date(anio, mes - 1, dia);
          fechaCitaDate.setHours(0, 0, 0, 0);
          const fechaInicioDate = new Date(fechaInicio);
          fechaInicioDate.setHours(0, 0, 0, 0);
          
          if (fechaInicioDate < fechaCitaDate) {
            eFechaInicioVsCita = `La fecha de inicio no puede ser anterior a la fecha de cita (${solicitud.fechaCita}).`;
          }
        } catch (error) {
          console.error('Error al comparar fechas:', error);
        }
      }

      const eFechaFinalizacion = !fechaFinalizacion 
        ? 'La fecha de finalización es obligatoria.' 
        : (fechaInicio && fechaFinalizacion < fechaInicio)
          ? 'La fecha de finalización no puede ser anterior a la fecha de inicio.'
          : null;
      const eRepuestos = repuestosSeleccionados.length === 0 ? 'Debe agregar al menos un repuesto utilizado.' : null;

      // Establecer errores
      setErrDiagnostico(eDiagnostico ?? '');
      setErrOtroTrabajo(eOtroTrabajo ?? '');
      setErrDiagnosticoRealizado(eDiagnosticoRealizado ?? '');
      setErrCostoManoObra(eCostoManoObra ?? '');
      setErrObservaciones(eObservaciones ?? '');
      setErrFechaInicio((eFechaInicio || eFechaInicioVsCita) ?? '');
      setErrFechaFinalizacion(eFechaFinalizacion ?? '');
      setErrRepuestos(eRepuestos ?? '');

      // Si hay errores, no continuar
      if ([eDiagnostico, eOtroTrabajo, eDiagnosticoRealizado, 
        eCostoManoObra, eObservaciones, 
        eFechaInicio, eFechaInicioVsCita, eFechaFinalizacion, eRepuestos].some(Boolean)) {
        return;
      }
    } else if (hayDatos) {
      nuevoEstado = 'En_proceso';
      
      // Validar fecha de inicio vs fecha de cita también en guardado parcial
      if (fechaInicio && solicitud?.fechaCita) {
        try {
          const [dia, mes, anio] = solicitud.fechaCita.split('/').map(Number);
          const fechaCitaDate = new Date(anio, mes - 1, dia);
          fechaCitaDate.setHours(0, 0, 0, 0);
          const fechaInicioDate = new Date(fechaInicio);
          fechaInicioDate.setHours(0, 0, 0, 0);
          
          if (fechaInicioDate < fechaCitaDate) {
            setErrFechaInicio(`La fecha de inicio no puede ser anterior a la fecha de cita (${solicitud.fechaCita}).`);
            return; // No permitir guardar
          }
        } catch (error) {
          console.error('Error al comparar fechas:', error);
        }
      }
    } else {
      nuevoEstado = 'Pendiente';
    }

    // Calcular costos
    const costoManoObraLimpio = parseFloat((costoManoObra || '').replace(/,/g, '')) || 0;
    const costoRepuestos = calcularSubtotalRepuestos();
    const costoTotal = costoManoObraLimpio + costoRepuestos;

    try {
      setIsLoading(true);
      
      // Guardar mantenimiento en BD
      if (token) {
        // Sanitizar repuestos para stringify
        let repuestosStringificados = '[]';
        if (repuestosSeleccionados && repuestosSeleccionados.length > 0) {
          try {
            const repuestosLimpios = repuestosSeleccionados.map(r => ({
              id: r.id?.toString() || '',
              nombre: r.nombre?.toString() || '',
              nombreProducto: r.nombreProducto?.toString() || (r.nombre?.toString() || ''),
              codigoSKU: r.codigoSKU?.toString() || '',
              marcaComponente: r.marcaComponente?.toString() || '',
              categoria: r.categoria?.toString() || '',
              precio: typeof r.precio === 'number' ? r.precio : parseFloat(r.precio) || 0,
              cantidad: typeof r.cantidad === 'number' ? r.cantidad : parseInt(r.cantidad) || 0,
              subtotal: typeof r.subtotal === 'number' ? r.subtotal : parseFloat(r.subtotal) || 0,
            }));
            repuestosStringificados = JSON.stringify(repuestosLimpios);
          } catch (e) {
            console.error('[registroMantenimiento] ❌ Error stringificando repuestos:', e);
            repuestosStringificados = '[]';
          }
        }

        const mantenimientoData = {
          solicitudId: solicitud.id,
          marca: solicitud.marca,
          modelo: solicitud.modelo,
          placa: solicitud.placa,
          mecanicoAsignado: nombreMecanico,
          diagnostico: (diagnostico || '').trim(),
          trabajoRealizado: trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : trabajoRealizadoTipo,
          otroTrabajo: trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : '',
          repuestosUtilizados: repuestosStringificados,
          diagnosticoRealizado: (diagnosticoRealizado || '').trim(),
          observaciones: (observaciones || '').trim(),
          costoManoObra: costoManoObraLimpio,
          costoRepuestos: costoRepuestos,
          fechaServicio: formatDateDDMMYYYY(new Date()),
          fechaInicio: formatDateDDMMYYYY(fechaInicio),
          fechaFinalizacion: formatDateDDMMYYYY(fechaFinalizacion),
          fotoVehiculo: fotoVehiculo || null,
        };

        console.log('[registroMantenimiento] 📤 Enviando mantenimiento con foto:', !!fotoVehiculo);
        console.log('[registroMantenimiento] 📤 Tamaño foto:', fotoVehiculo?.length || 0);
        
        const respuesta = await mantenimientosApi.crear(mantenimientoData, token);
        console.log('✅ Mantenimiento guardado en BD:', respuesta.id);
        console.log('✅ ¿Foto guardada en BD?:', !!respuesta.fotoVehiculo);

        // Actualizar solicitud con estado Completado
        const datosActualizarSolicitud = {
          nombreCliente: solicitud.nombreCliente,
          telefono: solicitud.telefono,
          correoCliente: solicitud.correoCliente,
          marca: solicitud.marca,
          modelo: solicitud.modelo,
          anio: solicitud.anio,
          placa: solicitud.placa,
          kilometraje: solicitud.kilometraje,
          tipoServicio: solicitud.tipoServicio,
          otroServicio: solicitud.otroServicio,
          descripcionProblema: solicitud.descripcionProblema,
          fechaCita: solicitud.fechaCita,
          horaCita: solicitud.horaCita,
          estado: nuevoEstado,
        };

        await solicitudesApi.actualizar(solicitud.id, datosActualizarSolicitud, token);
        
        // Crear objeto mantenimiento completo para garantizar que tiene ID
        // Reutilizar repuestosStringificados calculado arriba
        const mantenimientoCompleto = {
          id: respuesta.id,
          solicitudId: solicitud.id,
          diagnostico: respuesta.diagnostico || (diagnostico || '').trim(),
          trabajoRealizado: respuesta.trabajoRealizado || (trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : trabajoRealizadoTipo),
          otroTrabajo: respuesta.otroTrabajo || (trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : ''),
          repuestosUtilizados: respuesta.repuestosUtilizados || repuestosStringificados,
          diagnosticoRealizado: respuesta.diagnosticoRealizado || (diagnosticoRealizado || '').trim(),
          observaciones: respuesta.observaciones || (observaciones || '').trim(),
          costoManoObra: respuesta.costoManoObra || costoManoObraLimpio,
          costoRepuestos: respuesta.costoRepuestos || costoRepuestos,
          fechaServicio: respuesta.fechaServicio || formatDateDDMMYYYY(new Date()),
          fechaInicio: respuesta.fechaInicio || formatDateDDMMYYYY(fechaInicio),
          fechaFinalizacion: respuesta.fechaFinalizacion || formatDateDDMMYYYY(fechaFinalizacion),
          createdAt: respuesta.createdAt || new Date().toISOString(),
          updatedAt: respuesta.updatedAt || new Date().toISOString(),
        };
        
        console.log('[registroMantenimiento] ✅ Mantenimiento completo:', mantenimientoCompleto);
        
        // Crear objeto con el mantenimiento para pasarlo a onSuccess
        const solicitudActualizadaConMantenimiento = { 
          ...solicitud, 
          estado: nuevoEstado,
          mantenimiento: mantenimientoCompleto,  // Usar objeto mantenimiento bien formado
        };
        
        console.log('[registroMantenimiento] ✅ Solicitud actualizada a pasar:', solicitudActualizadaConMantenimiento);
        onSuccess(solicitudActualizadaConMantenimiento, repuestosSeleccionados);
      }
      
      onClose();
    } catch (error: any) {
      console.error('[registroMantenimiento] Error al guardar:', error);
      Alert.alert('Error', `No se pudo guardar el mantenimiento: ${error?.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!solicitud) return null;

  // Determinar el texto del botón
  const getTextoBoton = () => {
    if (todosLosCamposLlenos()) {
      return 'GUARDAR REPORTE';
    }
    if (tieneDatos()) {
      return 'GUARDAR REPORTE';
    }
    return 'GUARDAR REPORTE';
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextBlock}>
              <Text style={styles.modalTitle}>Registro de Mantenimiento</Text>
              <Text style={styles.modalSubtitle}>
                Registra el mantenimiento realizado para {solicitud.nombreCliente}
              </Text>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>Nuevo</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                onClose();
              }}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
              hitSlop={8}
            >
              <FontAwesome name="times" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* SECCIÓN: INFORMACIÓN DEL CLIENTE Y VEHÍCULO (Solo lectura) */}
            <Text style={styles.sectionTitle}>Información del Cliente y Vehículo</Text>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Nombre Completo:</Text>
              <Text style={styles.infoValue}>{solicitud.nombreCliente}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{solicitud.telefono || 'No especificado'}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Correo Electrónico:</Text>
              <Text style={styles.infoValue}>{solicitud.correoCliente}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Marca del Vehículo:</Text>
              <Text style={styles.infoValue}>{solicitud.marca}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Modelo:</Text>
              <Text style={styles.infoValue}>{solicitud.modelo}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Placa:</Text>
              <Text style={styles.infoValue}>{solicitud.placa}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Año:</Text>
              <Text style={styles.infoValue}>{solicitud.anio}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Kilometraje:</Text>
              <Text style={styles.infoValue}>{solicitud.kilometraje} km</Text>
            </View>

            {/* FOTO DEL VEHÍCULO AL RECIBIRLO */}
            <View style={{
              backgroundColor: '#0F172A',
              padding: 16,
              borderRadius: 8,
              marginTop: 16,
              borderWidth: 1,
              borderColor: '#334155'
            }}>
              <Text style={styles.label}>Foto del Estado del Vehículo</Text>
              <Text style={{color: '#94A3B8', fontSize: 13, marginBottom: 12, lineHeight: 18}}>Captura una foto del vehículo cuando lo recibas</Text>
              
              {fotoVehiculo ? (
                <View>
                  <Image
                    source={{ uri: fotoVehiculo }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 8,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: '#334155'
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: '#DC2626',
                      padding: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                    onPress={() => setFotoVehiculo(null)}
                  >
                    <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: 14}}>Eliminar Foto</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: '#10B981',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={capturarFotoVehiculo}
                >
                  <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: 14}}>Seleccionar Foto</Text>
                </Pressable>
              )}
            </View>

            {/* DATOS DEL MANTENIMIENTO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Datos del Mantenimiento</Text>

            {/* ⭐ Tipo de trabajo realizado - PRIMERO (para filtrar productos) */}
            <Text style={styles.label}>🔧 Tipo de Trabajo Realizado *</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setTrabajoDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>{trabajoRealizadoTipo}</Text>
              <Text style={styles.dropdownArrow}>{trabajoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {trabajoDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {TIPOS_TRABAJO.map((tipo) => (
                  <Pressable
                    key={tipo}
                    style={[
                      styles.dropdownItem,
                      trabajoRealizadoTipo === tipo && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setTrabajoRealizadoTipo(tipo);
                      setTrabajoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {trabajoRealizadoTipo === tipo ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{tipo}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Otro trabajo (si seleccionó "Otros") */}
            {trabajoRealizadoTipo === 'Otros' && (
              <>
                <Text style={styles.label}>Especifica el Trabajo</Text>
                <TextInput
                  placeholder="Describe brevemente el tipo de trabajo realizado"
                  placeholderTextColor="#64748B"
                  value={otroTrabajo}
                  onChangeText={(val) => {
                    setOtroTrabajo(val);
                    setErrOtroTrabajo('');
                  }}
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textarea, errOtroTrabajo && styles.inputError]}
                />
                {errOtroTrabajo ? <Text style={styles.errorText}>{errOtroTrabajo}</Text> : null}
              </>
            )}

            {/* Diagnóstico inicial */}
            <Text style={styles.label}>Diagnóstico Inicial</Text>
            <TextInput
              placeholder="Describe el diagnóstico inicial del problema"
              placeholderTextColor="#64748B"
              value={diagnostico}
              onChangeText={(val) => {
                setDiagnostico(val);
                setErrDiagnostico('');
              }}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, errDiagnostico && styles.inputError]}
            />
            {errDiagnostico ? <Text style={styles.errorText}>{errDiagnostico}</Text> : null}

            {/* ============= SISTEMA DE BÚSQUEDA Y SELECCIÓN DE REPUESTOS ============= */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Agregar Repuestos del Vehículo</Text>
            <Text style={styles.sectionSubtitle}>
              Productos filtrados para: <Text style={{ fontWeight: 'bold' }}>{trabajoRealizadoTipo}</Text>
            </Text>

            {/* FILTROS DE REPUESTOS SIMPLIFICADOS */}
            {/* Marca del Repuesto */}
            <Text style={styles.label}>Marca del Repuesto</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setMarcaDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>
                {marcaFiltro || 'Seleccionar marca'}
              </Text>
              <Text style={styles.dropdownArrow}>{marcaDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {marcaDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Pressable
                  style={[styles.dropdownItem, !marcaFiltro && styles.dropdownItemActive]}
                  onPress={() => {
                    setMarcaFiltro('');
                    setMarcaDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!marcaFiltro ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>Limpiar selección</Text>
                </Pressable>
                {obtenerMarcasProducto().map((marca) => (
                  <Pressable
                    key={marca}
                    style={[styles.dropdownItem, marcaFiltro === marca && styles.dropdownItemActive]}
                    onPress={() => {
                      setMarcaFiltro(marca);
                      setMarcaDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {marcaFiltro === marca ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{marca}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Seleccionar Producto */}
            <Text style={styles.label}>Seleccionar Producto</Text>
            <Pressable
              style={[styles.dropdown, !marcaFiltro && styles.dropdownDisabled]}
              onPress={() => {
                if (marcaFiltro) {
                  setProductoDropdownOpen((v) => !v);
                }
              }}
              disabled={!marcaFiltro}
            >
              <Text style={[styles.dropdownText, !marcaFiltro && styles.dropdownTextDisabled]}>
                {!marcaFiltro 
                  ? '← Selecciona marca del repuesto primero' 
                  : productosFiltrados.length > 0 
                    ? 'Selecciona un producto de la lista' 
                    : 'No hay productos disponibles'}
              </Text>
              <Text style={styles.dropdownArrow}>{productoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {productoDropdownOpen && marcaFiltro && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {productosFiltrados.length === 0 ? (
                  <View style={{ padding: 12 }}>
                    <Text style={styles.dropdownItemText}>No hay productos disponibles</Text>
                  </View>
                ) : (
                  productosFiltrados.map((producto) => (
                    <Pressable
                      key={producto.id}
                      style={[
                        styles.dropdownItem,
                        repuestosSeleccionados.some(r => r.id === producto.id) && styles.dropdownItemActive,
                        producto.stockActual === 0 && styles.dropdownItemDisabled,
                      ]}
                      onPress={() => {
                        if (producto.stockActual > 0 && !repuestosSeleccionados.some(r => r.id === producto.id)) {
                          agregarRepuesto(producto);
                          setProductoDropdownOpen(false);
                        }
                      }}
                      disabled={producto.stockActual === 0 || repuestosSeleccionados.some(r => r.id === producto.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.dropdownItemText, { fontWeight: '600' }]}>
                          {producto.nombreProducto}
                        </Text>
                        <Text style={[styles.dropdownItemText, { fontSize: 12, color: '#64748B' }]}>
                          SKU: {producto.codigoSKU} • Stock: {producto.stockActual}
                        </Text>
                        <Text style={[styles.dropdownItemText, { fontSize: 12, color: '#059669', fontWeight: '500' }]}>
                          ${Number(producto.precioVenta).toFixed(2)}
                        </Text>
                      </View>
                      <Text style={styles.dropdownItemCheck}>
                        {repuestosSeleccionados.some(r => r.id === producto.id) 
                          ? '✓' 
                          : producto.stockActual === 0 
                            ? '✕' 
                            : ''}
                      </Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}

            {/* Botones de control */}
            <View style={styles.searchButtonsRow}>
              <Pressable
                onPress={() => setProductoDropdownOpen((v) => !v)}
                disabled={!marcaFiltro}
                style={({ pressed }) => [
                  styles.searchButton,
                  !marcaFiltro && styles.searchButtonDisabled,
                  pressed && styles.searchButtonPressed
                ]}
              >
                {({ pressed }) => (
                  <Text style={[styles.searchButtonText, pressed && styles.searchButtonTextPressed]}>
                    {productoDropdownOpen ? 'CERRAR' : 'VER OPCIONES'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={limpiarFiltros}
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.clearButtonPressed
                ]}
              >
                {({ pressed }) => (
                  <Text style={[styles.clearButtonText, pressed && styles.clearButtonTextPressed]}>
                    LIMPIAR TODO
                  </Text>
                )}
              </Pressable>
            </View>

            {/* TABLA DE REPUESTOS SELECCIONADOS */}
            {repuestosSeleccionados.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginTop: 24 }]}>Repuestos Seleccionados</Text>
                {errRepuestos ? <Text style={styles.errorText}>{errRepuestos}</Text> : null}
                
                <View style={styles.repuestosTable}>
                  {/* Filas de repuestos */}
                  {repuestosSeleccionados.map((repuesto) => {
                    const producto = productosDisponibles.find(p => p.id === repuesto.id);
                    return (
                      <View key={repuesto.id} style={styles.repuestoItem}>
                        {/* Fila 1: Nombre y botón eliminar */}
                        <View style={styles.repuestoHeader}>
                          <View style={styles.repuestoInfo}>
                            <Text style={styles.repuestoNombre} numberOfLines={1}>
                              {repuesto.nombre}
                            </Text>
                            <Text style={styles.repuestoMarca}>
                              {repuesto.marcaComponente} • SKU: {repuesto.codigoSKU}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => eliminarRepuesto(repuesto.id)}
                            style={styles.deleteButton}
                          >
                            <FontAwesome name="trash" size={16} color="#EF4444" />
                          </Pressable>
                        </View>

                        {/* Fila 2: Precio y Subtotal */}
                        <View style={styles.repuestoPriceRow}>
                          <View style={styles.precioContainer}>
                            <Text style={styles.repuestoLabel}>Precio Unit.</Text>
                            <Text style={styles.repuestoPrecio}>${repuesto.precio.toFixed(2)}</Text>
                          </View>

                          <View style={styles.subtotalContainer}>
                            <Text style={styles.repuestoLabel}>Subtotal</Text>
                            <Text style={styles.repuestoSubtotal}>${repuesto.subtotal.toFixed(2)}</Text>
                          </View>
                        </View>

                        {/* Fila 3: Control de cantidad (separada con más espacio) */}
                        <View style={styles.cantidadRow}>
                          <Text style={styles.cantidadLabel}>Cantidad:</Text>
                          <View style={styles.quantitySelector}>
                            <Pressable
                              onPress={() => actualizarCantidadRepuesto(repuesto.id, repuesto.cantidad - 1)}
                              style={({ pressed }) => [
                                styles.quantityButton,
                                pressed && styles.quantityButtonPressed,
                                repuesto.cantidad <= 1 && { opacity: 0.3 }
                              ]}
                              disabled={repuesto.cantidad <= 1}
                            >
                              <Text style={styles.quantityButtonText}>−</Text>
                            </Pressable>
                            <Text style={styles.quantityText}>{repuesto.cantidad}</Text>
                            <Pressable
                              onPress={() => actualizarCantidadRepuesto(repuesto.id, repuesto.cantidad + 1)}
                              style={({ pressed }) => [
                                styles.quantityButton,
                                pressed && styles.quantityButtonPressed,
                                (!producto || repuesto.cantidad >= producto.stockActual) && { opacity: 0.3 }
                              ]}
                              disabled={!producto || repuesto.cantidad >= producto.stockActual}
                            >
                              <Text style={styles.quantityButtonText}>+</Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {/* Subtotal de repuestos */}
                  <View style={styles.repuestosTableFooter}>
                    <Text style={styles.repuestosTableFooterLabel}>Subtotal Repuestos:</Text>
                    <Text style={styles.repuestosTableFooterValue}>
                      ${calcularSubtotalRepuestos().toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Diagnóstico realizado (descripción paso a paso) */}
            <Text style={[styles.label, { marginTop: 24 }]}>Diagnóstico Realizado</Text>
            <TextInput
              placeholder="Describe paso a paso el diagnóstico y trabajo realizado"
              placeholderTextColor="#64748B"
              value={diagnosticoRealizado}
              onChangeText={(val) => {
                setDiagnosticoRealizado(val);
                setErrDiagnosticoRealizado('');
              }}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textarea, errDiagnosticoRealizado && styles.inputError]}
            />
            {errDiagnosticoRealizado ? <Text style={styles.errorText}>{errDiagnosticoRealizado}</Text> : null}

            {/* Costo mano de obra */}
            <Text style={styles.label}>Costo Mano de Obra</Text>
            <TextInput
              placeholder="Ingrese el monto (ej: 1,250.50)"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={costoManoObra}
              onChangeText={(val) => {
                const { display } = manejarCambioPrecioEstadounidense(val);
                setCostoManoObra(display);
                setErrCostoManoObra('');
              }}
              style={[styles.input, errCostoManoObra && styles.inputError]}
            />
            {errCostoManoObra ? <Text style={styles.errorText}>{errCostoManoObra}</Text> : null}

            {/* Costo total (calculado automáticamente) */}
            {(costoManoObra || repuestosSeleccionados.length > 0) && (
              <>
                <Text style={styles.label}>Costo Total</Text>
                <Text style={styles.costoTotal}>
                  ${calcularCostoTotal().toFixed(2)}
                </Text>
              </>
            )}

            {/* Observaciones */}
            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              placeholder="Recomendaciones post-servicio para el cliente"
              placeholderTextColor="#64748B"
              value={observaciones}
              onChangeText={(val) => {
                setObservaciones(val);
                setErrObservaciones('');
              }}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textarea, errObservaciones && styles.inputError]}
            />
            {errObservaciones ? <Text style={styles.errorText}>{errObservaciones}</Text> : null}

            {/* Fecha inicio */}
            <Text style={styles.label}>Fecha de Inicio de Mantenimiento</Text>
            <Pressable
              style={[styles.dateButton, errFechaInicio && styles.inputError]}
              onPress={() => {
                setCalendarMonth(fechaInicio || new Date());
                setCalendarInicioVisible(true);
                setErrFechaInicio('');
              }}
            >
              <Text style={styles.dateButtonText}>{formatDate(fechaInicio)}</Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>
            {errFechaInicio ? <Text style={styles.errorText}>{errFechaInicio}</Text> : null}

            {/* Fecha finalización */}
            <Text style={styles.label}>Fecha de Finalización de Mantenimiento</Text>
            <Pressable
              style={[styles.dateButton, errFechaFinalizacion && styles.inputError]}
              onPress={() => {
                setCalendarMonth(fechaFinalizacion || new Date());
                setCalendarFinalizacionVisible(true);
                setErrFechaFinalizacion('');
              }}
            >
              <Text style={styles.dateButtonText}>{formatDate(fechaFinalizacion)}</Text>
              <FontAwesome name="calendar" size={14} color="#64748B" />
            </Pressable>
            {errFechaFinalizacion ? <Text style={styles.errorText}>{errFechaFinalizacion}</Text> : null}

            {/* Botón Guardar/Enviar Reporte */}
            <Pressable
              onPress={guardar}
              disabled={isLoading}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed, isLoading && { opacity: 0.6 }]}
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FontAwesome name={isLoading ? 'spinner' : 'check-circle'} size={16} color={pressed ? '#FFFFFF' : '#000000'} spin={isLoading} />
                  <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                    {isLoading ? 'GUARDANDO...' : getTextoBoton()}
                  </Text>
                </View>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL CALENDARIO FECHA INICIO */}
      <Modal visible={calendarInicioVisible} transparent animationType="fade" onRequestClose={() => setCalendarInicioVisible(false)}>
        <Pressable style={styles.calendarOverlay} onPress={() => setCalendarInicioVisible(false)}>
          <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} style={styles.calendarNavBtn}>
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} style={styles.calendarNavBtn}>
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
                const isSelected = fechaInicio?.toDateString() === day.toDateString();
                const isDisabled = isDateDisabled(day);
                return (
                  <Pressable 
                    key={i} 
                    style={[
                      styles.calendarCell, 
                      isSelected && styles.calendarCellSelected,
                      isDisabled && styles.calendarCellDisabled
                    ]} 
                    onPress={() => { 
                      if (!isDisabled) {
                        setFechaInicio(day); 
                        setCalendarInicioVisible(false); 
                      }
                    }}
                    disabled={isDisabled}
                  >
                    <Text style={[
                      styles.calendarCellText, 
                      isSelected && styles.calendarCellSelectedText,
                      isDisabled && styles.calendarCellDisabledText
                    ]}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarInicioVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaInicio(null); setCalendarInicioVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL CALENDARIO FECHA FINALIZACIÓN */}
      <Modal visible={calendarFinalizacionVisible} transparent animationType="fade" onRequestClose={() => setCalendarFinalizacionVisible(false)}>
        <Pressable style={styles.calendarOverlay} onPress={() => setCalendarFinalizacionVisible(false)}>
          <Pressable style={styles.calendarModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))} style={styles.calendarNavBtn}>
                <Text style={styles.calendarNavText}>‹</Text>
              </Pressable>
              <Text style={styles.calendarMonthLabel}>
                {calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <Pressable onPress={() => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))} style={styles.calendarNavBtn}>
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
                const isSelected = fechaFinalizacion?.toDateString() === day.toDateString();
                const isDisabled = isDateFinalizacionDisabled(day);
                return (
                  <Pressable 
                    key={i} 
                    style={[
                      styles.calendarCell, 
                      isSelected && styles.calendarCellSelected,
                      isDisabled && styles.calendarCellDisabled
                    ]} 
                    onPress={() => { 
                      if (!isDisabled) {
                        setFechaFinalizacion(day); 
                        setCalendarFinalizacionVisible(false); 
                      }
                    }}
                    disabled={isDisabled}
                  >
                    <Text style={[
                      styles.calendarCellText, 
                      isSelected && styles.calendarCellSelectedText,
                      isDisabled && styles.calendarCellDisabledText
                    ]}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setCalendarFinalizacionVisible(false)} style={({ pressed }) => [styles.calendarCloseBtn, pressed && styles.calendarCloseBtnPressed]}>
              {({ pressed }) => (<Text style={[styles.calendarCloseBtnText, pressed && styles.calendarCloseBtnTextPressed]}>ACEPTAR</Text>)}
            </Pressable>
            <Pressable onPress={() => { setFechaFinalizacion(null); setCalendarFinalizacionVisible(false); }} style={styles.calendarCancelBtn}>
              <Text style={styles.calendarCancelBtnText}>LIMPIAR FECHA</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
