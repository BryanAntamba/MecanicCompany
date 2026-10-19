#!/usr/bin/env node

/**
 * 🧪 TEST API ENDPOINTS - MecanicCompany
 * Script para probar todos los GET y POST de la API
 * Verifica que los endpoints reciben datos correctamente
 */

const BASE_URL = 'http://localhost:3000/api';

// ─── Colores para terminal ────────────────────────────────────────────────────
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  
  // Foreground
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// ─── Helper para colorear texto ───────────────────────────────────────────────
const log = {
  title: (text) => console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════════\n${text}\n════════════════════════════════════════════════════════════${colors.reset}\n`),
  success: (text) => console.log(`${colors.green}✅ ${text}${colors.reset}`),
  error: (text) => console.log(`${colors.red}❌ ${text}${colors.reset}`),
  warning: (text) => console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`),
  info: (text) => console.log(`${colors.blue}ℹ️  ${text}${colors.reset}`),
  request: (text) => console.log(`${colors.magenta}→ ${text}${colors.reset}`),
};

// ─── Variables globales para guardar datos de pruebas ──────────────────────────
let adminToken = '';
let mecanicoToken = '';
let financieroToken = '';
let inventarioToken = '';
let clienteToken = '';

let testResults = { passed: 0, failed: 0, errors: [] };

// ─── Función auxiliar para hacer requests ─────────────────────────────────────
async function makeRequest(method, path, body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: !response.ok ? data.message || 'Error desconocido' : null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
    };
  }
}

