const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de productos...\n');

  // Limpiar datos existentes
  await prisma.compatibilidadProducto.deleteMany();
  await prisma.producto.deleteMany();

  const productos = [
    {
      nombreProducto: 'Alternador 120A',
      codigoSKU: 'ALT-BOSCH-120',
      marcaComponente: 'Bosch',
      categoria: 'Alternadores',
      numeroParteOEM: 'BSC-ALT-120',
      descripcion: 'Alternador de alta potencia para vehículos diésel',
      stockActual: 15,
      stockMinimo: 5,
      stockCritico: 2,
      precioCompra: 8500.00,
      precioVenta: 12500.00,
      ubicacion: 'A-1-1',
      unidadMedida: 'Unidad',
      compatibilidades: {
        create: [
          { marca: 'Chevrolet', modelo: 'D-Max', anoDesde: 2015, anoHasta: 2023 },
          { marca: 'Isuzu', modelo: 'D-Max', anoDesde: 2012, anoHasta: 2020 },
        ]
      }
    },
    {
      nombreProducto: 'Batería 12V 100Ah',
      codigoSKU: 'BAT-MM-100',
      marcaComponente: 'Magneti Marelli',
      categoria: 'Baterías',
      numeroParteOEM: 'MM-BAT-100',
      descripcion: 'Batería de alto rendimiento para arranque en climas fríos',
      stockActual: 25,
      stockMinimo: 10,
      stockCritico: 5,
      precioCompra: 4200.00,
      precioVenta: 6500.00,
      ubicacion: 'B-2-3',
      unidadMedida: 'Unidad',
      compatibilidades: {
        create: [
          { marca: 'Ford', modelo: 'Ranger', anoDesde: 2010, anoHasta: 2022 },
          { marca: 'Toyota', modelo: 'Hilux', anoDesde: 2008, anoHasta: 2023 },
          { marca: 'Nissan', modelo: 'Frontier', anoDesde: 2011, anoHasta: 2021 },
        ]
      }
    },
    {
      nombreProducto: 'Correa de Distribución 133 dientes',
      codigoSKU: 'COR-GATES-133',
      marcaComponente: 'Gates',
      categoria: 'Correas y Cadenas',
      numeroParteOEM: 'GAT-COR-133',
      descripcion: 'Correa de distribución de precisión con acabado de goma nitrílica',
      stockActual: 8,
      stockMinimo: 3,
      stockCritico: 1,
      precioCompra: 3800.00,
      precioVenta: 5800.00,
      ubicacion: 'C-3-2',
      unidadMedida: 'Unidad',
      compatibilidades: {
        create: [
          { marca: 'Chevrolet', modelo: 'Optra', anoDesde: 2004, anoHasta: 2015 },
          { marca: 'Hyundai', modelo: 'Elantra', anoDesde: 2006, anoHasta: 2013 },
        ]
      }
    },
    {
      nombreProducto: 'Bujía de Encendido Iridio',
      codigoSKU: 'BUJ-DENSO-IR',
      marcaComponente: 'Denso',
      categoria: 'Bujías',
      numeroParteOEM: 'DEN-BUJ-IR',
      descripcion: 'Bujía de iridio de larga vida útil para máximo rendimiento',
      stockActual: 120,
      stockMinimo: 30,
      stockCritico: 10,
      precioCompra: 180.00,
      precioVenta: 350.00,
      ubicacion: 'D-1-4',
      unidadMedida: 'Unidad',
      compatibilidades: {
        create: [
          { marca: 'Honda', modelo: 'Civic', anoDesde: 2006, anoHasta: 2023 },
          { marca: 'Toyota', modelo: 'Corolla', anoDesde: 2008, anoHasta: 2023 },
          { marca: 'Mazda', modelo: '3', anoDesde: 2009, anoHasta: 2022 },
        ]
      }
    },
    {
      nombreProducto: 'Correa Auxiliar Multi-V',
      codigoSKU: 'COR-DAYCO-MV',
      marcaComponente: 'Dayco',
      categoria: 'Correas y Cadenas',
      numeroParteOEM: 'DAY-COR-MV',
      descripcion: 'Correa auxiliar de múltiples surcos para accesorios del motor',
      stockActual: 35,
      stockMinimo: 10,
      stockCritico: 3,
      precioCompra: 850.00,
      precioVenta: 1400.00,
      ubicacion: 'E-2-1',
      unidadMedida: 'Unidad',
      compatibilidades: {
        create: [
          { marca: 'Chevrolet', modelo: 'Cruze', anoDesde: 2009, anoHasta: 2023 },
          { marca: 'Kia', modelo: 'Forte', anoDesde: 2010, anoHasta: 2021 },
        ]
      }
    },
  ];

  for (const producto of productos) {
    const created = await prisma.producto.create({
      data: producto,
      include: { compatibilidades: true }
    });
    console.log(`✅ Producto creado: ${created.nombreProducto}`);
    console.log(`   SKU: ${created.codigoSKU}`);
    console.log(`   Marca: ${created.marcaComponente}`);
    console.log(`   Compatibilidades: ${created.compatibilidades.length}\n`);
  }

  console.log('🎉 ¡Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  const totalProductos = await prisma.producto.count();
  const totalCompatibilidades = await prisma.compatibilidadProducto.count();
  console.log(`   Total de productos: ${totalProductos}`);
  console.log(`   Total de compatibilidades: ${totalCompatibilidades}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
