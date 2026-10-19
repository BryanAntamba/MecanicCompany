const fs = require('fs');
const path = require('path');

// Primero, agregar datos simulados de productos al archivo datosSimulados.ts
const datosSimuladosPath = path.join(__dirname, 'utils', 'datosSimulados.ts');
let datosSimulados = fs.readFileSync(datosSimuladosPath, 'utf8');

// Agregar interface y datos de productos al final del archivo
const productosData = `
// ============================================
// DATOS SIMULADOS DE PRODUCTOS (INVENTARIO)
// ============================================

export interface Producto {
  id: string;
  nombre: string;
  codigoSKU: string;
  marcaComponente: string;
  categoria: string;
  numeroParteOEM?: string;
  descripcion?: string;
  stockActual: number;
  stockMinimo: number;
  stockCritico: number;
  precioCompra: number;
  precioVenta: number;
  compatibilidades: Array<{
    id: string;
    marca: string;
    modelo: string;
    anoDesde: string;
    anoHasta: string;
  }>;
  ubicacionInventario?: string;
  unidadMedida: string;
  activo: boolean;
  createdAt: string;
}

const productosSimulados: Producto[] = [
  {
    id: 'prod-1',
    nombre: 'FILTRO DE ACEITE',
    codigoSKU: 'FIL001',
    marcaComponente: 'Bosch',
    categoria: 'Filtros',
    numeroParteOEM: 'BO0451103033',
    descripcion: 'Filtro de aceite de alta eficiencia para motores de gasolina',
    stockActual: 24,
    stockMinimo: 10,
    stockCritico: 5,
    precioCompra: 8.50,
    precioVenta: 12.50,
    compatibilidades: [
      { id: 'c1', marca: 'Toyota', modelo: 'Toyota Corolla', anoDesde: '2018', anoHasta: '2023' },
      { id: 'c2', marca: 'Honda', modelo: 'Honda Civic', anoDesde: '2019', anoHasta: '2024' },
      { id: 'c3', marca: 'Mazda', modelo: 'Mazda Mazda3', anoDesde: '2020', anoHasta: '2024' }
    ],
    ubicacionInventario: 'Estante A3-B12',
    unidadMedida: 'Unidad',
    activo: true,
    createdAt: new Date(2024, 0, 15).toISOString()
  },
  {
    id: 'prod-2',
    nombre: 'PASTILLAS DE FRENO DELANTERAS',
    codigoSKU: 'BRE045',
    marcaComponente: 'Brembo',
    categoria: 'Frenos',
    numeroParteOEM: 'BRE0986AB1234',
    descripcion: 'Pastillas de freno cerámicas de alto rendimiento',
    stockActual: 6,
    stockMinimo: 8,
    stockCritico: 3,
    precioCompra: 35.00,
    precioVenta: 55.00,
    compatibilidades: [
      { id: 'c4', marca: 'Chevrolet', modelo: 'Chevrolet Cruze', anoDesde: '2016', anoHasta: '2022' },
      { id: 'c5', marca: 'Kia', modelo: 'Kia Rio', anoDesde: '2020', anoHasta: '2024' }
    ],
    ubicacionInventario: 'Estante B2-C05',
    unidadMedida: 'Juego',
    activo: true,
    createdAt: new Date(2024, 1, 10).toISOString()
  },
  {
    id: 'prod-3',
    nombre: 'BUJÍAS DE ENCENDIDO',
    codigoSKU: 'NGK567',
    marcaComponente: 'NGK',
    categoria: 'Encendido',
    numeroParteOEM: 'NGK4644',
    descripcion: 'Bujías de platino de larga duración',
    stockActual: 2,
    stockMinimo: 12,
    stockCritico: 4,
    precioCompra: 6.00,
    precioVenta: 10.00,
    compatibilidades: [
      { id: 'c6', marca: 'Nissan', modelo: 'Nissan Versa', anoDesde: '2015', anoHasta: '2023' },
      { id: 'c7', marca: 'Renault', modelo: 'Renault Logan', anoDesde: '2016', anoHasta: '2024' },
      { id: 'c8', marca: 'Ford', modelo: 'Ford Fiesta', anoDesde: '2014', anoHasta: '2019' }
    ],
    ubicacionInventario: 'Estante C1-D07',
    unidadMedida: 'Juego',
    activo: true,
    createdAt: new Date(2024, 2, 5).toISOString()
  },
  {
    id: 'prod-4',
    nombre: 'ACEITE MOTOR SINTÉTICO 5W-30',
    codigoSKU: 'MOB789',
    marcaComponente: 'Pennzoil',
    categoria: 'Lubricantes',
    numeroParteOEM: 'PZ550046126',
    descripcion: 'Aceite sintético de alta calidad para todo tipo de motores',
    stockActual: 45,
    stockMinimo: 20,
    stockCritico: 10,
    precioCompra: 18.00,
    precioVenta: 28.00,
    compatibilidades: [
      { id: 'c9', marca: 'Toyota', modelo: 'Toyota Hilux', anoDesde: '2010', anoHasta: '2024' },
      { id: 'c10', marca: 'Ford', modelo: 'Ford Ranger', anoDesde: '2012', anoHasta: '2024' },
      { id: 'c11', marca: 'Chevrolet', modelo: 'Chevrolet Colorado', anoDesde: '2015', anoHasta: '2024' },
      { id: 'c12', marca: 'Nissan', modelo: 'Nissan Frontier', anoDesde: '2014', anoHasta: '2023' }
    ],
    ubicacionInventario: 'Bodega principal - Sección L',
    unidadMedida: 'Galón',
    activo: true,
    createdAt: new Date(2024, 3, 20).toISOString()
  },
  {
    id: 'prod-5',
    nombre: 'AMORTIGUADORES TRASEROS',
    codigoSKU: 'KYB234',
    marcaComponente: 'KYB',
    categoria: 'Suspensión',
    numeroParteOEM: 'KYB343423',
    descripcion: 'Amortiguadores de gas de alto rendimiento',
    stockActual: 12,
    stockMinimo: 6,
    stockCritico: 2,
    precioCompra: 45.00,
    precioVenta: 75.00,
    compatibilidades: [
      { id: 'c13', marca: 'Hyundai', modelo: 'Hyundai Accent', anoDesde: '2017', anoHasta: '2023' },
      { id: 'c14', marca: 'Kia', modelo: 'Kia Rio', anoDesde: '2018', anoHasta: '2023' }
    ],
    ubicacionInventario: 'Estante D3-E15',
    unidadMedida: 'Par',
    activo: true,
    createdAt: new Date(2024, 4, 12).toISOString()
  },
  {
    id: 'prod-6',
    nombre: 'CORREA DE DISTRIBUCIÓN',
    codigoSKU: 'GAT901',
    marcaComponente: 'Gates',
    categoria: 'Correas',
    numeroParteOEM: 'GAT5670XS',
    descripcion: 'Correa de distribución reforzada con fibra de vidrio',
    stockActual: 8,
    stockMinimo: 5,
    stockCritico: 2,
    precioCompra: 22.00,
    precioVenta: 38.00,
    compatibilidades: [
      { id: 'c15', marca: 'Volkswagen', modelo: 'Volkswagen Jetta', anoDesde: '2015', anoHasta: '2022' }
    ],
    ubicacionInventario: 'Estante E1-F08',
    unidadMedida: 'Kit',
    activo: true,
    createdAt: new Date(2024, 5, 8).toISOString()
  }
];

export function obtenerProductos(): Producto[] {
  return productosSimulados;
}

export function obtenerProductoPorId(id: string): Producto | undefined {
  return productosSimulados.find(p => p.id === id);
}
`;

// Agregar al final del archivo (antes del último cierre de exportación si existe)
if (!datosSimulados.includes('export interface Producto')) {
  fs.writeFileSync(datosSimuladosPath, datosSimulados + productosData);
  console.log('✅ Datos de productos agregados a datosSimulados.ts');
} else {
  console.log('⚠️  Los datos de productos ya existen en datosSimulados.ts');
}

console.log('Script completado - datos de productos listos');