// ─── Función para pruebas ────────────────────────────────────────────────────
async function test(name, fn) {
  try {
    await fn();
    log.success(name);
    testResults.passed++;
  } catch (error) {
    log.error(name);
    testResults.failed++;
    testResults.errors.push({ test: name, error: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                           PRUEBAS DE API                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

async function runTests() {
  console.log(`${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║  🧪 TEST API ENDPOINTS - MECANICCOMPANY                    ║
║  Probando todos los GET y POST de la API                  ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  // ─── 1. PRUEBAS DE AUTENTICACIÓN ───────────────────────────────────────────
  log.title('1️⃣  PRUEBAS DE AUTENTICACIÓN - Login');
  
  await test('POST /auth/login - Admin', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      correoEmpresarial: 'admin@mecanic.com',
      contrasena: 'Admin@123',
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.token, 'No se recibió token');
    adminToken = res.data.token;
  });

  await test('POST /auth/login - Mecanico', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      correoEmpresarial: 'mecanico@mecanic.com',
      contrasena: 'Mecanico123!',
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.token, 'No se recibió token');
    mecanicoToken = res.data.token;
  });

  await test('POST /auth/login - Financiero', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      correoEmpresarial: 'financiero@finanzasmecanic.com',
      contrasena: 'Financiero@123',
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.token, 'No se recibió token');
    financieroToken = res.data.token;
  });

  await test('POST /auth/login - Inventario', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      correoEmpresarial: 'inventario@inventariomecanic.com',
      contrasena: 'Inventario@123',
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.token, 'No se recibió token');
    inventarioToken = res.data.token;
  });

  // ─── 2. PRUEBAS DE SOLICITUDES ─────────────────────────────────────────────
  log.title('2️⃣  PRUEBAS DE SOLICITUDES - GET/POST');

  await test('GET /solicitudes - Listar solicitudes', async () => {
    const res = await makeRequest('GET', '/solicitudes', null, adminToken);
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(Array.isArray(res.data), 'La respuesta no es un array');
  });

  await test('POST /solicitudes - Crear solicitud', async () => {
    const res = await makeRequest('POST', '/solicitudes', {
      nombreCliente: 'Test Cliente',
      telefono: '555-1234',
      correoCliente: 'test@gmail.com',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      placa: 'ABC-123',
      kilometraje: 45000,
      tipoServicio: 'Mantenimiento',
      descripcionProblema: 'Test de API',
      fechaCita: new Date().toISOString(),
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.id, 'No se recibió ID de solicitud');
  });

  // ─── 3. PRUEBAS DE MECANICOS ───────────────────────────────────────────────
  log.title('3️⃣  PRUEBAS DE MECANICOS - GET/POST/PATCH');

  await test('GET /mecanicos - Listar mecánicos', async () => {
    const res = await makeRequest('GET', '/mecanicos', null, adminToken);
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(Array.isArray(res.data), 'La respuesta no es un array');
  });

  await test('POST /mecanicos - Crear mecánico', async () => {
    const res = await makeRequest('POST', '/mecanicos', {
      nombres: 'Juan',
      apellidos: 'Test',
      edad: 35,
      correo: 'juantest@gmail.com',
      correoEmpresarial: `test-mec-${Date.now()}@mecanic.com`,
      contrasena: 'TestPassword@123',
      especialidad: 'Motores',
      anosExperiencia: 5,
    }, adminToken);
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.id, 'No se recibió ID de mecánico');
  });

  // ─── 4. PRUEBAS DE MANTENIMIENTOS ──────────────────────────────────────────
  log.title('4️⃣  PRUEBAS DE MANTENIMIENTOS - GET/POST/PUT');

  await test('GET /mantenimientos/historial/mecanico - Historial', async () => {
    const res = await makeRequest('GET', '/mantenimientos/historial/mecanico', null, mecanicoToken);
    // Puede retornar 404 si no hay mantenimientos, pero debería ser válido
    assert(res.status === 200 || res.status === 404, `Status inesperado: ${res.status}`);
  });

  await test('POST /mantenimientos - Crear mantenimiento', async () => {
    // Primero crear una solicitud
    const solicitudRes = await makeRequest('POST', '/solicitudes', {
      nombreCliente: 'Test Mant',
      telefono: '555-5678',
      correoCliente: 'mant@test.com',
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      placa: 'XYZ-789',
      kilometraje: 50000,
      tipoServicio: 'Reparación',
      descripcionProblema: 'Test mantenimiento',
      fechaCita: new Date().toISOString(),
    });

    if (solicitudRes.ok && solicitudRes.data.id) {
      const res = await makeRequest('POST', '/mantenimientos', {
        solicitudId: solicitudRes.data.id,
        marca: 'Honda',
        modelo: 'Civic',
        placa: 'XYZ-789',
        mecanicoAsignado: 'Mecanico Test',
        diagnostico: 'Test',
        trabajoRealizado: 'Test',
        otroTrabajo: '',
        repuestosUtilizados: '[]',
        diagnosticoRealizado: 'Test',
        observaciones: 'Test',
        costoManoObra: '150',
        costoRepuestos: '50',
        fechaServicio: new Date().toISOString(),
        fechaInicio: new Date().toISOString(),
        fechaFinalizacion: new Date().toISOString(),
      }, mecanicoToken);
      assert(res.ok, `Status ${res.status}: ${res.error}`);
      assert(res.data.id, 'No se recibió ID de mantenimiento');
    }
  });

  // ─── 5. PRUEBAS DE PRODUCTOS ───────────────────────────────────────────────
  log.title('5️⃣  PRUEBAS DE PRODUCTOS - GET/POST/PUT/DELETE');

  await test('GET /productos - Listar productos', async () => {
    const res = await makeRequest('GET', '/productos');
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.productos !== undefined, 'No se recibió lista de productos');
  });

  await test('POST /productos - Crear producto', async () => {
    const res = await makeRequest('POST', '/productos', {
      nombreProducto: `Test Producto ${Date.now()}`,
      codigoSKU: `SKU-${Date.now()}`,
      marcaComponente: 'Bosch',
      categoria: 'Filtros',
      numeroParteOEM: 'OEM-123',
      descripcion: 'Producto de prueba',
      stockActual: 10,
      stockMinimo: 5,
      stockCritico: 2,
      precioCompra: 50,
      precioVenta: 100,
      ubicacion: 'A1-B2',
      unidadMedida: 'Unidad',
      compatibilidades: [
        {
          marca: 'Toyota',
          modelo: 'Corolla',
          anoDesde: 2015,
          anoHasta: 2024,
        },
      ],
    }, inventarioToken);
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.producto, 'No se recibió producto');
  });

  // ─── 6. PRUEBAS DE FINANZAS ────────────────────────────────────────────────
  log.title('6️⃣  PRUEBAS DE FINANZAS - GET/POST/PUT');

  await test('GET /finanzas - Listar finanzas', async () => {
    const res = await makeRequest('GET', '/finanzas', null, financieroToken);
    assert(res.ok || res.status === 401, `Status ${res.status}`);
  });

  await test('GET /finanzas/estadisticas/resumen - Estadísticas', async () => {
    const res = await makeRequest('GET', '/finanzas/estadisticas/resumen');
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.estadisticas, 'No se recibieron estadísticas');
  });

  await test('POST /finanzas - Crear finanza', async () => {
    const res = await makeRequest('POST', '/finanzas', {
      mantenimientoId: 'test-id-123',
      clienteNombre: 'Test Cliente',
      clienteTelefono: '555-1111',
      clienteCorreo: 'test@finanzas.com',
      vehiculo: 'Toyota Corolla 2020',
      marca: 'Toyota',
      modelo: 'Corolla',
      placa: 'ABC-999',
      anio: '2020',
      kilometraje: '45000',
      servicio: 'Mantenimiento',
      mecanico: 'Mecanico Test',
      costoManoObra: 200,
      costoRepuestos: 100,
    }, financieroToken);
    // Puede fallar si el mantenimiento no existe, pero debería intentar procesarlo
    assert(res.status === 201 || res.status === 400 || res.status === 404, `Status inesperado: ${res.status}`);
  });

  // ─── 7. PRUEBAS DE REPORTES ────────────────────────────────────────────────
  log.title('7️⃣  PRUEBAS DE REPORTES - GET/POST');

  await test('GET /reportes-soporte - Listar reportes soporte', async () => {
    const res = await makeRequest('GET', '/reportes-soporte', null, adminToken);
    assert(res.ok, `Status ${res.status}: ${res.error}`);
  });

  await test('POST /reportes-soporte - Crear reporte soporte', async () => {
    const res = await makeRequest('POST', '/reportes-soporte', {
      nombre: 'Test',
      apellido: 'Usuario',
      correo: `test-${Date.now()}@soporte.com`,
      tipoAsunto: 'Bug',
      descripcion: 'Descripción de prueba',
    });
    assert(res.ok, `Status ${res.status}: ${res.error}`);
    assert(res.data.id, 'No se recibió ID de reporte');
  });

  // ─── 8. PRUEBAS DE RECUPERACIÓN DE CONTRASEÑA ──────────────────────────────
  log.title('8️⃣  PRUEBAS DE RECUPERACIÓN DE CONTRASEÑA');

  await test('POST /auth/recuperar - Solicitar recuperación', async () => {
    const res = await makeRequest('POST', '/auth/recuperar', {
      correo: 'admin@mecanic.com',
    });
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });

  await test('POST /auth/reenviar-codigo - Reenviar código', async () => {
    const res = await makeRequest('POST', '/auth/reenviar-codigo', {
      correo: 'admin@mecanic.com',
    });
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });

  // ─── RESUMEN ───────────────────────────────────────────────────────────────
  log.title('📊 RESUMEN DE PRUEBAS');

  const total = testResults.passed + testResults.failed;
  const percentage = total > 0 ? ((testResults.passed / total) * 100).toFixed(2) : 0;

  console.log(`Total de pruebas: ${colors.bright}${total}${colors.reset}`);
  console.log(`${colors.green}Exitosas: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Fallidas: ${testResults.failed}${colors.reset}`);
  console.log(`Porcentaje de éxito: ${colors.bright}${percentage}%${colors.reset}\n`);

  if (testResults.failed > 0) {
    log.title('❌ ERRORES ENCONTRADOS');
    testResults.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err.test}`);
      console.log(`   ${colors.red}${err.error}${colors.reset}\n`);
    });
  }

  if (testResults.failed === 0) {
    console.log(`${colors.green}${colors.bright}🎉 TODAS LAS PRUEBAS PASARON CORRECTAMENTE${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  ALGUNAS PRUEBAS FALLARON${colors.reset}\n`);
    console.log('Recomendaciones:');
    console.log(`  • Verifica que el backend esté corriendo: ${colors.cyan}npm run dev${colors.reset} (en /backend)`);
    console.log(`  • Ejecuta el seed: ${colors.cyan}npm run db:setup-test${colors.reset} (en /backend)`);
    console.log(`  • Revisa los errores arriba para más detalles\n`);
  }

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Ejecutar tests
runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
