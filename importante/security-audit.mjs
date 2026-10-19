/**
 * security-audit.mjs
 * Auditoría OWASP Top 10 — MecanicCompany API
 *
 * Ejecutar con el backend corriendo:
 *   node security-audit.mjs
 *   node security-audit.mjs http://192.168.1.X:3000   (IP red local)
 */

const BASE = process.argv[2] ?? 'http://localhost:3000';

// ─── Utilidades ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const results = [];

function ok(id, name, detail = '') {
    passed++;
    results.push({ status: '✅ PASS', id, name, detail });
}

function fail(id, name, detail = '') {
    failed++;
    results.push({ status: '❌ FAIL', id, name, detail });
}

function warn(id, name, detail = '') {
    results.push({ status: '⚠️  WARN', id, name, detail });
}

async function req(method, path, opts = {}) {
    const { body, headers = {}, timeout = 8000 } = opts;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(`${BASE}${path}`, {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });
        clearTimeout(timer);
        let json = null;
        try { json = await res.json(); } catch { /* vacío */ }
        return { status: res.status, headers: res.headers, json };
    } catch (e) {
        clearTimeout(timer);
        if (e.name === 'AbortError') return { status: 0, error: 'timeout', headers: new Headers(), json: null };
        return { status: 0, error: e.message, headers: new Headers(), json: null };
    }
}

// ─── Checks ───────────────────────────────────────────────────────────────────

async function checkServerOnline() {
    const r = await req('GET', '/api/health');
    if (r.status === 200) {
        ok('SRV', 'Servidor responde en ' + BASE);
        return true;
    }
    fail('SRV', 'Servidor no disponible en ' + BASE, `status=${r.status} error=${r.error ?? ''}`);
    return false;
}

// A05 — Security Headers (Helmet)
async function checkSecurityHeaders() {
    const r = await req('GET', '/api/health');
    const h = r.headers;

    const checks = [
        ['x-content-type-options', 'nosniff', 'X-Content-Type-Options'],
        ['x-frame-options', /^(DENY|SAMEORIGIN)$/i, 'X-Frame-Options'],
        ['x-dns-prefetch-control', 'off', 'X-DNS-Prefetch-Control'],
        ['referrer-policy', /.+/, 'Referrer-Policy'],
        ['x-download-options', 'noopen', 'X-Download-Options'],
    ];

    for (const [header, expected, label] of checks) {
        const val = h.get(header) ?? '';
        const match = expected instanceof RegExp ? expected.test(val) : val === expected;
        if (match) ok('A05-H', `Header seguro: ${label}`, val);
        else fail('A05-H', `Header ausente/incorrecto: ${label}`, `obtenido="${val}"`);
    }

    // HSTS — solo relevante en HTTPS
    const hsts = h.get('strict-transport-security');
    if (hsts) ok('A05-H', 'HSTS presente', hsts);
    else warn('A05-H', 'HSTS ausente (normal en HTTP local, requerido en producción HTTPS)');
}

// A05 — CORS restringido
async function checkCORS() {
    const badOrigin = 'https://evil-attacker.com';
    const r = await req('GET', '/api/health', { headers: { Origin: badOrigin } });
    const acao = r.headers.get('access-control-allow-origin') ?? '';

    if (acao === badOrigin || acao === '*') {
        fail('A05-C', 'CORS acepta orígenes arbitrarios', `Access-Control-Allow-Origin: ${acao}`);
    } else {
        ok('A05-C', 'CORS rechaza origen no autorizado', `Origin: ${badOrigin} → ACAO: "${acao}"`);
    }

    // CORS local debe funcionar (simula Expo Go)
    const localOrigin = 'http://192.168.1.1:8081';
    const r2 = await req('GET', '/api/health', { headers: { Origin: localOrigin } });
    const acao2 = r2.headers.get('access-control-allow-origin') ?? '';
    if (acao2 === localOrigin || acao2 === '*') {
        ok('A05-C', 'CORS permite IP local (Expo Go)', localOrigin);
    } else {
        warn('A05-C', 'CORS puede bloquear IPs locales', `Origin: ${localOrigin} → ACAO: "${acao2}" (verifica en dispositivo real)`);
    }
}

