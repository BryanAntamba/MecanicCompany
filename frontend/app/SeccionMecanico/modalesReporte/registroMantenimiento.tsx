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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '../../../Styles/pantallaMecanico/modalesReporte/registroMantenimiento';
import { actualizarSolicitud, obtenerProductos, type Producto } from '@/utils/datosSimulados';
import {
  validarTextoNumerosCaracteresEspeciales,
} from '@/utils/validaciones';
import { manejarCambioPrecioEstadounidense } from '@/utils/formatNumbers';

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
  // Estados para todos los campos del mantenimiento
  const [diagnostico, setDiagnostico] = useState('');
  const [trabajoRealizadoTipo, setTrabajoRealizadoTipo] = useState('Cambio de aceite');
  const [otroTrabajo, setOtroTrabajo] = useState('');
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState('');
  const [costoManoObra, setCostoManoObra] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFinalizacion, setFechaFinalizacion] = useState<Date | null>(null);
  
  const [trabajoDropdownOpen, setTrabajoDropdownOpen] = useState(false);

  // Estados de modales de calendario
  const [calendarInicioVisible, setCalendarInicioVisible] = useState(false);
  const [calendarFinalizacionVisible, setCalendarFinalizacionVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // ========== SISTEMA DE BÚSQUEDA DE REPUESTOS ==========
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [marcaVehiculoFiltro, setMarcaVehiculoFiltro] = useState('');
  const [modeloVehiculoFiltro, setModeloVehiculoFiltro] = useState('');
  
  // Estados para "Otro"
  const [otraMarcaComponente, setOtraMarcaComponente] = useState('');
  const [otraCategoria, setOtraCategoria] = useState('');
  
  const [marcaDropdownOpen, setMarcaDropdownOpen] = useState(false);
  const [categoriaDropdownOpen, setCategoriaDropdownOpen] = useState(false);
  const [marcaVehiculoDropdownOpen, setMarcaVehiculoDropdownOpen] = useState(false);
  const [modeloVehiculoDropdownOpen, setModeloVehiculoDropdownOpen] = useState(false);
  
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

  // Cargar productos disponibles
  useEffect(() => {
    if (visible) {
      const productos = obtenerProductos().filter(p => p.activo);
      setProductosDisponibles(productos);
      setProductosFiltrados([]);
    }
  }, [visible]);

  // Obtener opciones únicas para los filtros usando constantes compartidas
  const obtenerMarcasComponente = (): string[] => {
    return MARCAS_COMPONENTES;
  };

  const obtenerCategorias = (): string[] => {
    const categorias = new Set(productosDisponibles.map(p => p.categoria));
    return Array.from(categorias).sort();
  };

  const obtenerMarcasVehiculo = (): string[] => {
    return MARCAS_VEHICULOS;
  };

  const obtenerModelosVehiculo = (): string[] => {
    if (!marcaVehiculoFiltro || marcaVehiculoFiltro === 'Otro') return TODOS_LOS_MODELOS;
    return MODELOS_POR_MARCA[marcaVehiculoFiltro] || [];
  };

  // Función de búsqueda
  const buscarProductos = () => {
    let resultados = [...productosDisponibles];

    // Filtro por texto de búsqueda
    if ((busquedaTexto || '').trim()) {
      const textoBusqueda = busquedaTexto.toLowerCase();
      resultados = resultados.filter(p => 
        p.nombre.toLowerCase().includes(textoBusqueda) ||
        p.codigoSKU.toLowerCase().includes(textoBusqueda) ||
        p.marcaComponente.toLowerCase().includes(textoBusqueda) ||
        p.categoria.toLowerCase().includes(textoBusqueda) ||
        (p.numeroParteOEM && p.numeroParteOEM.toLowerCase().includes(textoBusqueda)) ||
        p.compatibilidades.some(c => 
          c.marca.toLowerCase().includes(textoBusqueda) ||
          c.modelo.toLowerCase().includes(textoBusqueda)
        )
      );
    }

    // Filtro por marca del componente
    if (marcaFiltro) {
      if (marcaFiltro === 'Otro' && (otraMarcaComponente || '').trim()) {
        const marcaBusqueda = otraMarcaComponente.toLowerCase();
        resultados = resultados.filter(p => 
          p.marcaComponente.toLowerCase().includes(marcaBusqueda)
        );
      } else if (marcaFiltro !== 'Otro') {
        resultados = resultados.filter(p => p.marcaComponente === marcaFiltro);
      }
    }

    // Filtro por categoría
    if (categoriaFiltro) {
      if (categoriaFiltro === 'Otro' && (otraCategoria || '').trim()) {
        const categoriaBusqueda = otraCategoria.toLowerCase();
        resultados = resultados.filter(p => 
          p.categoria.toLowerCase().includes(categoriaBusqueda)
        );
      } else if (categoriaFiltro !== 'Otro') {
        resultados = resultados.filter(p => p.categoria === categoriaFiltro);
      }
    }

    // Filtro por marca del vehículo
    if (marcaVehiculoFiltro) {
      resultados = resultados.filter(p => 
        p.compatibilidades.some(c => c.marca === marcaVehiculoFiltro)
      );
    }

    // Filtro por modelo del vehículo
    if (modeloVehiculoFiltro) {
      resultados = resultados.filter(p => 
        p.compatibilidades.some(c => c.modelo === modeloVehiculoFiltro)
      );
    }

    setProductosFiltrados(resultados);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBusquedaTexto('');
    setMarcaFiltro('');
    setCategoriaFiltro('');
    setMarcaVehiculoFiltro('');
    setModeloVehiculoFiltro('');
    setOtraMarcaComponente('');
    setOtraCategoria('');
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
      nombre: producto.nombre,
      codigoSKU: producto.codigoSKU,
      marcaComponente: producto.marcaComponente,
      categoria: producto.categoria,
      precio: producto.precioVenta,
      cantidad: 1,
      subtotal: producto.precioVenta,
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
      setRepuestosSeleccionados([]);
      setBusquedaTexto('');
      setMarcaFiltro('');
      setCategoriaFiltro('');
      setMarcaVehiculoFiltro('');
      setModeloVehiculoFiltro('');
      setProductosFiltrados([]);
      
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

  const guardar = () => {
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
      nuevoEstado = 'Completado';
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
    const fechaGeneracionReporte = solicitud.fechaGeneracionReporte || (
      nuevoEstado === 'Completado' ? formatDateDDMMYYYY(new Date()) : ''
    );

    // Actualizar solicitud
    const datosActualizados = {
      diagnostico: (diagnostico || '').trim(),
      trabajoRealizado: trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : trabajoRealizadoTipo,
      otroTrabajo: trabajoRealizadoTipo === 'Otros' ? (otroTrabajo || '').trim() : '',
      diagnosticoRealizado: (diagnosticoRealizado || '').trim(),
      costoManoObra: costoManoObraLimpio.toFixed(2),
      costoRepuestos: costoRepuestos.toFixed(2),
      observaciones: (observaciones || '').trim(),
      fechaInicio: formatDateDDMMYYYY(fechaInicio),
      fechaFinalizacion: formatDateDDMMYYYY(fechaFinalizacion),
      fechaGeneracionReporte,
      costoTotal: costoTotal.toFixed(2),
      estado: nuevoEstado,
      repuestosSeleccionados: repuestosSeleccionados,
    };

    actualizarSolicitud(solicitud.id, datosActualizados);
    
    const solicitudActualizada = { ...solicitud, ...datosActualizados };
    onSuccess(solicitudActualizada, repuestosSeleccionados);
    
    onClose();
    onShowSuccessModal();
  };

  if (!solicitud) return null;

  // Determinar el texto del botón
  const getTextoBoton = () => {
    if (todosLosCamposLlenos()) {
      return 'ENVIAR REPORTE';
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

            {/* DATOS DEL MANTENIMIENTO */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Datos del Mantenimiento</Text>

            {/* Diagnóstico inicial */}
            <Text style={styles.label}>Diagnóstico</Text>
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

            {/* Tipo de trabajo realizado */}
            <Text style={styles.label}>Trabajo Realizado</Text>
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

            {/* ============= SISTEMA DE BÚSQUEDA Y SELECCIÓN DE REPUESTOS ============= */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Agregar Repuestos del Vehículo</Text>
            <Text style={styles.sectionSubtitle}>Filtros de Búsqueda</Text>

            {/* Campo de búsqueda global */}
            <Text style={styles.label}>Buscar Producto</Text>
            <TextInput
              placeholder="Busca el producto deseado"
              placeholderTextColor="#64748B"
              value={busquedaTexto}
              onChangeText={setBusquedaTexto}
              style={styles.input}
            />

            {/* Marca del componente/repuesto */}
            <Text style={styles.label}>Marca del Componente/Repuesto</Text>
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
                    setOtraMarcaComponente('');
                    setMarcaDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!marcaFiltro ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>Todas las marcas</Text>
                </Pressable>
                {obtenerMarcasComponente().map((marca) => (
                  <Pressable
                    key={marca}
                    style={[styles.dropdownItem, marcaFiltro === marca && styles.dropdownItemActive]}
                    onPress={() => {
                      setMarcaFiltro(marca);
                      setOtraMarcaComponente('');
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
            
            {/* Campo de texto para "Otra marca" */}
            {marcaFiltro === 'Otro' && (
              <>
                <Text style={styles.label}>Especificar Marca</Text>
                <TextInput
                  placeholder="Ingrese la marca del componente..."
                  placeholderTextColor="#64748B"
                  value={otraMarcaComponente}
                  onChangeText={(val) => {
                    // Solo permitir letras y espacios
                    const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setOtraMarcaComponente(soloLetras);
                  }}
                  style={styles.input}
                />
              </>
            )}

            {/* Categoría */}
            <Text style={styles.label}>Categoría</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setCategoriaDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>
                {categoriaFiltro || 'Seleccionar categoría'}
              </Text>
              <Text style={styles.dropdownArrow}>{categoriaDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {categoriaDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Pressable
                  style={[styles.dropdownItem, !categoriaFiltro && styles.dropdownItemActive]}
                  onPress={() => {
                    setCategoriaFiltro('');
                    setOtraCategoria('');
                    setCategoriaDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!categoriaFiltro ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>Todas las categorías</Text>
                </Pressable>
                {obtenerCategorias().map((categoria) => (
                  <Pressable
                    key={categoria}
                    style={[styles.dropdownItem, categoriaFiltro === categoria && styles.dropdownItemActive]}
                    onPress={() => {
                      setCategoriaFiltro(categoria);
                      setOtraCategoria('');
                      setCategoriaDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {categoriaFiltro === categoria ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{categoria}</Text>
                  </Pressable>
                ))}
                <Pressable
                  style={[styles.dropdownItem, categoriaFiltro === 'Otro' && styles.dropdownItemActive]}
                  onPress={() => {
                    setCategoriaFiltro('Otro');
                    setCategoriaDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>
                    {categoriaFiltro === 'Otro' ? '✓ ' : '    '}
                  </Text>
                  <Text style={styles.dropdownItemText}>Otro</Text>
                </Pressable>
              </ScrollView>
            )}
            
            {/* Campo de texto para "Otra categoría" */}
            {categoriaFiltro === 'Otro' && (
              <>
                <Text style={styles.label}>Especificar Categoría</Text>
                <TextInput
                  placeholder="Ingrese la categoría del producto..."
                  placeholderTextColor="#64748B"
                  value={otraCategoria}
                  onChangeText={(val) => {
                    // Solo permitir letras y espacios
                    const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setOtraCategoria(soloLetras);
                  }}
                  style={styles.input}
                />
              </>
            )}

            {/* Marca del vehículo */}
            <Text style={styles.label}>Marca del Vehículo</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setMarcaVehiculoDropdownOpen((v) => !v)}
            >
              <Text style={styles.dropdownText}>
                {marcaVehiculoFiltro || 'Seleccionar marca'}
              </Text>
              <Text style={styles.dropdownArrow}>{marcaVehiculoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {marcaVehiculoDropdownOpen && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Pressable
                  style={[styles.dropdownItem, !marcaVehiculoFiltro && styles.dropdownItemActive]}
                  onPress={() => {
                    setMarcaVehiculoFiltro('');
                    setModeloVehiculoFiltro('');
                    setMarcaVehiculoDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!marcaVehiculoFiltro ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>Todas las marcas</Text>
                </Pressable>
                {obtenerMarcasVehiculo().map((marca) => (
                  <Pressable
                    key={marca}
                    style={[styles.dropdownItem, marcaVehiculoFiltro === marca && styles.dropdownItemActive]}
                    onPress={() => {
                      setMarcaVehiculoFiltro(marca);
                      setModeloVehiculoFiltro('');
                      setMarcaVehiculoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {marcaVehiculoFiltro === marca ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{marca}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Modelo del vehículo */}
            <Text style={styles.label}>Modelo del Vehículo</Text>
            <Pressable
              style={[styles.dropdown, !marcaVehiculoFiltro && styles.dropdownDisabled]}
              onPress={() => {
                if (marcaVehiculoFiltro) {
                  setModeloVehiculoDropdownOpen((v) => !v);
                }
              }}
              disabled={!marcaVehiculoFiltro}
            >
              <Text style={[styles.dropdownText, !marcaVehiculoFiltro && styles.dropdownTextDisabled]}>
                {modeloVehiculoFiltro || (marcaVehiculoFiltro ? 'Seleccionar modelo' : 'Seleccione primero una marca')}
              </Text>
              <Text style={styles.dropdownArrow}>{modeloVehiculoDropdownOpen ? '▲' : '▼'}</Text>
            </Pressable>
            {modeloVehiculoDropdownOpen && marcaVehiculoFiltro && (
              <ScrollView 
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Pressable
                  style={[styles.dropdownItem, !modeloVehiculoFiltro && styles.dropdownItemActive]}
                  onPress={() => {
                    setModeloVehiculoFiltro('');
                    setModeloVehiculoDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!modeloVehiculoFiltro ? '✓ ' : '    '}</Text>
                  <Text style={styles.dropdownItemText}>Todos los modelos</Text>
                </Pressable>
                {obtenerModelosVehiculo().map((modelo) => (
                  <Pressable
                    key={modelo}
                    style={[styles.dropdownItem, modeloVehiculoFiltro === modelo && styles.dropdownItemActive]}
                    onPress={() => {
                      setModeloVehiculoFiltro(modelo);
                      setModeloVehiculoDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>
                      {modeloVehiculoFiltro === modelo ? '✓ ' : '    '}
                    </Text>
                    <Text style={styles.dropdownItemText}>{modelo}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Botones de búsqueda */}
            <View style={styles.searchButtonsRow}>
              <Pressable
                onPress={buscarProductos}
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && styles.searchButtonPressed
                ]}
              >
                {({ pressed }) => (
                  <Text style={[styles.searchButtonText, pressed && styles.searchButtonTextPressed]}>
                    BUSCAR
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
                    LIMPIAR
                  </Text>
                )}
              </Pressable>
            </View>

            {/* RESULTADOS DE LA BÚSQUEDA */}
            {productosFiltrados.length > 0 && (
              <>
                <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>Resultados</Text>
                {productosFiltrados.map((producto) => (
                  <View key={producto.id} style={styles.productCard}>
                    <Text style={styles.productName}>{producto.nombre}</Text>
                    <Text style={styles.productDetail}>Marca: {producto.marcaComponente}</Text>
                    <Text style={styles.productDetail}>Categoría: {producto.categoria}</Text>
                    <Text style={styles.productDetail}>SKU: {producto.codigoSKU}</Text>
                    
                    {producto.compatibilidades.length > 0 && (
                      <>
                        <Text style={[styles.productDetail, { marginTop: 8, fontWeight: '600' }]}>
                          Compatibilidad:
                        </Text>
                        {producto.compatibilidades.slice(0, 2).map((comp) => (
                          <Text key={comp.id} style={styles.productCompatibility}>
                            • {comp.marca} | {comp.modelo} | {comp.anoDesde} - {comp.anoHasta}
                          </Text>
                        ))}
                      </>
                    )}
                    
                    <Text style={styles.productStock}>
                      Stock: {producto.stockActual} {producto.unidadMedida}
                    </Text>
                    <Text style={styles.productPrice}>Precio: ${producto.precioVenta.toFixed(2)}</Text>
                    
                    <Pressable
                      onPress={() => agregarRepuesto(producto)}
                      disabled={repuestosSeleccionados.some(r => r.id === producto.id) || producto.stockActual === 0}
                      style={({ pressed }) => [
                        styles.addProductButton,
                        (repuestosSeleccionados.some(r => r.id === producto.id) || producto.stockActual === 0) && styles.addProductButtonDisabled,
                        pressed && styles.addProductButtonPressed
                      ]}
                    >
                      {({ pressed }) => (
                        <Text style={[
                          styles.addProductButtonText,
                          (repuestosSeleccionados.some(r => r.id === producto.id) || producto.stockActual === 0) && styles.addProductButtonTextDisabled,
                          pressed && styles.addProductButtonTextPressed
                        ]}>
                          {repuestosSeleccionados.some(r => r.id === producto.id) 
                            ? 'YA AGREGADO' 
                            : producto.stockActual === 0 
                              ? 'SIN STOCK' 
                              : 'AGREGAR'}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                ))}
              </>
            )}

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
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            >
              {({ pressed }) => (
                <Text style={[styles.saveBtnText, pressed && styles.saveBtnTextPressed]}>
                  {getTextoBoton()}
                </Text>
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
