import { useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import NavbarInventario from '@/components/navbarInventario/navbarInventario';
import stylesBase from '@/Styles/pantallaInventario/sistemaInventario';
import stylesWeb from '@/Styles/pantallaInventario/sistemaInventario.web';

const styles = Platform.OS === 'web' ? stylesWeb : stylesBase;
import { useAuth } from '@/context/AuthContext';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RegistrarProducto from './modalesInventario/registrarProducto';
import EditarProducto from './modalesInventario/editarProducto';
import VisualizarProducto from './modalesInventario/visualizarProducto';
import ConfirmarEliminacion from './modalesInventario/confirmacionEliminacion/confirmarEliminacion';
import EliminacionExitosa from './modalesInventario/confirmacionEliminacion/eliminacionExitosa';
import { obtenerProductos, Producto } from '@/utils/datosSimulados';
import { formatearNumeroConPuntos, formatearPrecioEspanol, manejarCambioPrecioEstadounidense } from '@/utils/formatNumbers';

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

export default function SistemaInventarioScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  
  // Determinar breakpoints
  const isSmallScreen = width < 1024;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    ScreenCapture.preventScreenCaptureAsync();
  }, []);
  
  // Estados de filtros
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [codigoSKU, setCodigoSKU] = useState('');
  const [marcaComponente, setMarcaComponente] = useState('');
  const [marcaComponenteOtra, setMarcaComponenteOtra] = useState('');
  const [marcaVehiculo, setMarcaVehiculo] = useState('');
  const [marcaVehiculoOtra, setMarcaVehiculoOtra] = useState('');
  const [modeloVehiculo, setModeloVehiculo] = useState('');
  const [modeloVehiculoOtro, setModeloVehiculoOtro] = useState('');
  const [anoDesde, setAnoDesde] = useState('');
  const [anoHasta, setAnoHasta] = useState('');
  const [estadoStock, setEstadoStock] = useState('Todos');
  const [estadoProducto, setEstadoProducto] = useState('Todos');
  
  // Estados para filtro de precio con formato automático
  const [precioMin, setPrecioMin] = useState(''); // raw
  const [precioMinDisplay, setPrecioMinDisplay] = useState(''); // display
  const [precioMax, setPrecioMax] = useState(''); // raw
  const [precioMaxDisplay, setPrecioMaxDisplay] = useState(''); // display
  
  // Estados de dropdowns abiertos
  const [showMarcaComponenteDropdown, setShowMarcaComponenteDropdown] = useState(false);
  const [showMarcaVehiculoDropdown, setShowMarcaVehiculoDropdown] = useState(false);
  const [showModeloVehiculoDropdown, setShowModeloVehiculoDropdown] = useState(false);
  const [showEstadoStockDropdown, setShowEstadoStockDropdown] = useState(false);
  const [showEstadoProductoDropdown, setShowEstadoProductoDropdown] = useState(false);
  
  const [showRegistrarProducto, setShowRegistrarProducto] = useState(false);
  const [showEditarProducto, setShowEditarProducto] = useState(false);
  const [showVisualizarProducto, setShowVisualizarProducto] = useState(false);
  const [showConfirmarEliminacion, setShowConfirmarEliminacion] = useState(false);
  const [showEliminacionExitosa, setShowEliminacionExitosa] = useState(false);
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [productoEliminado, setProductoEliminado] = useState<{ nombre: string } | null>(null);
  
  const todosLosModelelos = Object.values(MODELOS_POR_MARCA).flat();
  const modelosDisponibles = marcaVehiculo === 'Otro'
    ? [...todosLosModelelos, 'Otro']
    : marcaVehiculo && MODELOS_POR_MARCA[marcaVehiculo]
    ? [...MODELOS_POR_MARCA[marcaVehiculo], 'Otro']
    : [...TODOS_LOS_MODELOS, 'Otro'];
  
  // Cargar productos al iniciar
  useEffect(() => {
    const productosData = obtenerProductos();
    setProductos(productosData);
  }, []);
  
  useEffect(() => {
    if (marcaVehiculo && modeloVehiculo) {
      const modelosValidos = MODELOS_POR_MARCA[marcaVehiculo] || [];
      if (!modelosValidos.includes(modeloVehiculo)) {
        setModeloVehiculo('');
      }
    }
  }, [marcaVehiculo]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Al retroceder desde sistemaInventario, ir al login con fromLogout=true
      router.replace('/(auth)/login?fromLogout=true' as any);
      return true;
    });
    return () => backHandler.remove();
  }, [router]);

  const handleSignOut = () => {
    logout();
    router.replace('/(auth)/login?fromLogout=true' as any);
  };

  const handleIngresarProducto = () => {
    setShowRegistrarProducto(true);
  };
  
  const handleCodigoSKU = (text: string) => {
    const filtered = text.replace(/[^a-zA-Z0-9]/g, '');
    setCodigoSKU(filtered.toUpperCase());
  };
  
  const handleAnoDesde = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, '').slice(0, 4);
    setAnoDesde(filtered);
  };
  
  const handleAnoHasta = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, '').slice(0, 4);
    setAnoHasta(filtered);
  };
  
  const handlePrecioMin = (text: string) => {
    const { display, raw } = manejarCambioPrecioEstadounidense(text);
    setPrecioMinDisplay(display);
    setPrecioMin(raw);
  };
  
  const handlePrecioMax = (text: string) => {
    const { display, raw } = manejarCambioPrecioEstadounidense(text);
    setPrecioMaxDisplay(display);
    setPrecioMax(raw);
  };
  
  const cerrarTodosLosDropdowns = () => {
    setShowMarcaComponenteDropdown(false);
    setShowMarcaVehiculoDropdown(false);
    setShowModeloVehiculoDropdown(false);
    setShowEstadoStockDropdown(false);
    setShowEstadoProductoDropdown(false);
  };

  // Funciones de manejo de modales
  const handleVerDetalles = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setShowVisualizarProducto(true);
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setShowEditarProducto(true);
  };

  const handleEliminarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setShowConfirmarEliminacion(true);
  };

  const handleConfirmarEliminacion = () => {
    if (!productoSeleccionado) return;
    
    setProductoEliminado({ nombre: productoSeleccionado.nombre });
    setProductos(prev => prev.filter(p => p.id !== productoSeleccionado.id));
    setShowConfirmarEliminacion(false);
    setShowEliminacionExitosa(true);
  };

  const handleToggleActivo = (producto: Producto) => {
    setProductos(prev => 
      prev.map(p => p.id === producto.id ? { ...p, activo: !p.activo } : p)
    );
  };

  const handleRegistroExitoso = (nuevoProducto: any) => {
    const producto: Producto = {
      id: `prod-${Date.now()}`,
      ...nuevoProducto,
      activo: true,
      createdAt: new Date().toISOString()
    };
    setProductos(prev => [producto, ...prev]);
  };

  const handleEdicionExitosa = (productoActualizado: any) => {
    setProductos(prev => 
      prev.map(p => p.id === productoActualizado.id ? { ...p, ...productoActualizado } : p)
    );
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    // Filtro por búsqueda global (nombre, SKU, marca componente, categoría, OEM, marca vehículo, modelo vehículo)
    if (busquedaNombre) {
      const busqueda = busquedaNombre.toLowerCase();
      const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
      const coincideSKU = producto.codigoSKU.toLowerCase().includes(busqueda);
      const coincideMarcaComponente = producto.marcaComponente.toLowerCase().includes(busqueda);
      const coincideCategoria = producto.categoria.toLowerCase().includes(busqueda);
      const coincideOEM = producto.numeroParteOEM?.toLowerCase().includes(busqueda) || false;
      const coincideMarcaVehiculo = producto.compatibilidades.some(c => 
        c.marca.toLowerCase().includes(busqueda)
      );
      const coincideModeloVehiculo = producto.compatibilidades.some(c => 
        c.modelo.toLowerCase().includes(busqueda)
      );
      
      // Si no coincide con ningún criterio, filtrar
      if (!coincideNombre && !coincideSKU && !coincideMarcaComponente && 
          !coincideCategoria && !coincideOEM && !coincideMarcaVehiculo && 
          !coincideModeloVehiculo) {
        return false;
      }
    }
    
    // Filtro por código SKU
    if (codigoSKU && !producto.codigoSKU.toUpperCase().includes(codigoSKU.toUpperCase())) {
      return false;
    }
    
    // Filtro por marca de componente
    if (marcaComponente && producto.marcaComponente !== marcaComponente) {
      return false;
    }
    
    // Filtro por marca de vehículo
    if (marcaVehiculo) {
      const tieneCompatibilidad = producto.compatibilidades.some(c => c.marca === marcaVehiculo);
      if (!tieneCompatibilidad) return false;
    }
    
    // Filtro por modelo de vehículo
    if (modeloVehiculo) {
      const tieneCompatibilidad = producto.compatibilidades.some(c => c.modelo === modeloVehiculo);
      if (!tieneCompatibilidad) return false;
    }
    
    // Filtro por año
    if (anoDesde || anoHasta) {
      const tieneCompatibilidad = producto.compatibilidades.some(c => {
        const desde = parseInt(c.anoDesde);
        const hasta = parseInt(c.anoHasta);
        const filtroDesde = anoDesde ? parseInt(anoDesde) : 0;
        const filtroHasta = anoHasta ? parseInt(anoHasta) : 9999;
        
        return (desde <= filtroHasta && hasta >= filtroDesde);
      });
      if (!tieneCompatibilidad) return false;
    }
    
    // Filtro por estado de stock
    if (estadoStock !== 'Todos') {
      const estado = producto.stockActual <= producto.stockCritico ? 'Crítico' :
                     producto.stockActual <= producto.stockMinimo ? 'Bajo' : 'Disponible';
      if (estado !== estadoStock) return false;
    }

    // Filtro por estado del producto
    if (estadoProducto === 'Producto activo' && !producto.activo) {
      return false;
    }
    if (estadoProducto === 'Producto inactivo' && producto.activo) {
      return false;
    }
    
    // Filtro por precio (validar que mínimo < máximo)
    if (precioMin && precioMax) {
      const min = parseFloat(precioMin);
      const max = parseFloat(precioMax);
      
      // Si mínimo es mayor que máximo, no mostrar resultados
      if (min > max) {
        return false;
      }
      
      // Filtrar por rango válido
      if (producto.precioVenta < min || producto.precioVenta > max) {
        return false;
      }
    } else {
      // Solo un valor definido
      if (precioMin && producto.precioVenta < parseFloat(precioMin)) {
        return false;
      }
      if (precioMax && producto.precioVenta > parseFloat(precioMax)) {
        return false;
      }
    }
    
    return true;
  });

  // Calcular totales
  const totalProductos = productos.length;
  const stockDisponible = productos.filter(p => p.stockActual > p.stockMinimo).length;
  const stockBajo = productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > p.stockCritico).length;
  const stockCritico = productos.filter(p => p.stockActual <= p.stockCritico).length;
  const productosActivados = productos.filter(p => p.activo).length;
  const productosDesactivados = productos.filter(p => !p.activo).length;

  // Función para obtener estado de stock
  const getEstadoStock = (producto: Producto): { text: string; color: string } => {
    if (producto.stockActual <= producto.stockCritico) {
      return { text: '● Crítico', color: '#EF4444' };
    } else if (producto.stockActual <= producto.stockMinimo) {
      return { text: '● Bajo', color: '#F59E0B' };
    } else {
      return { text: '● Disponible', color: '#10B981' };
    }
  };

  return (
    <ResponsiveContainer>
      <View style={styles.page}>
        <NavbarInventario onSignOut={handleSignOut} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={cerrarTodosLosDropdowns}>
            <Text style={styles.screenTitle}>GESTIÓN DE INVENTARIO</Text>
            <Text style={styles.screenSubtitle}>Administra y registra componentes vehiculares para el mantenimiento de vehículos</Text>
          </Pressable>
          
          <Pressable 
            onPress={handleIngresarProducto} 
            style={({ pressed }) => [
              styles.ingresarBtn,
              pressed && styles.ingresarBtnPressed
            ]}
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome 
                  name="plus-circle" 
                  size={18} 
                  color={pressed ? '#FFFFFF' : '#000000'}
                />
                <View style={{ width: 10 }} />
                <Text style={[styles.ingresarBtnText, pressed && styles.ingresarBtnTextPressed]}>
                  INGRESAR PRODUCTO
                </Text>
              </View>
            )}
          </Pressable>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Buscar Producto</Text>
            <View style={styles.searchBox}>
              <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
              <TextInput
                placeholder="Busca el producto deseado"
                placeholderTextColor="#94A3B8"
                value={busquedaNombre}
                onChangeText={(text) => {
                  // Permitir letras, números, espacios y guiones (no caracteres especiales)
                  const textoFiltrado = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g, '');
                  setBusquedaNombre(textoFiltrado);
                }}
                style={styles.searchInput}
              />
            </View>
            
            <Text style={styles.filterLabel}>Código / SKU</Text>
            <TextInput
              placeholder="Ej: BOS12345"
              placeholderTextColor="#64748B"
              value={codigoSKU}
              onChangeText={handleCodigoSKU}
              style={styles.textInput}
              maxLength={20}
            />
            
            <Text style={styles.filterLabel}>Marca de Componente/Repuesto</Text>
            <Pressable 
              style={styles.filterDropdown}
              onPress={() => {
                cerrarTodosLosDropdowns();
                setShowMarcaComponenteDropdown(!showMarcaComponenteDropdown);
              }}
            >
              <Text style={styles.filterDropdownText}>
                {marcaComponente || 'Todas las marcas'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </Pressable>
            {showMarcaComponenteDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                <Pressable
                  style={[styles.dropdownItem, !marcaComponente && styles.dropdownItemActive]}
                  onPress={() => {
                    setMarcaComponente('');
                    setMarcaComponenteOtra('');
                    setShowMarcaComponenteDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!marcaComponente ? '✓' : ' '}</Text>
                  <Text style={styles.dropdownItemText}>Todas las marcas</Text>
                </Pressable>
                {MARCAS_COMPONENTES.map((marca) => (
                  <Pressable
                    key={marca}
                    style={[styles.dropdownItem, marcaComponente === marca && styles.dropdownItemActive]}
                    onPress={() => {
                      setMarcaComponente(marca);
                      if (marca !== 'Otro') {
                        setMarcaComponenteOtra('');
                      }
                      setShowMarcaComponenteDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>{marcaComponente === marca ? '✓' : ' '}</Text>
                    <Text style={styles.dropdownItemText}>{marca}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {marcaComponente === 'Otro' && (
              <>
                <Text style={styles.filterLabel}>Especifica la marca</Text>
                <TextInput
                  placeholder="Escribe la marca..."
                  placeholderTextColor="#64748B"
                  value={marcaComponenteOtra}
                  onChangeText={(text) => {
                    const textoLimpio = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    setMarcaComponenteOtra(textoLimpio);
                  }}
                  style={styles.textInput}
                />
              </>
            )}
            
            {/* Fila responsive: Marca de Vehículo y Modelo de Vehículo */}
            <View style={[
              Platform.OS === 'web' && !isSmallScreen && styles.filterRowContainer
            ]}>
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Marca de Vehículo</Text>
                <Pressable 
                  style={styles.filterDropdown}
                  onPress={() => {
                    cerrarTodosLosDropdowns();
                    setShowMarcaVehiculoDropdown(!showMarcaVehiculoDropdown);
                  }}
                >
                  <Text style={styles.filterDropdownText}>
                    {marcaVehiculo || 'Todas las marcas'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </Pressable>
                {showMarcaVehiculoDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                    <Pressable
                      style={[styles.dropdownItem, !marcaVehiculo && styles.dropdownItemActive]}
                      onPress={() => {
                        setMarcaVehiculo('');
                        setMarcaVehiculoOtra('');
                        setShowMarcaVehiculoDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemCheck}>{!marcaVehiculo ? '✓' : ' '}</Text>
                      <Text style={styles.dropdownItemText}>Todas las marcas</Text>
                    </Pressable>
                    {MARCAS_VEHICULOS.map((marca) => (
                      <Pressable
                        key={marca}
                        style={[styles.dropdownItem, marcaVehiculo === marca && styles.dropdownItemActive]}
                        onPress={() => {
                          setMarcaVehiculo(marca);
                          if (marca !== 'Otro') {
                            setMarcaVehiculoOtra('');
                          }
                          setShowMarcaVehiculoDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemCheck}>{marcaVehiculo === marca ? '✓' : ' '}</Text>
                        <Text style={styles.dropdownItemText}>{marca}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                {marcaVehiculo === 'Otro' && (
                  <>
                    <Text style={styles.filterLabel}>Especifica la marca del vehículo</Text>
                    <TextInput
                      placeholder="Escribe la marca del vehículo..."
                      placeholderTextColor="#64748B"
                      value={marcaVehiculoOtra}
                      onChangeText={(text) => {
                        const textoLimpio = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                        setMarcaVehiculoOtra(textoLimpio);
                      }}
                      style={styles.textInput}
                    />
                  </>
                )}
              </View>
              
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Modelo de Vehículo</Text>
                <Pressable 
                  style={styles.filterDropdown}
                  onPress={() => {
                    cerrarTodosLosDropdowns();
                    setShowModeloVehiculoDropdown(!showModeloVehiculoDropdown);
                  }}
                >
                  <Text style={styles.filterDropdownText}>
                    {modeloVehiculo || 'Todos los modelos'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </Pressable>
                {showModeloVehiculoDropdown && (
                  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                <Pressable
                  style={[styles.dropdownItem, !modeloVehiculo && styles.dropdownItemActive]}
                  onPress={() => {
                    setModeloVehiculo('');
                    setModeloVehiculoOtro('');
                    setShowModeloVehiculoDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemCheck}>{!modeloVehiculo ? '✓' : ' '}</Text>
                  <Text style={styles.dropdownItemText}>Todos los modelos</Text>
                </Pressable>
                {modelosDisponibles.map((modelo) => (
                  <Pressable
                    key={modelo}
                    style={[styles.dropdownItem, modeloVehiculo === modelo && styles.dropdownItemActive]}
                    onPress={() => {
                      setModeloVehiculo(modelo);
                      if (modelo !== 'Otro') {
                        setModeloVehiculoOtro('');
                      }
                      setShowModeloVehiculoDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemCheck}>{modeloVehiculo === modelo ? '✓' : ' '}</Text>
                    <Text style={styles.dropdownItemText}>{modelo}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {modeloVehiculo === 'Otro' && (
              <>
                <Text style={styles.filterLabel}>Especifica el modelo del vehículo</Text>
                <TextInput
                  placeholder="Escribe el modelo del vehículo..."
                  placeholderTextColor="#64748B"
                  value={modeloVehiculoOtro}
                  onChangeText={(text) => {
                    const textoLimpio = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g, '');
                    setModeloVehiculoOtro(textoLimpio);
                  }}
                  style={styles.textInput}
                />
              </>
            )}
              </View>
            </View>
            
            <Text style={styles.filterLabel}>Año del Vehículo</Text>
            <View style={styles.filterRow}>
              <View style={styles.filterHalf}>
                <TextInput
                  placeholder="Desde"
                  placeholderTextColor="#64748B"
                  value={anoDesde}
                  onChangeText={handleAnoDesde}
                  keyboardType="numeric"
                  maxLength={4}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.filterHalf}>
                <TextInput
                  placeholder="Hasta"
                  placeholderTextColor="#64748B"
                  value={anoHasta}
                  onChangeText={handleAnoHasta}
                  keyboardType="numeric"
                  maxLength={4}
                  style={styles.textInput}
                />
              </View>
            </View>
            
            {/* Fila responsive: Estado de Stock y Estado del Producto */}
            <View style={[
              Platform.OS === 'web' && !isSmallScreen && styles.filterRowContainer
            ]}>
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Estado de Stock</Text>
                <Pressable 
                  style={styles.filterDropdown}
                  onPress={() => {
                    cerrarTodosLosDropdowns();
                    setShowEstadoStockDropdown(!showEstadoStockDropdown);
                  }}
                >
                  <Text style={styles.filterDropdownText}>{estadoStock}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </Pressable>
                {showEstadoStockDropdown && (
                  <View style={styles.dropdownList}>
                    {['Todos', 'Disponible', 'Bajo', 'Crítico'].map((estado) => (
                      <Pressable
                        key={estado}
                        style={[styles.dropdownItem, estadoStock === estado && styles.dropdownItemActive]}
                        onPress={() => {
                          setEstadoStock(estado);
                          setShowEstadoStockDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemCheck}>{estadoStock === estado ? '✓' : ' '}</Text>
                        <Text style={styles.dropdownItemText}>{estado}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Estado del Producto</Text>
                <Pressable
                  style={styles.filterDropdown}
                  onPress={() => {
                    cerrarTodosLosDropdowns();
                    setShowEstadoProductoDropdown(!showEstadoProductoDropdown);
                  }}
                >
                  <Text style={styles.filterDropdownText}>{estadoProducto}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </Pressable>
                {showEstadoProductoDropdown && (
                  <View style={styles.dropdownList}>
                    {['Todos', 'Producto activo', 'Producto inactivo'].map((estado) => (
                      <Pressable
                        key={estado}
                        style={[styles.dropdownItem, estadoProducto === estado && styles.dropdownItemActive]}
                        onPress={() => {
                          setEstadoProducto(estado);
                          setShowEstadoProductoDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemCheck}>{estadoProducto === estado ? '✓' : ' '}</Text>
                        <Text style={styles.dropdownItemText}>{estado}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
            
            {/* Fila responsive: Precio Mínimo y Precio Máximo */}
            <View style={[
              Platform.OS === 'web' && !isSmallScreen && styles.filterRowContainer
            ]}>
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Precio Mínimo</Text>
                <TextInput
                  placeholder="Ej: 10.50"
                  placeholderTextColor="#64748B"
                  value={precioMinDisplay !== '' ? precioMinDisplay : (precioMin ? precioMin : '')}
                  onChangeText={handlePrecioMin}
                  keyboardType="decimal-pad"
                  style={styles.textInput}
                />
              </View>
            
              <View style={[
                Platform.OS === 'web' && !isSmallScreen && styles.filterColumn
              ]}>
                <Text style={styles.filterLabel}>Precio Máximo</Text>
                <TextInput
                  placeholder="Ej: 100.00"
                  placeholderTextColor="#64748B"
                  value={precioMaxDisplay !== '' ? precioMaxDisplay : (precioMax ? precioMax : '')}
                  onChangeText={handlePrecioMax}
                  keyboardType="decimal-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Stock Disponible</Text>
              <Text style={styles.summaryNumber}>{stockDisponible}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Stock Bajo</Text>
              <Text style={styles.summaryNumber}>{stockBajo}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Stock Crítico</Text>
              <Text style={styles.summaryNumber}>{stockCritico}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Productos</Text>
              <Text style={styles.summaryNumber}>{totalProductos}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Productos Activados</Text>
              <Text style={styles.summaryNumber}>{productosActivados}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Productos Desactivados</Text>
              <Text style={styles.summaryNumber}>{productosDesactivados}</Text>
            </View>
          </View>

          {productosFiltrados.length === 0 ? (
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          ) : (
            <View style={[
              styles.productosContainer,
              Platform.OS === 'web' && !isSmallScreen && { flexDirection: 'row', flexWrap: 'wrap' }
            ]}>
              {productosFiltrados.map((producto) => {
                const ewstadoStock = getEstadoStock(producto);
                const compatibilidadesExtra = producto.compatibilidades.length > 1 
                  ? producto.compatibilidades.length - 1 
                  : 0;
                
                return (
                  <View 
                    key={producto.id} 
                    style={[
                      styles.productCard,
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
                    <View style={styles.productContent}>
                      {/* Nombre del producto */}
                      <Text style={styles.productName} numberOfLines={2}>
                        {producto.nombre}
                      </Text>

                      {/* SKU */}
                      <Text style={styles.productMeta}>
                        SKU: {producto.codigoSKU}
                      </Text>

                      {/* Marca */}
                      <Text style={styles.productMeta}>
                        {producto.marcaComponente}
                      </Text>

                      {/* Categoría */}
                      <Text style={styles.productMeta}>
                        {producto.categoria}
                      </Text>

                      {/* Separador */}
                      <View style={styles.separator} />

                      {/* Compatibilidad */}
                      <Text style={styles.sectionTitle}>COMPATIBILIDAD</Text>
                      {producto.compatibilidades.length > 0 && (
                        <>
                          <Text style={styles.productCompatibility}>
                            {producto.compatibilidades[0].modelo}
                          </Text>
                          <Text style={styles.productYears}>
                            {producto.compatibilidades[0].anoDesde} - {producto.compatibilidades[0].anoHasta}
                          </Text>
                          {compatibilidadesExtra > 0 && (
                            <Text style={styles.productExtra}>
                              + {compatibilidadesExtra} vehículo{compatibilidadesExtra > 1 ? 's' : ''} más
                            </Text>
                          )}
                        </>
                      )}

                      {/* Separador */}
                      <View style={styles.separator} />

                      {/* Stock */}
                      <Text style={styles.sectionTitle}>STOCK</Text>
                      <View style={styles.stockRow}>
                        <Text style={styles.stockText}>
                          {formatearNumeroConPuntos(producto.stockActual)} unidades
                        </Text>
                        <Text style={[styles.stockBadge, { color: estadoStock.color }]}>
                          {estadoStock.text}
                        </Text>
                      </View>

                      {/* Precio */}
                      <Text style={styles.precioLabel}>Precio de venta</Text>
                      <Text style={styles.precioText}>
                        ${formatearPrecioEspanol(producto.precioVenta)}
                      </Text>

                      {/* Botones verticales: uno abajo del otro */}
                      <Pressable
                        onPress={() => handleVerDetalles(producto)}
                        style={({ pressed }) => [
                          styles.btnPrimario,
                          pressed && styles.btnPrimarioPressed
                        ]}
                      >
                        {({ pressed }) => (
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome 
                              name="eye" 
                              size={16} 
                              color={pressed ? '#FFFFFF' : '#000000'}
                            />
                            <View style={{ width: 8 }} />
                            <Text style={[styles.btnPrimarioText, pressed && styles.btnPrimarioTextPressed]}>
                              DETALLES
                            </Text>
                          </View>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={() => handleEditarProducto(producto)}
                        style={({ pressed }) => [
                          styles.btnSecundario,
                          styles.btnEdit,
                          pressed && styles.btnEditPressed
                        ]}
                      >
                        {({ pressed }) => (
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome 
                              name="edit" 
                              size={14} 
                              color={pressed ? '#F1F5F9' : '#FFFFFF'}
                            />
                            <View style={{ width: 8 }} />
                            <Text style={[styles.btnSecundarioText, pressed && styles.btnSecundarioTextPressed]}>
                              EDITAR
                            </Text>
                          </View>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={() => handleEliminarProducto(producto)}
                        style={({ pressed }) => [
                          styles.btnSecundario,
                          styles.btnDelete,
                          pressed && styles.btnDeletePressed
                        ]}
                      >
                        {({ pressed }) => (
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome 
                              name="trash" 
                              size={14} 
                              color={pressed ? '#F1F5F9' : '#FFFFFF'}
                            />
                            <View style={{ width: 8 }} />
                            <Text style={[styles.btnSecundarioText, pressed && styles.btnSecundarioTextPressed]}>
                              ELIMINAR
                            </Text>
                          </View>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={() => handleToggleActivo(producto)}
                        style={({ pressed }) => [
                          styles.btnSecundario,
                          producto.activo ? styles.btnToggleOn : styles.btnToggleOff,
                          pressed && (producto.activo ? styles.btnToggleOnPressed : styles.btnToggleOffPressed)
                        ]}
                      >
                        {({ pressed }) => (
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome 
                              name={producto.activo ? 'ban' : 'check-circle'} 
                              size={14} 
                              color={pressed ? '#F1F5F9' : '#FFFFFF'}
                            />
                            <View style={{ width: 8 }} />
                            <Text style={[styles.btnSecundarioText, pressed && styles.btnSecundarioTextPressed]}>
                              {producto.activo ? 'DESACTIVAR' : 'ACTIVAR'}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        
        {/* Modales */}
        <RegistrarProducto
          visible={showRegistrarProducto}
          onClose={() => setShowRegistrarProducto(false)}
          onSuccess={handleRegistroExitoso}
        />
        
        {productoSeleccionado && (
          <>
            <VisualizarProducto
              visible={showVisualizarProducto}
              onClose={() => {
                setShowVisualizarProducto(false);
                setProductoSeleccionado(null);
              }}
              producto={productoSeleccionado}
            />
            
            <EditarProducto
              visible={showEditarProducto}
              onClose={() => {
                setShowEditarProducto(false);
                setProductoSeleccionado(null);
              }}
              producto={productoSeleccionado}
              onGuardar={handleEdicionExitosa}
            />
          </>
        )}
        
        <ConfirmarEliminacion
          visible={showConfirmarEliminacion}
          producto={productoSeleccionado}
          onClose={() => {
            setShowConfirmarEliminacion(false);
            setProductoSeleccionado(null);
          }}
          onConfirmar={handleConfirmarEliminacion}
        />
        
        {productoEliminado && (
          <EliminacionExitosa
            visible={showEliminacionExitosa}
            onClose={() => {
              setShowEliminacionExitosa(false);
              setProductoEliminado(null);
            }}
            nombreProducto={productoEliminado.nombre}
          />
        )}
      </View>
    </ResponsiveContainer>
  );
}