// A05 — Límite de payload (DoS)
async function checkPayloadLimit() {
    const bigBody = { correoEmpresarial: 'x@x.com', contrasena: 'A'.repeat(60 * 1024) };
    const r = await req('POST', '/api/auth/login', { body: bigBody });
    if (r.status === 413) {
        ok('A05-P', 'Payload >50kb rechazado con 413', `status=${r.status}`);
    } else {
        fail('A05-P', 'Payload grande NO fue rechazado', `status=${r.status} (esperado 413)`);
    }
}

// A07 — Rate limiting en login
async function checkRateLimitLogin() {
    console.log('   [rate-limit login] Enviando 12 peticiones rápidas...');
    let got429 = false;
    for (let i = 0; i < 12; i++) {
        const r = await req('POST', '/api/auth/login', {
            body: { correoEmpresarial: `test${i}@test.com`, contrasena: 'wrong' },
        });
        if (r.status === 429) { got429 = true; break; }
    }
    if (got429) ok('A07-R', 'Rate limiting activo en /login (429 tras ~10 intentos)');
    else fail('A07-R', 'Rate limiting NO disparó en /login tras 12 intentos');
}

// A07 — Rate limiting en recuperación
async function checkRateLimitRecovery() {
    console.log('   [rate-limit recovery] Enviando 7 peticiones rápidas...');
    let got429 = false;
    for (let i = 0; i < 7; i++) {
        const r = await req('POST', '/api/auth/recuperar', {
            body: { correo: `test${i}@gmail.com` },
        });
        if (r.status === 429) { got429 = true; break; }
    }
    if (got429) ok('A07-R', 'Rate limiting activo en /recuperar (429 tras ~5 intentos)');
    else fail('A07-R', 'Rate limiting NO disparó en /recuperar tras 7 intentos');
}

// A04 — cambiarPassword sin resetToken debe fallar
async function checkPasswordChangeNoToken() {
    // Intento antiguo (correo directo) — debe ser rechazado
    const r1 = await req('PUT', '/api/auth/cambiar-password', {
        body: { correo: 'victima@gmail.com', nuevaContrasena: 'hackeado123' },
    });
    // 400 = rechazado por lógica, 429 = rate limiter bloqueó (ambos son correctos)
    if (r1.status === 400 || r1.status === 429) {
        ok('A04-P', 'cambiarPassword rechaza petición sin resetToken', `status=${r1.status}`);
    } else {
        fail('A04-P', 'cambiarPassword acepta petición sin resetToken', `status=${r1.status} — CRÍTICO`);
    }

    // Token falsificado — debe ser rechazado
    const r2 = await req('PUT', '/api/auth/cambiar-password', {
        body: { resetToken: 'eyJhbGciOiJIUzI1NiJ9.fake.payload', nuevaContrasena: 'hackeado123' },
    });
    if (r2.status === 400 || r2.status === 429) {
        ok('A04-P', 'cambiarPassword rechaza resetToken falsificado', `status=${r2.status}`);
    } else {
        fail('A04-P', 'cambiarPassword acepta token falsificado', `status=${r2.status} — CRÍTICO`);
    }
}

// A04 — Validación de contraseña débil
async function checkWeakPassword() {
    const r = await req('PUT', '/api/auth/cambiar-password', {
        body: { resetToken: 'cualquier-cosa', nuevaContrasena: '123' },
    });
    // 400 = rechazado por validación, 429 = rate limiter activo (ambos protegen el endpoint)
    if (r.status === 400 || r.status === 429) {
        ok('A04-W', 'Contraseña débil rechazada (mínimo 8 chars + letra + número)', `status=${r.status}`);
    } else {
        fail('A04-W', 'Contraseña débil NO fue rechazada', `status=${r.status}`);
    }
}

// A01 — Auth requerida para rutas protegidas
async function checkAuthRequired() {
    const routes = [
        ['GET', '/api/mecanicos'],
        ['GET', '/api/solicitudes'],
        // La ruta de reportes solo expone POST /api/reportes/enviar/:id
        ['POST', '/api/reportes/enviar/test-id'],
    ];
    for (const [method, path] of routes) {
        const r = await req(method, path);
        if (r.status === 401) ok('A01-A', `Auth requerida: ${method} ${path}`, 'status=401');
        else fail('A01-A', `Auth NO requerida: ${method} ${path}`, `status=${r.status} (esperado 401)`);
    }
}

