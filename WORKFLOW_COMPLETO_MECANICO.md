# Flujo Completo de Reportes - Mecánico

## Resumen del Workflow
Cuando un mecánico completa una solicitud de mantenimiento, puede enviar un reporte profesional por email al cliente. El flujo incluye:
1. Captura de foto del vehículo al recibir la solicitud
2. Registro de mantenimiento con nombre del mecánico de la sesión
3. Envío automático de reporte y factura al cliente
4. Actualización de estado a "Completado"
5. Desaparición automática de reportes enviados del panel de pendientes
6. Aparición en historial de trabajos completados

---

## 1️⃣ REGISTRO DE MANTENIMIENTO (registroMantenimiento.tsx)

### Campos Capturados:
- ✅ **Foto del Vehículo** - Capturada al momento de recibir el vehículo
  - Botón verde: "Seleccionar Foto"
  - Botón rojo: "Eliminar Foto"
  - Se envía en base64 al backend
  
- ✅ **Nombre del Mecánico** - Obtenido automáticamente de la sesión del usuario
  - Datos: `user.nombres + ' ' + user.apellidos`
  - NO es hardcodeado
  - Se captura de `useAuth()` context

- ✅ **Validaciones de Fechas**
  - Fecha de finalización NO puede ser antes de fecha de inicio
  - Fecha de finalización NO puede ser en el futuro
  - Mismo día permitido (si se completa el mismo día)

### Datos Enviados al Backend:
```javascript
{
  solicitudId: string,
  marca: string,
  modelo: string,
  placa: string,
  mecanicoAsignado: string, // Dinámico desde sesión
  diagnostico: string,
  trabajoRealizado: string,
  repuestosUtilizados: string (JSON),
  diagnosticoRealizado: string,
  observaciones: string,
  costoManoObra: number,
  costoRepuestos: number,
  fechaServicio: string (DD/MM/YYYY),
  fechaInicio: string (DD/MM/YYYY),
  fechaFinalizacion: string (DD/MM/YYYY),
  fotoVehiculo: string (base64) // NUEVO
}
```

**Endpoint POST**: `/api/mantenimientos`

---

## 2️⃣ CONFIRMACIÓN Y ENVÍO (confirmacionReporte.tsx)

### Acciones Realizadas:
1. **Crear Factura Automática**
   - Registra el pago en el sistema financiero
   - Calcula: Costo Mano de Obra + Costo Repuestos
   - Descuenta repuestos del inventario (si aplica)

2. **Enviar Reporte por Email** ⚡ NUEVO
   - Endpoint: `POST /api/reportes/enviar/:solicitudId`
   - Incluye: Datos del vehículo, trabajo realizado, foto del mecánico
   - Email formateado profesionalmente
   - Foto del mecánico inserida en línea (CID attachment)

3. **Actualizar Estado**
   - Solicitud.estado cambia a "Completado"
   - Esto es automático en el backend

### Flow de Modales:
```
ConfirmacionReporte (verificar datos)
    ↓
    Crear factura + Enviar email
    ↓
EnvioExitoso (muestra confirmación)
    ↓
Recargar lista de solicitudes
    ↓
Modal se cierra automáticamente
```

---

## 3️⃣ ACTUALIZACIÓN DE ESTADO (Backend)

### Solicitud.estado Transitions:
```
Pendiente → En_proceso (al llenar registro)
En_proceso → Completado (al enviar reporte)
```

### Base de Datos:
- `Solicitud.estado` cambia a "Completado"
- `Solicitud.mecanico` se vincula con el mecánico
- `Mantenimiento` se crea con todos los datos
- `Finanzas` se crea con la factura

---

## 4️⃣ PANEL DE REPORTES (ReportesClientes.tsx)

### Comportamiento:
- ✅ **Filtro por Defecto**: Muestra SOLO estado "Pendiente"
  - Anteriormente: 'TODOS' (mostraba completados)
  - Ahora: 'Pendiente' (no muestra completados)

- ✅ **Actualización Automática**
  - Cuando se cierra "EnvioExitoso", recarga solicitudes
  - Reportes completados desaparecen de la vista
  - Nuevas solicitudes aparecen automáticamente

