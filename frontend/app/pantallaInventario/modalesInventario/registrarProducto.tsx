import React, { useState, useEffect } from 'react';
import {
  Modal, Platform, View, Text, TextInput, ScrollView, Pressable
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styles from '@/Styles/pantallaInventario/modalesInventario/registrarProducto';
import {
  validarNombreProducto,
  validarCodigoSKU,
  validarObligatorio,
  validarStockNumero,
  validarPrecio,
  validarCategoriaOtra,
  validarMarcaPersonalizada,
  validarModeloPersonalizado,
  validarUbicacionInventario,
  validarAnoVehiculo,
  validarRangoAnos,
  validarStockMinimo,
  validarStockCritico,
} from '@/utils/validaciones';
import {
  formatearNumeroConPuntos,
  manejarCambioNumeroFormateado,
  manejarCambioPrecioEstadounidense,
  filtrarCaracteresEspeciales,
  filtrarUbicacionInventario,
} from '@/utils/formatNumbers';

const MARCAS_COMPONENTES = [
  'ACDelco', 'Aisin', 'Bosch', 'Brembo', 'Champion', 'Dayco', 'Denso', 'Delphi',
  'Eaton', 'EBC', 'Exedy', 'Ferodo', 'Gates', 'GKN', 'Goodridge', 'Hella',
  'Holley', 'KYB', 'Lucas', 'Mahle', 'Mann-Filter', 'Mevotech', 'Moog',
  'Monroe', 'NGK', 'NTN', 'Pennzoil', 'Pertronix', 'Sachs', 'SKF',
  'Timken', 'TRW', 'Valeo', 'Wagner', 'Wix', 'ZF', 'Otro'
];

const CATEGORIAS = [
  'Filtros', 'Frenos', 'Suspensión', 'Dirección', 'Motor', 'Transmisión',
  'Embrague', 'Sistema eléctrico', 'Encendido', 'Inyección', 'Refrigeración',
  'Correas', 'Rodamientos', 'Escape', 'Lubricantes', 'Baterías', 'Neumáticos',
  'Iluminación', 'Sensores', 'Sistema de combustible', 'Sistema de climatización',
  'Carrocería', 'Accesorios', 'Herramientas', 'Fluidos y líquidos',
  'Juntas y sellos', 'Tornillería y fijaciones', 'Otros'
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

const UNIDADES_MEDIDA = [
  'Unidad', 'Par', 'Juego', 'Kit', 'Litro', 'Galón', 'Caja', 'Otro'
];

const generarAnos = () => {
  const anoActual = new Date().getFullYear();
  const anos: number[] = [];
  for (let i = 1980; i <= anoActual; i++) {
    anos.push(i);
  }
  return anos.reverse();
};

interface CompatibilidadVehicular {
  id: string;
  marca: string;
  modelo: string;
  anoDesde: string;
  anoHasta: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (producto: any) => void;
}

export default function RegistrarProducto({ visible, onClose, onSuccess }: Props) {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [visible]);

  const [nombreProducto, setNombreProducto] = useState('');
  const [codigoSKU, setCodigoSKU] = useState('');
  const [marcaComponente, setMarcaComponente] = useState('ACDelco');
  const [marcaComponenteOtra, setMarcaComponenteOtra] = useState('');
  const [categoria, setCategoria] = useState('Filtros');
  const [categoriaOtra, setCategoriaOtra] = useState('');
  const [numeroParteOEM, setNumeroParteOEM] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [stockCritico, setStockCritico] = useState('');
  
  // Estados para precios con formato automático
  const [precioCompra, setPrecioCompra] = useState(''); // valor raw (sin formato)
  const [precioCompraDisplay, setPrecioCompraDisplay] = useState(''); // valor con formato
  const [precioVenta, setPrecioVenta] = useState(''); // valor raw (sin formato)
  const [precioVentaDisplay, setPrecioVentaDisplay] = useState(''); // valor con formato
  
  const [ubicacion, setUbicacion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('Unidad');
  const [otraUnidadMedida, setOtraUnidadMedida] = useState('');
  
  // Estados para valores formateados (display) - solo stocks
  const [stockActualDisplay, setStockActualDisplay] = useState('');
  const [stockMinimoDisplay, setStockMinimoDisplay] = useState('');
  const [stockCriticoDisplay, setStockCriticoDisplay] = useState('');
  
  // Compatibilidad vehicular temporal
  const [marcaVehiculo, setMarcaVehiculo] = useState('');
  const [marcaVehiculoOtra, setMarcaVehiculoOtra] = useState('');
  const [modeloVehiculo, setModeloVehiculo] = useState('');
  const [modeloVehiculoOtro, setModeloVehiculoOtro] = useState('');
  const [anoDesde, setAnoDesde] = useState('');
  const [anoHasta, setAnoHasta] = useState('');
  const [compatibilidades, setCompatibilidades] = useState<CompatibilidadVehicular[]>([]);
  
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
  const [showUnidadDropdown, setShowUnidadDropdown] = useState(false);
  const [showMarcaVehiculoDropdown, setShowMarcaVehiculoDropdown] = useState(false);
  const [showModeloVehiculoDropdown, setShowModeloVehiculoDropdown] = useState(false);
  const [showAnoDesdeDropdown, setShowAnoDesdeDropdown] = useState(false);
  const [showAnoHastaDropdown, setShowAnoHastaDropdown] = useState(false);

  const [errores, setErrores] = useState({
    nombreProducto: '',
    codigoSKU: '',
    marcaComponente: '',
    marcaComponenteOtra: '',
    categoria: '',
    categoriaOtra: '',
    descripcion: '',
    stockActual: '',
    stockMinimo: '',
    stockCritico: '',
    precioCompra: '',
    precioVenta: '',
    ubicacion: '',
    unidadMedida: '',
    marcaVehiculo: '',
    marcaVehiculoOtra: '',
    modeloVehiculo: '',
    modeloVehiculoOtro: '',
    anoDesde: '',
    anoHasta: '',
    rangoAnos: '',
  });

  // Si marca es "Otro", mostrar todos los modelos; si es específica, mostrar solo sus modelos
  const todosLosModelos = Object.values(MODELOS_POR_MARCA).flat();
  const modelosDisponibles = marcaVehiculo === 'Otro'
    ? [...todosLosModelos, 'Otro']
    : marcaVehiculo && MODELOS_POR_MARCA[marcaVehiculo]
    ? [...MODELOS_POR_MARCA[marcaVehiculo], 'Otro']
    : ['Otro'];

  const anos = generarAnos();

  const cerrarDropdowns = () => {
    setShowMarcaDropdown(false);
    setShowCategoriaDropdown(false);
    setShowUnidadDropdown(false);
    setShowMarcaVehiculoDropdown(false);
    setShowModeloVehiculoDropdown(false);
    setShowAnoDesdeDropdown(false);
    setShowAnoHastaDropdown(false);
  };

  const agregarCompatibilidad = () => {
    const marcaFinal = marcaVehiculo === 'Otro' ? marcaVehiculoOtra : marcaVehiculo;
    const modeloFinal = modeloVehiculo === 'Otro' ? modeloVehiculoOtro : modeloVehiculo;

    // Validaciones con mensajes inline
    let tieneErrores = false;
    const nuevosErrores = { ...errores };

    // Validar marca
    if (!marcaVehiculo) {
      nuevosErrores.marcaVehiculo = 'Seleccione la marca del vehículo.';
      tieneErrores = true;
    } else if (marcaVehiculo === 'Otro' && !marcaVehiculoOtra.trim()) {
      nuevosErrores.marcaVehiculoOtra = 'Ingrese la marca del vehículo.';
      tieneErrores = true;
    } else if (marcaVehiculo === 'Otro') {
      const errorMarca = validarMarcaPersonalizada(marcaVehiculoOtra, 'la marca del vehículo');
      if (errorMarca) {
        nuevosErrores.marcaVehiculoOtra = errorMarca;
        tieneErrores = true;
      } else {
        nuevosErrores.marcaVehiculoOtra = '';
      }
    } else {
      nuevosErrores.marcaVehiculo = '';
      nuevosErrores.marcaVehiculoOtra = '';
    }

    // Validar modelo
    if (!modeloVehiculo) {
      nuevosErrores.modeloVehiculo = 'Seleccione el modelo del vehículo.';
      tieneErrores = true;
    } else if (modeloVehiculo === 'Otro' && !modeloVehiculoOtro.trim()) {
      nuevosErrores.modeloVehiculoOtro = 'Ingrese el modelo del vehículo.';
      tieneErrores = true;
    } else if (modeloVehiculo === 'Otro') {
      const errorModelo = validarModeloPersonalizado(modeloVehiculoOtro, 'vehículo');
      if (errorModelo) {
        nuevosErrores.modeloVehiculoOtro = errorModelo;
        tieneErrores = true;
      } else {
        nuevosErrores.modeloVehiculoOtro = '';
      }
    } else {
      nuevosErrores.modeloVehiculo = '';
      nuevosErrores.modeloVehiculoOtro = '';
    }

    // Validar año desde
    if (!anoDesde) {
      nuevosErrores.anoDesde = 'El año "Desde" es obligatorio.';
      tieneErrores = true;
    } else {
      const errorAnoDesde = validarAnoVehiculo(anoDesde, 'Año Desde');
      if (errorAnoDesde) {
        nuevosErrores.anoDesde = errorAnoDesde;
        tieneErrores = true;
      } else {
        nuevosErrores.anoDesde = '';
      }
    }

    // Validar año hasta
    if (!anoHasta) {
      nuevosErrores.anoHasta = 'El año "Hasta" es obligatorio.';
      tieneErrores = true;
    } else {
      const errorAnoHasta = validarAnoVehiculo(anoHasta, 'Año Hasta');
      if (errorAnoHasta) {
        nuevosErrores.anoHasta = errorAnoHasta;
        tieneErrores = true;
      } else {
        nuevosErrores.anoHasta = '';
      }
    }

    // Validar rango de años
    if (!tieneErrores && anoDesde && anoHasta) {
      const errorRango = validarRangoAnos(anoDesde, anoHasta);
      if (errorRango) {
        nuevosErrores.rangoAnos = errorRango;
        tieneErrores = true;
      } else {
        nuevosErrores.rangoAnos = '';
      }
    }

    setErrores(nuevosErrores);

    if (tieneErrores) {
      return;
    }

    const nuevaCompatibilidad: CompatibilidadVehicular = {
      id: Date.now().toString(),
      marca: marcaFinal,
      modelo: modeloFinal,
      anoDesde,
      anoHasta,
    };

    setCompatibilidades([...compatibilidades, nuevaCompatibilidad]);
    setMarcaVehiculo('');
    setMarcaVehiculoOtra('');
    setModeloVehiculo('');
    setModeloVehiculoOtro('');
    setAnoDesde('');
    setAnoHasta('');
    setErrores({ 
      ...nuevosErrores, 
      marcaVehiculo: '',
      marcaVehiculoOtra: '', 
      modeloVehiculo: '',
      modeloVehiculoOtro: '',
      anoDesde: '',
      anoHasta: '',
      rangoAnos: '',
    });
  };

  const eliminarCompatibilidad = (id: string) => {
    setCompatibilidades(compatibilidades.filter(c => c.id !== id));
  };

  const limpiarFormulario = () => {
    setNombreProducto('');
    setCodigoSKU('');
    setMarcaComponente('ACDelco');
    setMarcaComponenteOtra('');
    setCategoria('Filtros');
    setCategoriaOtra('');
    setNumeroParteOEM('');
    setDescripcion('');
    setStockActual('');
    setStockMinimo('');
    setStockCritico('');
    setPrecioCompra('');
    setPrecioVenta('');
    setUbicacion('');
    setUnidadMedida('Unidad');
    
    // Limpiar estados display de stocks y precios
    setStockActualDisplay('');
    setStockMinimoDisplay('');
    setStockCriticoDisplay('');
    setPrecioCompraDisplay('');
    setPrecioVentaDisplay('');
    
    setCompatibilidades([]);
    setMarcaVehiculo('');
    setMarcaVehiculoOtra('');
    setModeloVehiculo('');
    setModeloVehiculoOtro('');
    setAnoDesde('');
    setAnoHasta('');
    setErrores({
      nombreProducto: '',
      codigoSKU: '',
      marcaComponente: '',
      marcaComponenteOtra: '',
      categoria: '',
      categoriaOtra: '',
      descripcion: '',
      stockActual: '',
      stockMinimo: '',
      stockCritico: '',
      precioCompra: '',
      precioVenta: '',
      ubicacion: '',
      unidadMedida: '',
      marcaVehiculo: '',
      marcaVehiculoOtra: '',
      modeloVehiculo: '',
      modeloVehiculoOtro: '',
      anoDesde: '',
      anoHasta: '',
      rangoAnos: '',
    });
  };

  // Limpiar formulario cuando el modal se abre
  useEffect(() => {
    if (visible) {
      limpiarFormulario();
    }
  }, [visible]);

  const validarFormulario = () => {
    const nuevosErrores = {
      nombreProducto: validarNombreProducto(nombreProducto) || '',
      codigoSKU: validarCodigoSKU(codigoSKU) || '',
      marcaComponente: validarObligatorio(marcaComponente, 'La marca') || '',
      marcaComponenteOtra: marcaComponente === 'Otro' ? (validarMarcaPersonalizada(marcaComponenteOtra, 'la marca del componente') || '') : '',
      categoria: validarObligatorio(categoria, 'La categoría') || '',
      categoriaOtra: categoria === 'Otros' ? (validarCategoriaOtra(categoriaOtra) || '') : '',
      descripcion: validarObligatorio(descripcion, 'La descripción') || '',
      stockActual: validarStockNumero(stockActual, 'El stock actual') || '',
      stockMinimo: validarStockNumero(stockMinimo, 'El stock mínimo') || validarStockMinimo(stockActual, stockMinimo) || '',
      stockCritico: validarStockNumero(stockCritico, 'El stock crítico') || validarStockCritico(stockActual, stockCritico) || '',
      precioCompra: validarPrecio(precioCompra, 'El precio de compra') || '',
      precioVenta: validarPrecio(precioVenta, 'El precio de venta') || '',
      ubicacion: validarUbicacionInventario(ubicacion) || '',
      unidadMedida: validarObligatorio(unidadMedida, 'La unidad de medida') || (unidadMedida === 'Otro' && !otraUnidadMedida.trim() ? 'Debe especificar la unidad de medida.' : ''),
      marcaVehiculo: '',
      marcaVehiculoOtra: '',
      modeloVehiculo: '',
      modeloVehiculoOtro: '',
      anoDesde: '',
      anoHasta: '',
      rangoAnos: '',
    };

    // PRIMERO: Validar si hay campos de compatibilidad parcialmente llenos
    if (marcaVehiculo || modeloVehiculo || anoDesde || anoHasta) {
      if (!marcaVehiculo) nuevosErrores.marcaVehiculo = 'Seleccione la marca del vehículo.';
      if (marcaVehiculo === 'Otro' && !marcaVehiculoOtra.trim()) nuevosErrores.marcaVehiculoOtra = 'Debe especificar la marca del vehículo.';
      if (!modeloVehiculo) nuevosErrores.modeloVehiculo = 'Seleccione el modelo del vehículo.';
      if (modeloVehiculo === 'Otro' && !modeloVehiculoOtro.trim()) nuevosErrores.modeloVehiculoOtro = 'Debe especificar el modelo del vehículo.';
      if (!anoDesde) nuevosErrores.anoDesde = 'El año "Desde" es obligatorio.';
      if (!anoHasta) nuevosErrores.anoHasta = 'El año "Hasta" es obligatorio.';
      
      setErrores(nuevosErrores);
      return false;
    }

    // SEGUNDO: Validar que haya al menos una compatibilidad
    if (compatibilidades.length === 0) {
      setErrores({ ...nuevosErrores, marcaVehiculo: 'Debe agregar al menos una compatibilidad vehicular.' });
      return false;
    }

    setErrores(nuevosErrores);
    return !Object.values(nuevosErrores).some(error => error !== '');
  };

  const handleGuardar = () => {
    // Validar formulario con los valores raw
    if (!validarFormulario()) {
      return;
    }

    // Convertir precios del formato raw (ya son números) al formato numérico
    const convertirPrecioEstadounidense = (precio: string): number => {
      return parseFloat(precio) || 0;
    };

    const nuevoProducto = {
      nombre: nombreProducto.trim(),
      codigoSKU: codigoSKU.trim().toUpperCase(),
      marcaComponente: marcaComponente === 'Otro' ? marcaComponenteOtra.trim() : marcaComponente,
      categoria: categoria === 'Otros' ? categoriaOtra.trim() : categoria,
      numeroParteOEM: numeroParteOEM.trim(),
      descripcion: descripcion.trim(),
      stockActual: parseInt(stockActual) || 0,
      stockMinimo: parseInt(stockMinimo) || 0,
      stockCritico: parseInt(stockCritico) || 0,
      precioCompra: convertirPrecioEstadounidense(precioCompra),
      precioVenta: convertirPrecioEstadounidense(precioVenta),
      ubicacionInventario: ubicacion.trim(),
      unidadMedida: unidadMedida === 'Otro' ? otraUnidadMedida.trim() : unidadMedida,
      compatibilidades,
    };

    onSuccess(nuevoProducto);
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextBlock}>
              <Text style={styles.modalTitle}>Registrar Producto</Text>
              <Text style={styles.modalSubtitle}>Completa la información del nuevo producto</Text>
            </View>
            <Pressable 
              onPress={onClose} 
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed
              ]}
              hitSlop={8}
            >
              <FontAwesome name="times" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.label}>Nombre del Producto</Text>
            <TextInput
              placeholder="Ej: Filtro de Aceite Premium"
              placeholderTextColor="#64748B"
              value={nombreProducto}
              onChangeText={(text) => {
                const textoFiltrado = filtrarCaracteresEspeciales(text);
                setNombreProducto(textoFiltrado);
                setErrores({ ...errores, nombreProducto: '' });
              }}
              style={[styles.input, errores.nombreProducto && styles.inputError]}
            />
            {!!errores.nombreProducto && <Text style={styles.errorText}>{errores.nombreProducto}</Text>}

            <Text style={styles.label}>Código SKU</Text>
            <TextInput
              placeholder="Ej: BOS12345"
              placeholderTextColor="#64748B"
              value={codigoSKU}
              onChangeText={(text) => {
                setCodigoSKU(text.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                setErrores({ ...errores, codigoSKU: '' });
              }}
              style={[styles.input, errores.codigoSKU && styles.inputError]}
              maxLength={20}
              autoCapitalize="characters"
            />
            {!!errores.codigoSKU && <Text style={styles.errorText}>{errores.codigoSKU}</Text>}

            <Text style={styles.label}>Marca del Componente</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                cerrarDropdowns();
                setShowMarcaDropdown(!showMarcaDropdown);
              }}
            >
              <Text style={styles.dropdownTextSelected}>{marcaComponente}</Text>
              <FontAwesome name={showMarcaDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
            </Pressable>
            {showMarcaDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {MARCAS_COMPONENTES.map((marca) => (
                  <Pressable
                    key={marca}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMarcaComponente(marca);
                      setShowMarcaDropdown(false);
                      if (marca !== 'Otro') {
                        setMarcaComponenteOtra('');
                        setErrores({ ...errores, marcaComponenteOtra: '' });
                      }
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{marca}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {marcaComponente === 'Otro' && (
              <>
                <Text style={styles.label}>Especifica la Marca</Text>
                <TextInput
                  placeholder="Ej: NGK"
                  placeholderTextColor="#64748B"
                  value={marcaComponenteOtra}
                  onChangeText={(text) => {
                    // Solo permitir letras y espacios
                    const textoLimpio = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    setMarcaComponenteOtra(textoLimpio);
                    setErrores({ ...errores, marcaComponenteOtra: '' });
                  }}
                  style={[styles.input, errores.marcaComponenteOtra && styles.inputError]}
                />
                {!!errores.marcaComponenteOtra && <Text style={styles.errorText}>{errores.marcaComponenteOtra}</Text>}
              </>
            )}

            <Text style={styles.label}>Categoría</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                cerrarDropdowns();
                setShowCategoriaDropdown(!showCategoriaDropdown);
              }}
            >
              <Text style={styles.dropdownTextSelected}>{categoria}</Text>
              <FontAwesome name={showCategoriaDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
            </Pressable>
            {showCategoriaDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {CATEGORIAS.map((cat) => (
                  <Pressable
                    key={cat}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategoria(cat);
                      setShowCategoriaDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{cat}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {categoria === 'Otros' && (
              <>
                <Text style={styles.label}>Especifica la Categoría</Text>
                <TextInput
                  placeholder="Ej: Accesorios especializados"
                  placeholderTextColor="#64748B"
                  value={categoriaOtra}
                  onChangeText={(text) => {
                    const textoFiltrado = filtrarCaracteresEspeciales(text);
                    setCategoriaOtra(textoFiltrado);
                    setErrores({ ...errores, categoriaOtra: '' });
                  }}
                  style={[styles.input, errores.categoriaOtra && styles.inputError]}
                />
                {!!errores.categoriaOtra && <Text style={styles.errorText}>{errores.categoriaOtra}</Text>}
              </>
            )}

            <Text style={styles.label}>Número de Parte OEM (Opcional)</Text>
            <TextInput
              placeholder="Ej: 12345ABC"
              placeholderTextColor="#64748B"
              value={numeroParteOEM}
              onChangeText={(text) => {
                const textoFiltrado = filtrarCaracteresEspeciales(text);
                setNumeroParteOEM(textoFiltrado);
              }}
              style={styles.input}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              placeholder="Descripción detallada del producto"
              placeholderTextColor="#64748B"
              value={descripcion}
              onChangeText={(text) => {
                setDescripcion(text);
                setErrores({ ...errores, descripcion: '' });
              }}
              style={[styles.input, styles.textArea, errores.descripcion && styles.inputError]}
              multiline
              numberOfLines={3}
            />
            {!!errores.descripcion && <Text style={styles.errorText}>{errores.descripcion}</Text>}

            <Text style={styles.label}>Stock Actual</Text>
            <TextInput
              placeholder="Ingrese cantidad"
              placeholderTextColor="#64748B"
              value={stockActualDisplay !== '' ? stockActualDisplay : (stockActual ? formatearNumeroConPuntos(stockActual) : '')}
              onChangeText={(text) => {
                const { display, raw } = manejarCambioNumeroFormateado(text);
                setStockActualDisplay(display);
                setStockActual(raw);
                setErrores({ ...errores, stockActual: '' });
              }}
              keyboardType="numeric"
              style={[styles.input, errores.stockActual && styles.inputError]}
            />
            {!!errores.stockActual && <Text style={styles.errorText}>{errores.stockActual}</Text>}

            <Text style={styles.label}>Stock Mínimo</Text>
            <TextInput
              placeholder="Ingrese cantidad"
              placeholderTextColor="#64748B"
              value={stockMinimoDisplay !== '' ? stockMinimoDisplay : (stockMinimo ? formatearNumeroConPuntos(stockMinimo) : '')}
              onChangeText={(text) => {
                const { display, raw } = manejarCambioNumeroFormateado(text);
                setStockMinimoDisplay(display);
                setStockMinimo(raw);
                setErrores({ ...errores, stockMinimo: '' });
              }}
              keyboardType="numeric"
              style={[styles.input, errores.stockMinimo && styles.inputError]}
            />
            {!!errores.stockMinimo && <Text style={styles.errorText}>{errores.stockMinimo}</Text>}

            <Text style={styles.label}>Stock Crítico</Text>
            <TextInput
              placeholder="Ingrese cantidad"
              placeholderTextColor="#64748B"
              value={stockCriticoDisplay !== '' ? stockCriticoDisplay : (stockCritico ? formatearNumeroConPuntos(stockCritico) : '')}
              onChangeText={(text) => {
                const { display, raw } = manejarCambioNumeroFormateado(text);
                setStockCriticoDisplay(display);
                setStockCritico(raw);
                setErrores({ ...errores, stockCritico: '' });
              }}
              keyboardType="numeric"
              style={[styles.input, errores.stockCritico && styles.inputError]}
            />
            {!!errores.stockCritico && <Text style={styles.errorText}>{errores.stockCritico}</Text>}

            <Text style={styles.label}>Precio de Compra</Text>
            <TextInput
              placeholder="Ej: 50.59 o 1,000.50"
              placeholderTextColor="#64748B"
              value={precioCompraDisplay !== '' ? precioCompraDisplay : (precioCompra ? precioCompra : '')}
              onChangeText={(text) => {
                const { display, raw } = manejarCambioPrecioEstadounidense(text);
                setPrecioCompraDisplay(display);
                setPrecioCompra(raw);
                setErrores({ ...errores, precioCompra: '' });
              }}
              keyboardType="decimal-pad"
              style={[styles.input, errores.precioCompra && styles.inputError]}
            />
            {!!errores.precioCompra && <Text style={styles.errorText}>{errores.precioCompra}</Text>}

            <Text style={styles.label}>Precio de Venta</Text>
            <TextInput
              placeholder="Ej: 70.59 o 2,500.50"
              placeholderTextColor="#64748B"
              value={precioVentaDisplay !== '' ? precioVentaDisplay : (precioVenta ? precioVenta : '')}
              onChangeText={(text) => {
                const { display, raw } = manejarCambioPrecioEstadounidense(text);
                setPrecioVentaDisplay(display);
                setPrecioVenta(raw);
                setErrores({ ...errores, precioVenta: '' });
              }}
              keyboardType="decimal-pad"
              style={[styles.input, errores.precioVenta && styles.inputError]}
            />
            {!!errores.precioVenta && <Text style={styles.errorText}>{errores.precioVenta}</Text>}

            <Text style={styles.label}>Unidad de Medida</Text>
            <Pressable
              style={[styles.dropdown, errores.unidadMedida && styles.dropdownError]}
              onPress={() => {
                cerrarDropdowns();
                setShowUnidadDropdown(!showUnidadDropdown);
                setErrores({ ...errores, unidadMedida: '' });
              }}
            >
              <Text style={styles.dropdownTextSelected}>{unidadMedida}</Text>
              <FontAwesome name={showUnidadDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
            </Pressable>
            {showUnidadDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {UNIDADES_MEDIDA.map((unidad) => (
                  <Pressable
                    key={unidad}
                    style={[styles.dropdownItem, unidadMedida === unidad && styles.dropdownItemActive]}
                    onPress={() => {
                      setUnidadMedida(unidad);
                      setShowUnidadDropdown(false);
                      setErrores({ ...errores, unidadMedida: '' });
                      if (unidad !== 'Otro') {
                        setOtraUnidadMedida('');
                      }
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {unidad}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {!!errores.unidadMedida && <Text style={styles.errorText}>{errores.unidadMedida}</Text>}
            
            {/* Campo para especificar otra unidad de medida */}
            {unidadMedida === 'Otro' && (
              <>
                <Text style={styles.label}>Especificar Unidad de Medida</Text>
                <TextInput
                  placeholder="Ingrese la unidad de medida..."
                  placeholderTextColor="#64748B"
                  value={otraUnidadMedida}
                  onChangeText={(text) => {
                    // Solo permitir letras y espacios
                    const soloLetras = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    setOtraUnidadMedida(soloLetras);
                    setErrores({ ...errores, unidadMedida: '' });
                  }}
                  style={[styles.input, errores.unidadMedida && styles.inputError]}
                />
                {!!errores.unidadMedida && <Text style={styles.errorText}>{errores.unidadMedida}</Text>}
              </>
            )}

            <Text style={styles.label}>Ubicación en Inventario</Text>
            <TextInput
              placeholder="Ej: Estante A-4"
              placeholderTextColor="#64748B"
              value={ubicacion}
              onChangeText={(text) => {
                const filtered = filtrarUbicacionInventario(text);
                setUbicacion(filtered);
                setErrores({ ...errores, ubicacion: '' });
              }}
              style={[styles.input, errores.ubicacion && styles.inputError]}
            />
            {!!errores.ubicacion && <Text style={styles.errorText}>{errores.ubicacion}</Text>}

            {/* Sección de Compatibilidad Vehicular */}
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>COMPATIBILIDAD VEHICULAR</Text>

            <Text style={styles.label}>Marca del Vehículo</Text>
            <Pressable
              style={[styles.dropdown, errores.marcaVehiculo && styles.dropdownError]}
              onPress={() => {
                cerrarDropdowns();
                setShowMarcaVehiculoDropdown(!showMarcaVehiculoDropdown);
              }}
            >
              <Text style={marcaVehiculo ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                {marcaVehiculo || 'Selecciona una marca'}
              </Text>
              <FontAwesome name={showMarcaVehiculoDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
            </Pressable>
            {showMarcaVehiculoDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {MARCAS_VEHICULOS.map((marca) => (
                  <Pressable
                    key={marca}
                    style={[styles.dropdownItem, marcaVehiculo === marca && styles.dropdownItemActive]}
                    onPress={() => {
                      setMarcaVehiculo(marca);
                      setModeloVehiculo('');
                      setShowMarcaVehiculoDropdown(false);
                      setErrores({ ...errores, marcaVehiculo: '', marcaVehiculoOtra: '' });
                      if (marca !== 'Otro') {
                        setMarcaVehiculoOtra('');
                      }
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{marca}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {!!errores.marcaVehiculo && <Text style={styles.errorText}>{errores.marcaVehiculo}</Text>}

            {marcaVehiculo === 'Otro' && (
              <>
                <Text style={styles.label}>Especifica la Marca del Vehículo</Text>
                <TextInput
                  placeholder="Ej: Tesla"
                  placeholderTextColor="#64748B"
                  value={marcaVehiculoOtra}
                  onChangeText={(text) => {
                    // Solo permitir letras y espacios
                    const textoLimpio = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    setMarcaVehiculoOtra(textoLimpio);
                    setErrores({ ...errores, marcaVehiculoOtra: '' });
                  }}
                  style={[styles.input, errores.marcaVehiculoOtra && styles.inputError]}
                />
                {!!errores.marcaVehiculoOtra && <Text style={styles.errorText}>{errores.marcaVehiculoOtra}</Text>}
              </>
            )}

            {marcaVehiculo && (
              <>
                <Text style={styles.label}>Modelo del Vehículo</Text>
                <Pressable
                  style={[styles.dropdown, errores.modeloVehiculo && styles.dropdownError]}
                  onPress={() => {
                    cerrarDropdowns();
                    setShowModeloVehiculoDropdown(!showModeloVehiculoDropdown);
                  }}
                >
                  <Text style={modeloVehiculo ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                    {modeloVehiculo || 'Selecciona un modelo'}
                  </Text>
                  <FontAwesome name={showModeloVehiculoDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
                </Pressable>
                {showModeloVehiculoDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {modelosDisponibles.map((modelo) => (
                      <Pressable
                        key={modelo}
                        style={[styles.dropdownItem, modeloVehiculo === modelo && styles.dropdownItemActive]}
                        onPress={() => {
                          setModeloVehiculo(modelo);
                          setShowModeloVehiculoDropdown(false);
                          setErrores({ ...errores, modeloVehiculo: '', modeloVehiculoOtro: '' });
                          if (modelo !== 'Otro') {
                            setModeloVehiculoOtro('');
                          }
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{modelo}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {!!errores.modeloVehiculo && <Text style={styles.errorText}>{errores.modeloVehiculo}</Text>}

                {modeloVehiculo === 'Otro' && (
                  <>
                    <Text style={styles.label}>Especifica el Modelo del Vehículo</Text>
                    <TextInput
                      placeholder="Ej: Model 3"
                      placeholderTextColor="#64748B"
                      value={modeloVehiculoOtro}
                      onChangeText={(text) => {
                        // Permitir letras, números, espacios y guiones
                        const textoLimpio = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g, '');
                        setModeloVehiculoOtro(textoLimpio);
                        setErrores({ ...errores, modeloVehiculoOtro: '' });
                      }}
                      style={[styles.input, errores.modeloVehiculoOtro && styles.inputError]}
                    />
                    {!!errores.modeloVehiculoOtro && <Text style={styles.errorText}>{errores.modeloVehiculoOtro}</Text>}
                  </>
                )}
              </>
            )}

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Año Desde</Text>
                <Pressable
                  style={[styles.dropdown, errores.anoDesde && styles.dropdownError]}
                  onPress={() => {
                    cerrarDropdowns();
                    setShowAnoDesdeDropdown(!showAnoDesdeDropdown);
                  }}
                >
                  <Text style={anoDesde ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                    {anoDesde || 'Año'}
                  </Text>
                  <FontAwesome name={showAnoDesdeDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
                </Pressable>
                {showAnoDesdeDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {anos.map((ano) => (
                      <Pressable
                        key={ano}
                        style={[styles.dropdownItem, anoDesde === ano.toString() && styles.dropdownItemActive]}
                        onPress={() => {
                          setAnoDesde(ano.toString());
                          setShowAnoDesdeDropdown(false);
                          setErrores({ ...errores, anoDesde: '', rangoAnos: '' });
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{ano}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {!!errores.anoDesde && <Text style={styles.errorText}>{errores.anoDesde}</Text>}
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>Año Hasta</Text>
                <Pressable
                  style={[styles.dropdown, errores.anoHasta && styles.dropdownError]}
                  onPress={() => {
                    cerrarDropdowns();
                    setShowAnoHastaDropdown(!showAnoHastaDropdown);
                  }}
                >
                  <Text style={anoHasta ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                    {anoHasta || 'Año'}
                  </Text>
                  <FontAwesome name={showAnoHastaDropdown ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
                </Pressable>
                {showAnoHastaDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    {anos.map((ano) => (
                      <Pressable
                        key={ano}
                        style={[styles.dropdownItem, anoHasta === ano.toString() && styles.dropdownItemActive]}
                        onPress={() => {
                          setAnoHasta(ano.toString());
                          setShowAnoHastaDropdown(false);
                          setErrores({ ...errores, anoHasta: '', rangoAnos: '' });
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{ano}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
                {!!errores.anoHasta && <Text style={styles.errorText}>{errores.anoHasta}</Text>}
              </View>
            </View>
            {!!errores.rangoAnos && <Text style={styles.errorText}>{errores.rangoAnos}</Text>}

            <Pressable onPress={agregarCompatibilidad} style={styles.addButton}>
              <FontAwesome name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.addButtonText}>AGREGAR COMPATIBILIDAD</Text>
            </Pressable>

            {compatibilidades.length > 0 && (
              <>
                <Text style={styles.compatibilidadesLabel}>
                  Compatibilidades agregadas ({compatibilidades.length})
                </Text>
                <View style={styles.compatibilidadesList}>
                  {compatibilidades.map((comp) => (
                    <View key={comp.id} style={styles.compatibilidadItem}>
                      <View style={styles.compatibilidadInfo}>
                        <Text style={styles.compatibilidadMarca}>{comp.marca}</Text>
                        <Text style={styles.compatibilidadModelo}>{comp.modelo}</Text>
                        <Text style={styles.compatibilidadAnos}>
                          {comp.anoDesde} - {comp.anoHasta}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => eliminarCompatibilidad(comp.id)}
                        style={styles.deleteButton}
                      >
                        <FontAwesome name="trash" size={18} color="#EF4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable 
              onPress={() => {
                limpiarFormulario();
                onClose();
              }} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </Pressable>
            <Pressable 
              onPress={handleGuardar} 
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && styles.saveBtnPressed
              ]}
            >
              {({ pressed }) => (
                <Text style={[
                  styles.saveBtnText,
                  pressed && styles.saveBtnTextPressed
                ]}>
                  GUARDAR
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
