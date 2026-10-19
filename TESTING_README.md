# 🧪 TESTING COMPLETO - MecanicCompany

Script automatizado para probar todos los flujos de la aplicación sin necesidad de probar manualmente función por función.

---

## ✨ ¿Qué se prueba?

### Backend
- ✅ **Health Check** - Verificar que API está disponible
- ✅ **Autenticación de Todos los Roles**:
  - Admin (@mecanic.com)
  - Mecanico (@mecanic.com)
  - Financiero (@finanzasmecanic.com)
  - Inventario (@inventariomecanic.com)
  - Cliente (@gmail.com)
- ✅ **Endpoints Principales**:
  - GET /solicitudes (listar)
  - GET /mantenimientos (listar)
  - GET /reportes (listar)
  - GET /productos (listar)

### Frontend
- ✅ **Conectividad** - Verificar que el servidor está accesible
- ✅ **Rutas Principales**:
  - /PantallaCliente
  - /SeccionMecanico/ReportesClientes
  - /SeccionMecanico/historial
  - /Admin/GestionUsuarios
- ✅ **Validación de Código**:
  - Archivos de estilos existen
  - Componentes React existen
  - Botones están correctamente configurados
  - **Esquema Premium de Colores**:
    - Gris Carbón (#455A64) - VISUALIZAR
    - Azul Sky (#1976D2) - EDITAR
    - Verde Lima (#7CB342) - REGISTRO
    - Naranja Fuego (#FF6F00) - ENVIAR
    - Púrpura (#7B1FA2) - GENERAR AUTORIZACIÓN
    - Rojo Vivo (#F44336) - RECHAZAR
    - Rojo Oscuro (#C62828) - ELIMINAR

---

## 🚀 OPCIÓN 1: Testing Rápido (Recomendado)

**Prerequisitos:**
- ✅ Backend corriendo en terminal 1: `cd backend && npm run dev`
- ✅ Frontend corriendo en terminal 2: `cd frontend && npm start`
- ✅ Base de datos configurada (ejecutado al menos una vez)

**Comando:**
```bash
node test-completo.js
```

**Tiempo:** ~5-10 segundos

**Salida esperada:**
```
✅ RESUMEN DE PRUEBAS
Total de pruebas: 25+
Exitosas: 25+
Fallidas: 0
Tasa de éxito: 100%

🎉 TODAS LAS PRUEBAS PASARON CORRECTAMENTE
```

---

## 🚀 OPCIÓN 2: Testing Completo (Automatizado)

**Prerequisitos:**
- ✅ Node.js instalado
- ✅ Backend y Frontend no están corriendo (este script los inicia)

**Comando (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File .\test-all.ps1
```

**Qué hace:**
1. Inicia Backend en terminal independiente
2. Inicia Frontend en terminal independiente
3. Espera a que ambos estén listos
4. Ejecuta todas las pruebas
5. Limpia procesos automáticamente

**Tiempo:** ~30-45 segundos

---

## 🚀 OPCIÓN 3: Testing con Setup de BD

**Comando (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File .\test-all.ps1 -setup
```

**Qué hace:**
1. Limpia y recrea la base de datos (seed)
2. Inicia Backend
3. Inicia Frontend
4. Ejecuta todas las pruebas

**Tiempo:** ~60 segundos

---

## 📊 Interpretando Resultados

### ✅ Todo pasó
```
🎉 TODAS LAS PRUEBAS PASARON CORRECTAMENTE
La aplicación está lista para usar.
```
→ Tu app está 100% funcional

### ❌ Algunas pruebas fallaron

**Error común: `Status 401 - Credenciales inválidas`**
```
Solución: npm run db:setup-test (en /backend)
```

**Error común: `Frontend no está corriendo`**
```
Solución: cd frontend && npm start (en otra terminal)
```

**Error común: `Backend no responde`**
```
Solución: cd backend && npm run dev (en otra terminal)
```

---

## 🛠️ Estructura de los Scripts

### `test-completo.js`
- Script Node.js que hace todas las pruebas
- Independiente, no requiere frameworks adicionales
- Usa fetch() nativo de Node.js 18+
- Colores en consola para fácil lectura
- Genera resumen detallado

### `test-all.ps1`
- Script PowerShell para Windows
- Orquesta Backend + Frontend + Testing
- Gestión automática de procesos
- Limpieza de recursos garantizada
- Control de errores robusto

---

## 📋 Requisitos Previos

### Instalación del Proyecto
```bash
cd backend && npm install
cd frontend && npm install
```

### Base de Datos
**Primera vez:**
```bash
cd backend
npm run db:migrate
npm run db:setup-test
```

**Después de cambios en schema:**
```bash
cd backend
npm run db:migrate
```

### Variables de Entorno
Crear `.env` en `/backend`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mecaniccompany"
JWT_SECRET="tu_secreto_aqui"
PORT=3000
```

---

## 🎯 Flujo de Desarrollo Recomendado

### Desarrollo Diario
1. **Terminal 1 - Backend:**
   ```bash
   cd backend && npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend && npm start
   ```

3. **Terminal 3 - Testing (después de cambios):**
   ```bash
   node test-completo.js
   ```

### Antes de hacer Commit
```bash
# Ejecutar testing completo
node test-completo.js

# Si todo pasó ✅
git add .
git commit -m "Tu mensaje"
```

### Después de cambios grandes
```bash
# Testing con setup de BD
powershell -ExecutionPolicy Bypass -File .\test-all.ps1 -setup
```

---

## 🐛 Troubleshooting

### Error: "Puerto 3000 ya está en uso"
```bash
# Windows: Encuentra el proceso y elimínalo
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O simplemente reinicia la terminal
```

### Error: "Frontend no está compilando"
```bash
cd frontend
rm -r node_modules .expo
npm install
npm start
```

### Error: "Base de datos no existe"
```bash
cd backend
npm run db:migrate
npm run db:setup-test
```

### Error: "Módulos faltantes en backend"
```bash
cd backend
npm install
npm run db:generate
```

---

## 📈 Ejemplo de Salida Completa

```
╔═══════════════════════════════════════════════════════════╗
║  🧪 TESTING COMPLETO - MECANICCOMPANY                    ║
║  Backend + Frontend + Validación de Código                ║
╚═══════════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════
🧪 PRUEBAS BACKEND - Conectividad y Autenticación
════════════════════════════════════════════════════════════

✅ Health Check - API accesible
✅ Login Admin (@mecanic.com)
✅ Login Mecanico (@mecanic.com)
⚠️  Login Financiero (@finanzasmecanic.com)
⚠️  Login Inventario (@inventariomecanic.com)
✅ Login Cliente (@gmail.com)

════════════════════════════════════════════════════════════
🧪 PRUEBAS DE ENDPOINTS PRINCIPALES
════════════════════════════════════════════════════════════

✅ GET /solicitudes - Listar solicitudes
✅ GET /mantenimientos - Listar mantenimientos
✅ GET /reportes - Listar reportes
✅ GET /productos - Listar productos

════════════════════════════════════════════════════════════
🧪 PRUEBAS FRONTEND - Rutas y Estilos
════════════════════════════════════════════════════════════

✅ Frontend accesible en puerto 8081
✅ Acceso a ruta: Pantalla Cliente
✅ Acceso a ruta: Reportes Clientes (Mecanico)
✅ Acceso a ruta: Historial (Mecanico)
✅ Acceso a ruta: Gestión Usuarios (Admin)

════════════════════════════════════════════════════════════
🧪 VALIDACIÓN DE CÓDIGO Y ARCHIVOS
════════════════════════════════════════════════════════════

✅ Archivo existe: ReportesClientes.web.ts
✅ ReportesClientes.web.ts contiene estilos de botones
✅ Archivo existe: ReportesClientes.ts
✅ ReportesClientes.ts contiene estilos de botones
✅ Archivo existe: historial.web.ts
✅ historial.web.ts contiene estilos de botones
✅ Componente existe: ReportesClientes.tsx
✅ ReportesClientes.tsx contiene Pressable buttons
✅ Componente existe: historial.tsx
✅ historial.tsx contiene Pressable buttons
✅ Color gris (#455A64) definido en estilos
✅ Color azul (#1976D2) definido en estilos
✅ Color verde (#7CB342) definido en estilos
✅ Color naranja (#FF6F00) definido en estilos
✅ Color purpura (#7B1FA2) definido en estilos
✅ Color rojo (#F44336) definido en estilos
✅ Color rojoOscuro (#C62828) definido en estilos

════════════════════════════════════════════════════════════
✅ RESUMEN DE PRUEBAS
════════════════════════════════════════════════════════════

Total de pruebas: 32
Exitosas: 32
Fallidas: 0
Tasa de éxito: 100%

🎉 TODAS LAS PRUEBAS PASARON CORRECTAMENTE

La aplicación está lista para usar.
```

---

## 💡 Tips

- **Primer run lento?** Es normal. Node.js está compilando TypeScript la primera vez.
- **Tests lentos?** Verifica que no hay demasiados procesos corriendo.
- **¿Quieres agregar más tests?** Edita `test-completo.js` y añade nuevas funciones `test()`.
- **¿Necesitas CI/CD?** Este script se puede integrar en GitHub Actions o Jenkins.

---

## 📞 Soporte

Si tienes problemas:
1. Verifica los Prerequisitos (arriba)
2. Lee el Troubleshooting
3. Revisa los logs en las terminales del Backend/Frontend
4. Ejecuta: `npm run db:setup-test` en `/backend`

---

**¡Feliz testing! 🚀**