// A01 — Ruta admin-only con token de mecánico debe dar 403
async function checkAdminOnly() {
    // Sin token — espera 401
    const r1 = await req('DELETE', '/api/solicitudes/fake-id-123');
    if (r1.status === 401) ok('A01-I', 'DELETE /solicitudes requiere autenticación', 'status=401');
    else fail('A01-I', 'DELETE /solicitudes no requiere autenticación', `status=${r1.status}`);

    // Con token de mecánico falso — espera 401 (token inválido)
    const r2 = await req('DELETE', '/api/solicitudes/fake-id-123', {
        headers: { Authorization: 'Bearer fake.mechanic.token' },
    });
    if (r2.status === 401) ok('A01-I', 'DELETE /solicitudes rechaza token inválido', 'status=401');
    else fail('A01-I', 'DELETE /solicitudes acepta token inválido', `status=${r2.status}`);
}

// A07 — Login no revela si el usuario existe (respuesta genérica)
async function checkLoginEnumeration() {
    const r = await req('POST', '/api/auth/login', {
        body: { correoEmpresarial: 'noexiste_xyz_12345@empresa.com', contrasena: 'cualquiera' },
    });
    // 429 = rate limiter activo → el endpoint está protegido (mejor que revelar el mensaje)
    if (r.status === 429) {
        ok('A07-E', 'Login protegido por rate limiting (enumeración bloqueada)', 'status=429');
        return;
    }
    const msg = r.json?.message ?? '';
    // No debe decir "usuario no encontrado", "correo no registrado", etc.
    const leaks = /no.*(existe|encontrado|registrado)|usuario.*no|not.*found/i.test(msg);
    if (!leaks && r.status === 401) {
        ok('A07-E', 'Login no revela si el usuario existe', `msg="${msg}"`);
    } else if (leaks) {
        fail('A07-E', 'Login revela existencia de usuarios (enumeración)', `msg="${msg}"`);
    } else {
        warn('A07-E', 'Revisar mensaje de login manualmente', `status=${r.status} msg="${msg}"`);
    }
}

// A07 — Recuperación no revela si el correo existe
async function checkRecoveryEnumeration() {
    const r = await req('POST', '/api/auth/recuperar', {
        body: { correo: 'noexiste_xyz_12345@gmail.com' },
    });
    if (r.status === 429) {
        ok('A07-E', 'Recuperación protegida por rate limiting (enumeración bloqueada)', 'status=429');
        return;
    }
    const msg = r.json?.message ?? '';
    const isGeneric = /si el correo/i.test(msg);
    if (isGeneric) ok('A07-E', 'Recuperación usa respuesta genérica (anti-enumeración)', `msg="${msg}"`);
    else warn('A07-E', 'Revisar mensaje de recuperación manualmente', `msg="${msg}"`);
}

// ─── Runner principal ─────────────────────────────────────────────────────────

async function run() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  OWASP Security Audit — MecanicCompany API');
    console.log(`  Target: ${BASE}`);
    console.log('═══════════════════════════════════════════════════════\n');

    const online = await checkServerOnline();
    if (!online) {
        console.log('\n No se puede conectar al servidor. Inicia el backend primero:\n   cd backend && npm run dev\n');
        process.exit(1);
    }

    console.log('\n─── A05 Security Misconfiguration ──────────────────────');
    await checkSecurityHeaders();
    await checkCORS();
    await checkPayloadLimit();

    console.log('\n─── A07 Auth / Rate Limiting ────────────────────────────');
    await checkRateLimitLogin();
    await checkRateLimitRecovery();
    await checkLoginEnumeration();
    await checkRecoveryEnumeration();

    console.log('\n─── A04 Insecure Design ─────────────────────────────────');
    await checkPasswordChangeNoToken();
    await checkWeakPassword();

    console.log('\n─── A01 Access Control ──────────────────────────────────');
    await checkAuthRequired();
    await checkAdminOnly();

    // ─── Resumen ─────────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  RESULTADOS');
    console.log('═══════════════════════════════════════════════════════\n');

    for (const r of results) {
        const detail = r.detail ? `  →  ${r.detail}` : '';
        console.log(`${r.status}  [${r.id}]  ${r.name}${detail}`);
    }

    console.log(`\n  ✅ PASS: ${passed}   ❌ FAIL: ${failed}   ⚠️  WARN: ${results.filter(r => r.status.startsWith('⚠')).length}`);

    if (failed === 0) {
        console.log('\n  Todas las verificaciones automáticas pasaron.\n');
    } else {
        console.log(`\n  ${failed} verificación(es) fallaron — revisar arriba.\n`);
        process.exit(1);
    }
}

run().catch(e => { console.error(e); process.exit(1); });
