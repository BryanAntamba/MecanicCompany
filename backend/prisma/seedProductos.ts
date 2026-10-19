// Seed de productos de inventario con datos completos
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga de productos...');

  // Limpiar productos existentes
  await prisma.compatibilidadProducto.deleteMany({});
  await prisma.producto.deleteMany({});

  const productos = [
    // Filtros de aire
    {
      nombreProducto: 'Filtro de Aire Corolla',
      codigoSKU: 'FILT-AIR-001',
      marcaComponente: 'Mann-Filter',
      categoria: 'Filtros',
      numeroParteOEM: 'MA-1234',
      descripcion: 'Filtro de aire OEM para motor de 1.6L',
      stockActual: 45,
      stockMinimo: 10,
      stockCritico: 5,
      precioCompra: 8.50,
      precioVenta: 15.99,
      ubicacion: 'Estante A-01',
      unidadMedida: 'Unidad',
    },
    {
      nombreProducto: 'Filtro de Aire Civic',
      codigoSKU: 'FILT-AIR-002',
      marcaComponente: 'Wix',
      categoria: 'Filtros',
      numeroParteOEM: 'WIX-5045',
      descripcion: 'Filtro de aire de alto rendimiento',
      stockActual: 32,
      stockMinimo: 10,
      stockCritico: 5,
      precioCompra: 9.75,
      precioVenta: 17.99,
      ubicacion: 'Estante A-02',
      unidadMedida: 'Unidad',
    },
    // Filtros de aceite
    {
      nombreProducto: 'Filtro de Aceite Silverado',
      codigoSKU: 'FILT-OIL-001',
      marcaComponente: 'Fram',
      categoria: 'Filtros',
      numeroParteOEM: 'FRAM-12345',
      descripcion: 'Filtro de aceite para camiones grandes',
      stockActual: 28,
      stockMinimo: 8,
      stockCritico: 3,
      precioCompra: 6.50,
      precioVenta: 11.99,
      ubicacion: 'Estante A-03',
      unidadMedida: 'Unidad',
    },
    // Pastillas de freno
    {
      nombreProducto: 'Pastillas de Freno Brembo Cruze',
      codigoSKU: 'BRAKE-PAD-001',
      marcaComponente: 'Brembo',
      categoria: 'Frenos',
      numeroParteOEM: 'BREMBO-09876',
      descripcion: 'Juego completo pastillas de freno delanteras',
      stockActual: 15,
      stockMinimo: 5,
      stockCritico: 2,
      precioCompra: 45.00,
      precioVenta: 89.99,
      ubicacion: 'Estante B-01',
      unidadMedida: 'Juego',
    },
    {
      nombreProducto: 'Pastillas de Freno Traseras RAV4',
      codigoSKU: 'BRAKE-PAD-002',
      marcaComponente: 'Wagner',
      categoria: 'Frenos',
      numeroParteOEM: 'WAGNER-4567',
      descripcion: 'Pastillas de freno traseras de cerámica',
      stockActual: 22,
      stockMinimo: 6,
      stockCritico: 3,
      precioCompra: 38.00,
      precioVenta: 72.99,
      ubicacion: 'Estante B-02',
      unidadMedida: 'Juego',
    },
    // Discos de freno
    {
      nombreProducto: 'Disco de Freno Delantero Focus',
      codigoSKU: 'BRAKE-DISC-001',
      marcaComponente: 'Brembo',
      categoria: 'Frenos',
      numeroParteOEM: 'BREMBO-DISC-1',
      descripcion: 'Disco de freno ventilado resistente',
      stockActual: 18,
      stockMinimo: 5,
      stockCritico: 2,
      precioCompra: 52.00,
      precioVenta: 99.99,
      ubicacion: 'Estante B-03',
      unidadMedida: 'Unidad',
    },
    // Aceites
    {
      nombreProducto: 'Aceite Motriz 5W30 Sintético',
      codigoSKU: 'OIL-SYN-5W30',
      marcaComponente: 'Pennzoil',
      categoria: 'Aceites',
      numeroParteOEM: 'PENNZ-550023',
      descripcion: 'Aceite motor sintético 5W-30, 5 litros',
      stockActual: 62,
      stockMinimo: 15,
      stockCritico: 8,
      precioCompra: 28.50,
      precioVenta: 52.99,
      ubicacion: 'Estante C-01',
      unidadMedida: 'Garrafa 5L',
    },
    {
      nombreProducto: 'Aceite Transmisión ATF',
      codigoSKU: 'OIL-ATF-001',
      marcaComponente: 'Dexron',
      categoria: 'Aceites',
      numeroParteOEM: 'DEXRON-VI',
      descripcion: 'Fluido de transmisión automática tipo VI',
      stockActual: 35,
      stockMinimo: 10,
      stockCritico: 5,
      precioCompra: 32.00,
      precioVenta: 59.99,
      ubicacion: 'Estante C-02',
      unidadMedida: 'Garrafa 4L',
    },
    // Correas
    {
      nombreProducto: 'Correa de Distribuidor Hilux',
      codigoSKU: 'BELT-DIST-001',
      marcaComponente: 'Gates',
      categoria: 'Correas y Mangueras',
      numeroParteOEM: 'GATES-24310-28010',
      descripcion: 'Correa de distribución resistente',
      stockActual: 8,
      stockMinimo: 3,
      stockCritico: 1,
      precioCompra: 125.00,
      precioVenta: 229.99,
      ubicacion: 'Estante D-01',
      unidadMedida: 'Unidad',
    },
    // Bujías
    {
      nombreProducto: 'Bujías NGK Iridium',
      codigoSKU: 'SPARK-PLUG-001',
      marcaComponente: 'NGK',
      categoria: 'Encendido',
      numeroParteOEM: 'NGK-IRIDIUM-8',
      descripcion: 'Juego de 4 bujías de iridio',
      stockActual: 54,
      stockMinimo: 12,
      stockCritico: 6,
      precioCompra: 12.00,
      precioVenta: 22.99,
      ubicacion: 'Estante E-01',
      unidadMedida: 'Juego x4',
    },
    // Batería
    {
      nombreProducto: 'Batería AGM 12V 100Ah',
      codigoSKU: 'BATT-AGM-100',
      marcaComponente: 'Optima',
      categoria: 'Eléctrico',
      numeroParteOEM: 'OPTIMA-8002',
      descripcion: 'Batería AGM de alto rendimiento para SUVs',
      stockActual: 12,
      stockMinimo: 3,
      stockCritico: 1,
      precioCompra: 180.00,
      precioVenta: 359.99,
      ubicacion: 'Estante E-02',
      unidadMedida: 'Unidad',
    },
    // Alternador
    {
      nombreProducto: 'Alternador Chevrolet Silverado',
      codigoSKU: 'ALT-CHEV-001',
      marcaComponente: 'Bosch',
      categoria: 'Eléctrico',
      numeroParteOEM: 'BOSCH-AL-220A',
      descripcion: 'Alternador de 220 amperios para camiones',
      stockActual: 6,
      stockMinimo: 2,
      stockCritico: 1,
      precioCompra: 220.00,
      precioVenta: 429.99,
      ubicacion: 'Estante E-03',
      unidadMedida: 'Unidad',
    },
    // Amortiguadores
    {
      nombreProducto: 'Amortiguador Trasero Sentra',
      codigoSKU: 'SHOCK-REAR-001',
      marcaComponente: 'KYB',
      categoria: 'Suspensión',
      numeroParteOEM: 'KYB-333282',
      descripcion: 'Amortiguador trasero de reemplazo',
      stockActual: 9,
      stockMinimo: 2,
      stockCritico: 1,
      precioCompra: 78.00,
      precioVenta: 149.99,
      ubicacion: 'Estante F-01',
      unidadMedida: 'Unidad',
    },
    {
      nombreProducto: 'Amortiguador Delantero Escape',
      codigoSKU: 'SHOCK-FRONT-001',
      marcaComponente: 'Monroe',
      categoria: 'Suspensión',
      numeroParteOEM: 'MONROE-71604',
      descripcion: 'Par amortiguadores delanteros',
      stockActual: 14,
      stockMinimo: 3,
      stockCritico: 1,
      precioCompra: 85.00,
      precioVenta: 165.99,
      ubicacion: 'Estante F-02',
      unidadMedida: 'Par',
    },
    // Piezas pequeñas
    {
      nombreProducto: 'Junta Tórica Válvulas (Surtido)',
      codigoSKU: 'SEAL-O-RING-001',
      marcaComponente: 'Goodyear',
      categoria: 'Sellos y Juntas',
      numeroParteOEM: 'GY-OR-ASSORT',
      descripcion: 'Surtido 50 juntas tóricas varias medidas',
      stockActual: 75,
      stockMinimo: 25,
      stockCritico: 10,
      precioCompra: 15.00,
      precioVenta: 28.99,
      ubicacion: 'Estante G-01',
      unidadMedida: 'Surtido',
    },
    {
      nombreProducto: 'Manguera de Radiador Chevrolet',
      codigoSKU: 'HOSE-RAD-001',
      marcaComponente: 'Dayco',
      categoria: 'Correas y Mangueras',
      numeroParteOEM: 'DAYCO-88160',
      descripcion: 'Manguera superior/inferior radiador',
      stockActual: 24,
      stockMinimo: 6,
      stockCritico: 3,
      precioCompra: 18.50,
      precioVenta: 34.99,
      ubicacion: 'Estante G-02',
      unidadMedida: 'Unidad',
    },
    // Inyectores
    {
      nombreProducto: 'Inyector de Combustible Mazda3',
      codigoSKU: 'INJEC-FUEL-001',
      marcaComponente: 'Delphi',
      categoria: 'Combustible',
      numeroParteOEM: 'DELPHI-FJ1106',
      descripcion: 'Inyector de combustible de reemplazo',
      stockActual: 5,
      stockMinimo: 2,
      stockCritico: 1,
      precioCompra: 95.00,
      precioVenta: 189.99,
      ubicacion: 'Estante H-01',
      unidadMedida: 'Unidad',
    },
  ];

  // Crear productos
  for (const producto of productos) {
    await prisma.producto.create({
      data: producto,
    });
  }

  // Agregar compatibilidades de ejemplo
  const compatibilidades = [
    {
      productoId: '', // Se actualizará después
      marca: 'Toyota',
      modelo: 'Corolla',
      anoDesde: 2015,
      anoHasta: 2024,
    },
    {
      productoId: '',
      marca: 'Toyota',
      modelo: 'RAV4',
      anoDesde: 2013,
      anoHasta: 2023,
    },
    {
      productoId: '',
      marca: 'Honda',
      modelo: 'Civic',
      anoDesde: 2016,
      anoHasta: 2024,
    },
    {
      productoId: '',
      marca: 'Chevrolet',
      modelo: 'Cruze',
      anoDesde: 2010,
      anoHasta: 2019,
    },
  ];

  console.log(`✅ Se crearon ${productos.length} productos con éxito`);
  console.log('📦 Inventario completamente poblado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