- ✅ **Filtro Manual Disponible**
  - Botón dropdown permite cambiar a:
    - "Todos" (muestra Pendiente + En_proceso + Completado)
    - "Pendiente"
    - "En Proceso"
    - "Completado" (historial manual)

---

## 5️⃣ HISTORIAL DE REPORTES (historial.tsx)

### Datos Mostrados:
- ✅ **Cargados desde Backend**
  - Endpoint: `GET /mantenimientos/historial/mecanico`
  - Filtro automático: Solo reportes completados por ESTE mecánico
  - Ordenado: Más recientes primero

- ✅ **Información Mostrada**:
  - Cliente y vehículo
  - Trabajo realizado
  - Fechas de inicio/finalización
  - Costos (mano de obra + repuestos)
  - Fecha de envío del reporte

- ✅ **Funciones**:
  - Reenviar reporte a cliente: `POST /api/reportes/enviar/:solicitudId`
  - Ver detalles del mantenimiento
  - Exportar información

---

## 6️⃣ FLUJO VISUAL COMPLETO

```
MECÁNICO INICIA SESIÓN
    ↓
    Ve: Reportes Pendientes (Estado: Pendiente)
    ↓
ABRE SOLICITUD
    ↓
    Puede: Ver datos, Editar, Registrar Mantenimiento
    ↓
HACE CLIC EN "REGISTRAR MANTENIMIENTO"
    ↓
    Modal se abre con:
    - Foto del vehículo (puede capturar)
    - Diagnóstico
    - Trabajo realizado
    - Repuestos utilizados
    - Costos
    - Fechas (inicio/finalización)
    ↓
COMPLETA FORMULARIO
    ↓
    Sistema valida fechas
    ↓
HACE CLIC EN "GUARDAR"
    ↓
    Mantenimiento se registra en BD
    Solicitud.estado → "En_proceso"
    ↓
REGRESA AL PANEL DE REPORTES
    ↓
HACE CLIC EN "ENVIAR REPORTE"
    ↓
    Modal de confirmación muestra:
    - Datos cliente y vehículo
    - Resumen de trabajo
    - Costos totales
    ↓
HACE CLIC EN "CONFIRMAR"
    ↓
    Backend:
    1. Crea factura en sistema financiero
    2. Envía email al cliente con:
       - Foto del mecánico
       - Detalles del trabajo
       - Costos
       - Números de factura
    3. Actualiza: Solicitud.estado → "Completado"
    ↓
Frontend recibe respuesta exitosa
    ↓
    Modal de éxito muestra:
    - "Reporte enviado a {correoCliente}"
    ↓
CIERRA MODAL
    ↓
    Solicitudes se recargan
    ↓
REPORTE DESAPARECE DE "REPORTES PENDIENTES"
    ↓
APARECE EN "HISTORIAL"
    ↓
    Mecánico puede:
    - Ver detalles del trabajo completado
    - Reenviar reporte si cliente lo pide
```

---

## 7️⃣ INTEGRACIONES COMPLETADAS

### API Endpoints Utilizados:
| Endpoint | Método | Propósito |
|----------|--------|----------|
| `/api/solicitudes` | GET | Listar solicitudes del mecánico |
| `/api/mantenimientos` | POST | Crear registro de mantenimiento |
| `/api/mantenimientos/:id` | PUT | Actualizar mantenimiento |
| `/api/mantenimientos/historial/mecanico` | GET | Cargar historial completo |
| `/api/reportes/enviar/:solicitudId` | POST | **Enviar reporte por email** ⭐ |
| `/api/finanzas` | POST | Crear factura automática |

### Servicios Backend:
- ✅ `email.service.ts` - Envía reporte con foto del mecánico
- ✅ `reportes.controller.ts` - Maneja envío y actualización de estado
- ✅ `mantenimientos.controller.ts` - CRUD de registros
- ✅ `finanzas.controller.ts` - Crea facturas

### Contextos Frontend:
- ✅ `useAuth()` - Proporciona: token, user (nombres, apellidos, rol)
- ✅ `mantenimientosApi` - Cliente HTTP tipado
- ✅ `reportesApi` - Cliente HTTP tipado
- ✅ `finanzasApi` - Cliente HTTP tipado

