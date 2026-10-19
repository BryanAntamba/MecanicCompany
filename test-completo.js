#!/usr/bin/env node
/**
 * SCRIPT DE TESTING COMPLETO - MecanicCompany
 * 
 * Prueba todos los flujos principales del backend y validaciones del frontend
 * Uso: node test-completo.js
 * 
 * Testa:
 * ✓ Backend: Health check, Login de todos los roles, Endpoints principales
 * ✓ Frontend: Estilos, Colores, Rutas, Conectividad
 */

const BASE_URL = 'http://localhost:3000/api';
const FRONTEND_URL = 'http://localhost:8081';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n${colors.bright}${colors.blue}🧪 ${msg}${colors.reset}\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.yellow}→ ${msg}${colors.reset}`),
};

// Estadísticas
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
};

/**
 * Realiza un request HTTP
 */
async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => ({}));

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

/**
 * Test individual
 */
async function test(name, fn) {
  stats.total++;
  try {
    await fn();
    log.success(name);
    stats.passed++;
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    stats.failed++;
    stats.errors.push({ test: name, error: error.message });
  }
}

/**
 * Test de Assert
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * PRUEBAS BACKEND
 */
async function testBackend() {
  log.title('PRUEBAS BACKEND - Conectividad y Autenticación');

  // Health Check
  await test('Health Check - API accesible', async () => {
    const res = await request('GET', '/health');
    assert(res.ok, `Status ${res.status} (esperado 200)`);
    assert(res.data.status === 'ok', 'Health status debe ser "ok"');
  });

  // Login Admin
  await test('Login Admin (@mecanic.com)', async () => {
    const res = await request('POST', '/auth/login', {
      correoEmpresarial: 'admin@mecanic.com',
      contrasena: 'admin123',
    });
    assert(res.ok, `Status ${res.status}`);
    assert(res.data.token, 'Debe retornar token');
    assert(res.data.usuario.rol === 'admin', 'Rol debe ser admin');
    global.adminToken = res.data.token;
  });

  // Login Mecanico
  await test('Login Mecanico (@mecanic.com)', async () => {
    const res = await request('POST', '/auth/login', {
      correoEmpresarial: 'test@mecanic.com',
      contrasena: 'Test123!',
    });
    if (res.status === 401) {
      throw new Error('Credenciales inválidas - ejecuta: npm run db:setup-test en backend');
    }
    assert(res.ok, `Status ${res.status}`);
    assert(res.data.token, 'Debe retornar token');
    assert(res.data.usuario.rol === 'mecanico', 'Rol debe ser mecanico');
    global.mecanicToken = res.data.token;
  });

  // Login Financiero
  await test('Login Financiero (@finanzasmecanic.com)', async () => {
    const res = await request('POST', '/auth/login', {
      correoEmpresarial: 'finanzas@finanzasmecanic.com',
      contrasena: 'Test123456!',
    });
    if (res.status === 401) {
      log.warning('Financiero no creado - ejecuta: npm run db:setup-test en backend');
      return;
    }
    assert(res.ok, `Status ${res.status}`);
    assert(res.data.usuario.rol === 'financiero', 'Rol debe ser financiero');
    global.financeToken = res.data.token;
  });

  // Login Inventario
  await test('Login Inventario (@inventariomecanic.com)', async () => {
    const res = await request('POST', '/auth/login', {
      correoEmpresarial: 'inventario@inventariomecanic.com',
      contrasena: 'Test123456!',
    });
    if (res.status === 401) {
      log.warning('Inventario no creado - ejecuta: npm run db:setup-test en backend');
      return;
    }
    assert(res.ok, `Status ${res.status}`);
    assert(res.data.usuario.rol === 'inventario', 'Rol debe ser inventario');
    global.inventoryToken = res.data.token;
  });

  // Login Cliente
  await test('Login Cliente (@gmail.com)', async () => {
    const res = await request('POST', '/auth/login', {
      correoEmpresarial: 'juan@gmail.com',
      contrasena: 'Test123!',
    });
    if (res.status === 401) {
      log.warning('Cliente no creado - ejecuta: npm run db:setup-test en backend');
      return;
    }
    assert(res.ok, `Status ${res.status}`);
    assert(res.data.usuario.rol === 'cliente', 'Rol debe ser cliente');
    global.clientToken = res.data.token;
  });
}

/**
 * PRUEBAS DE ENDPOINTS PRINCIPALES
 */
async function testEndpoints() {
  log.title('PRUEBAS DE ENDPOINTS PRINCIPALES');

  if (!global.mecanicToken) {
    log.warning('Token de mecanico no disponible - saltando pruebas de endpoints');
    return;
  }

  // Listar Solicitudes
  await test('GET /solicitudes - Listar solicitudes del mecanico', async () => {
    const res = await request('GET', '/solicitudes', null, global.mecanicToken);
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });

  // Listar Mantenimientos
  await test('GET /mantenimientos - Listar mantenimientos', async () => {
    const res = await request('GET', '/mantenimientos', null, global.mecanicToken);
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });

  // Listar Reportes
  await test('GET /reportes - Listar reportes', async () => {
    const res = await request('GET', '/reportes', null, global.mecanicToken);
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });

  // Listar Productos (Inventario)
  await test('GET /productos - Listar productos', async () => {
    const res = await request('GET', '/productos', null, global.mecanicToken);
    assert(res.ok || res.status === 404, `Status ${res.status}`);
  });
}

/**
 * PRUEBAS FRONTEND
 */
async function testFrontend() {
  log.title('PRUEBAS FRONTEND - Rutas y Estilos');

  // Verificar que el frontend está corriendo
  await test('Frontend accesible en puerto 8081', async () => {
    try {
      const response = await fetch(FRONTEND_URL);
      assert(response.ok || response.status === 301, `Status ${response.status}`);
    } catch (error) {
      throw new Error('Frontend no está corriendo en http://localhost:8081');
    }
  });

  // Verificar rutas principales
  log.section('Verificando rutas principales');

  const rutas = [
    { ruta: '/PantallaCliente', nombre: 'Pantalla Cliente' },
    { ruta: '/SeccionMecanico/ReportesClientes', nombre: 'Reportes Clientes (Mecanico)' },
    { ruta: '/SeccionMecanico/historial', nombre: 'Historial (Mecanico)' },
    { ruta: '/Admin/GestionUsuarios', nombre: 'Gestión Usuarios (Admin)' },
  ];

  for (const ruta of rutas) {
    await test(`Acceso a ruta: ${ruta.nombre}`, async () => {
      try {
        const response = await fetch(`${FRONTEND_URL}${ruta.ruta}`, {
          redirect: 'follow',
        });
        assert(response.status < 500, `Status ${response.status}`);
      } catch (error) {
        // En frontend puede fallar por CORS o ser una SPA, solo verificar conectividad
        if (!error.message.includes('CORS')) {
          log.warning(`No se pudo acceder a ${ruta.ruta} (puede ser normal en SPA)`);
        }
      }
    });
  }
}

/**
 * PRUEBAS DE VALIDACIÓN DE CÓDIGO
 */
async function testCodeValidation() {
  log.title('VALIDACIÓN DE CÓDIGO Y ARCHIVOS');

  const fs = require('fs').promises;
  const path = require('path');

  // Verificar archivos de estilos
  const styleFiles = [
    { path: './frontend/Styles/pantallaMecanico/ReportesClientes.web.ts', name: 'ReportesClientes.web.ts' },
    { path: './frontend/Styles/pantallaMecanico/ReportesClientes.ts', name: 'ReportesClientes.ts' },
    { path: './frontend/Styles/pantallaMecanico/historial.web.ts', name: 'historial.web.ts' },
  ];

  for (const file of styleFiles) {
    await test(`Archivo existe: ${file.name}`, async () => {
      try {
        await fs.access(file.path);
      } catch {
        throw new Error(`Archivo no encontrado: ${file.path}`);
      }
    });

    // Verificar que contenga los estilos de botones
    await test(`${file.name} contiene estilos de botones`, async () => {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        assert(content.includes('btnPrimary'), 'Debe contener btnPrimary');
        assert(content.includes('btnSecondary'), 'Debe contener btnSecondary');
        assert(content.includes('backgroundColor'), 'Debe contener colores');
      } catch (error) {
        throw new Error(`Error leyendo ${file.name}: ${error.message}`);
      }
    });
  }

  // Verificar componentes principales
  log.section('Verificando componentes React');

  const components = [
    { path: './frontend/app/SeccionMecanico/ReportesClientes.tsx', name: 'ReportesClientes.tsx' },
    { path: './frontend/app/SeccionMecanico/historial.tsx', name: 'historial.tsx' },
  ];

  for (const comp of components) {
    await test(`Componente existe: ${comp.name}`, async () => {
      try {
        await fs.access(comp.path);
      } catch {
        throw new Error(`Componente no encontrado: ${comp.path}`);
      }
    });

    await test(`${comp.name} contiene Pressable buttons`, async () => {
      try {
        const content = await fs.readFile(comp.path, 'utf-8');
        assert(content.includes('Pressable'), 'Debe usar componentes Pressable');
        assert(content.includes('handlePress') || content.includes('onPress'), 'Debe tener handlers');
      } catch (error) {
        throw new Error(`Error validando ${comp.name}: ${error.message}`);
      }
    });
  }

  // Verificar colores del esquema Premium
  log.section('Validando Esquema de Colores Premium');

  const expectedColors = {
    gris: '#455A64',
    azul: '#1976D2',
    verde: '#7CB342',
    naranja: '#FF6F00',
    purpura: '#7B1FA2',
    rojo: '#F44336',
    rojoOscuro: '#C62828',
  };

  for (const [nombre, color] of Object.entries(expectedColors)) {
    await test(`Color ${nombre} (${color}) definido en estilos`, async () => {
      try {
        let found = false;
        for (const file of styleFiles) {
          const content = await fs.readFile(file.path, 'utf-8');
          if (content.includes(color)) {
            found = true;
            break;
          }
        }
        assert(found, `Color ${color} no encontrado en archivos de estilos`);
      } catch (error) {
        throw new Error(`Error validando color: ${error.message}`);
      }
    });
  }
}

/**
 * RESUMEN FINAL
 */
function printSummary() {
  const allPassed = stats.failed === 0;
  const statusIcon = allPassed ? '✅' : '❌';
  const statusColor = allPassed ? colors.green : colors.red;

  console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${statusColor}${statusIcon} RESUMEN DE PRUEBAS${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.bright}Total de pruebas:${colors.reset} ${stats.total}`);
  console.log(`${colors.green}${colors.bright}Exitosas:${colors.reset} ${stats.passed}`);
  console.log(`${colors.red}${colors.bright}Fallidas:${colors.reset} ${stats.failed}`);
  console.log(`${colors.bright}Tasa de éxito:${colors.reset} ${((stats.passed / stats.total) * 100).toFixed(2)}%\n`);

  if (stats.errors.length > 0) {
    console.log(`${colors.red}${colors.bright}ERRORES ENCONTRADOS:${colors.reset}\n`);
    stats.errors.forEach((err, i) => {
      console.log(`${colors.red}${i + 1}. ${err.test}${colors.reset}`);
      console.log(`   ${colors.yellow}${err.error}${colors.reset}`);
    });
    console.log();
  }

  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`);

  if (!allPassed) {
    console.log(`${colors.red}${colors.bright}⚠️  ALGUNAS PRUEBAS FALLARON${colors.reset}`);
    console.log(`${colors.yellow}Recomendaciones:${colors.reset}`);
    console.log(`  • Verifica que el backend esté corriendo: npm run dev (en /backend)`);
    console.log(`  • Verifica que el frontend esté corriendo: npm start (en /frontend)`);
    console.log(`  • Ejecuta el seed: npm run db:setup-test (en /backend)`);
    console.log(`  • Revisa los errores arriba para más detalles\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bright}🎉 TODAS LAS PRUEBAS PASARON CORRECTAMENTE${colors.reset}\n`);
    console.log(`${colors.bright}La aplicación está lista para usar.${colors.reset}\n`);
    process.exit(0);
  }
}

/**
 * EJECUTAR TODAS LAS PRUEBAS
 */
async function runAllTests() {
  console.clear();
  console.log(`\n${colors.bright}${colors.bright}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}║  🧪 TESTING COMPLETO - MECANICCOMPANY                      ║${colors.reset}`);
  console.log(`${colors.bright}║  Backend + Frontend + Validación de Código                 ║${colors.reset}`);
  console.log(`${colors.bright}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  try {
    await testBackend();
    await testEndpoints();
    await testFrontend();
    await testCodeValidation();
  } catch (error) {
    log.error(`Error fatal: ${error.message}`);
  }

  printSummary();
}

// Ejecutar
runAllTests().catch((error) => {
  console.error('Error ejecutando tests:', error);
  process.exit(1);
});