---

## 8️⃣ CAMBIOS IMPLEMENTADOS ESTA SESIÓN

### Archivos Modificados:

#### `frontend/app/SeccionMecanico/modalesReporte/registroMantenimiento.tsx`
- ✅ Agregó captura de foto del vehículo (fotoVehiculo state)
- ✅ Agregó validación de fechas (isDateFinalizacionDisabled)
- ✅ Obtiene nombre del mecánico desde `useAuth()` (NO hardcodeado)
- ✅ Incluye fotoVehiculo en datos enviados al backend

#### `frontend/app/SeccionMecanico/ReportesClientes.tsx`
- ✅ Cambió filtro por defecto de 'TODOS' a 'Pendiente'
- ✅ Agrega recarga de solicitudes al cerrar modal de éxito
- ✅ Mantiene lista actualizada en tiempo real

#### `frontend/app/SeccionMecanico/modalReporteMatenimiento/confirmacionReporte.tsx`
- ✅ Importó `reportesApi`
- ✅ Agregó llamada a `reportesApi.enviar()` después de crear factura
- ✅ Integró email sending con el flujo de confirmación

---

## 9️⃣ REQUISITOS CUMPLIDOS

### Del Archivo de Sesión:
✅ "el boton de enviar resporte deberia enviar un resporte como una factura al corrreo"
- → `reportesApi.enviar()` llama endpoint backend que envía email

✅ "deberia tomar el nombre del mecanico dependiendo la cuenta q sea"
- → Obtiene de `user.nombres + user.apellidos` desde useAuth()

✅ "deberia enviarse con la respectiva imagen del mecnaico q esto esta configurado"
- → Email service incluye `mecanico.fotoPerfil` como attachment CID

✅ "esto tendria q desparecer de la ventana de reportes paara no dañar el flujo"
- → Filtro por defecto 'Pendiente' + recarga después de envío

✅ "quitar los iconos de maraca de respuesto y selecionar producto"
- → Stickers 1️⃣ 2️⃣ fueron removidos, UI usa colores de app

✅ "agregar un campo mas donde el mecanico pueda ingresar una foto del estado del veihiculo cuando lo recibe"
- → fotoVehiculo campo agregado a registroMantenimiento.tsx

---

## 🔟 CHECKLIST FINAL

- ✅ Photo capture integrada
- ✅ Mechanic name dinámico (no hardcoded)
- ✅ Email sending integrado (no simulado)
- ✅ Estado actualizado a "Completado"
- ✅ Reportes desaparecen del panel de pendientes
- ✅ Reportes aparecen en historial
- ✅ Facturas creadas automáticamente
- ✅ Sin errores de compilación TypeScript
- ✅ UI sin stickers/emojis innecesarios
- ✅ Filtros funcionando correctamente

---

## ⚠️ CONSIDERACIONES IMPORTANTES

1. **Foto del Mecánico en Email**:
   - Requiere que `Mecanico.fotoPerfil` esté poblado (no null)
   - Si es null, el email se envía pero sin foto inline
   - Recomendación: Completar tabla de fotoPerfil para todos los mecánicos

2. **Errores de Email**:
   - Si `.env` SMTP no está configurado, enviará error
   - Revisar backend logs si los emails no llegan

3. **Fotos del Vehículo**:
   - Se guardan en BD como base64
   - Para optimizar: considerar guardar en storage (CloudFront, S3) en futuros desarrollos

4. **Historial Filtrado**:
   - Solo muestra reportes completados POR ESTE MECÁNICO
   - No ve reportes de otros mecánicos (por seguridad)

---

## 📞 SOPORTE

Para verificar que todo funciona:
1. Inicia sesión como mecánico
2. Abre una solicitud pendiente
3. Hace clic en "REGISTRAR MANTENIMIENTO"
4. Captura foto del vehículo
5. Completa todos los campos
6. Hace clic en "GUARDAR"
7. Regresa al panel y hace clic en "ENVIAR REPORTE"
8. Confirma en el modal
9. Verifica que:
   - Email fue recibido por cliente
   - Reporte desapareció del panel
   - Reporte aparece en Historial
