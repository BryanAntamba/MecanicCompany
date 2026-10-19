// api.ts
// Utilidades para comunicarse con el backend de MecanicCompany.

import { API_URL } from '@/config';

// URL base del backend (importada desde config.ts)
export const BASE_URL = API_URL;

// ─── Tipo de error de API ─────────────────────────────────────────────────────
export interface ApiError {
    message: string;
    status: number;
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: object,
    token?: string,
): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const err: ApiError = {
                message: (data as any).message ?? 'Error del servidor',
                status: response.status,
            };
            throw err;
        }

        return data as T;
    } catch (err: any) {
        if (err?.name === 'AbortError') {
            throw { message: 'No se pudo conectar al servidor. Verifica tu red.', status: 0 } as ApiError;
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
}

// ─── API Auth ─────────────────────────────────────────────────────────────────

export interface LoginResponse {
    token: string;
    usuario: {
        id: string;
        nombres: string;
        apellidos: string;
        correoEmpresarial?: string;
        correo?: string;
        especialidad?: string;
        estadoLaboral?: string;
        rol: 'admin' | 'mecanico' | 'financiero' | 'inventario' | 'cliente';
        esAdmin?: boolean;
        tipoPersonal?: string;
    };
    // Mantener compatibilidad con versión anterior
    mecanico?: {
        id: string;
        nombres: string;
        apellidos: string;
        correoEmpresarial: string;
        especialidad: string;
        estadoLaboral: string;
        esAdmin: boolean;
        tipoPersonal?: string;
    };
}

export const authApi = {
    login: (correoEmpresarial: string, contrasena: string) =>
        request<LoginResponse>('POST', '/auth/login', { correoEmpresarial, contrasena }),

    // ── Recuperación de contraseña ────────────────────────────────────────────
    solicitarRecuperacion: (correo: string) =>
        request<{ message: string }>('POST', '/auth/recuperar', { correo }),

    reenviarCodigo: (correo: string) =>
        request<{ message: string; intentosRestantes: number; bloqueado?: boolean; tiempoRestante?: number }>('POST', '/auth/reenviar-codigo', { correo }),

    verificarEstadoReenvio: (correo: string) =>
        request<{ bloqueado: boolean; intentosRestantes: number; tiempoRestante: number }>('POST', '/auth/verificar-estado-reenvio', { correo }),

    verificarCodigo: (correo: string, codigo: string) =>
        request<{ message: string; resetToken: string }>('POST', '/auth/verificar-codigo', { correo, codigo }),

    cambiarPassword: (resetToken: string, nuevaContrasena: string) =>
        request<{ message: string }>('PUT', '/auth/cambiar-password', { resetToken, nuevaContrasena }),

    // ── Verificación de correo de clientes ────────────────────────────────────
    enviarCodigoCliente: (correo: string) =>
        request<{ message: string }>('POST', '/auth/enviar-codigo-cliente', { correo }),

    verificarCodigoCliente: (correo: string, codigo: string) =>
        request<{ verificado: boolean; correo: string }>('POST', '/auth/verificar-codigo-cliente', { correo, codigo }),
};

// ─── API Solicitudes ──────────────────────────────────────────────────────────

export interface CrearSolicitudBody {
    nombreCliente: string;
    telefono: string;
    correoCliente: string;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    kilometraje: number;
    tipoServicio: string;
    otroServicio?: string;
    descripcionProblema: string;
    fechaCita: string; // ISO string
    horaCita?: string;
    provincia?: string;
    ubicacionMecanicaId?: string;
    ubicacionMecanicaNombre?: string;
    ubicacionMecanicaDireccion?: string;
}

// Tipo que devuelve el backend al listar solicitudes
export interface SolicitudBackend {
    id: string;
    mecanicoId: string | null;
    nombreCliente: string;
    telefono: string;
    correoCliente: string;
    marca: string;
    modelo: string;
    anio: string;
    placa: string;
    kilometraje: string;
    tipoServicio: string;
    otroServicio: string;
    descripcionProblema: string;
    fechaCita: string;
    horaCita: string;
    estado: string;
    createdAt: string;
    mecanico: {
        id: string;
        nombres: string;
        apellidos: string;
    } | null;
    mantenimiento: {
        id: string;
        marca: string;
        modelo: string;
        placa: string;
        año: string;
        kilometraje: string;
        fechaServicio: string;
        mecanicoAsignado: string;
        diagnostico: string;
        trabajoRealizado: string;
        otroTrabajo: string;
        repuestosUtilizados: string; // JSON string de repuestos
        diagnosticoRealizado: string;
        costoManoObra: number;
        costoRepuestos: number;
        observaciones: string;
        fechaInicio: string;
        fechaFinalizacion: string;
    } | null;
}

export interface ActualizarSolicitudBody {
    nombreCliente: string;
    telefono: string;
    correoCliente: string;
    marca: string;
    modelo: string;
    anio: string;
    placa: string;
    kilometraje: string;
    tipoServicio: string;
    otroServicio: string;
    descripcionProblema: string;
    fechaCita: string;
    horaCita: string;
}

export const solicitudesApi = {
    crear: (body: CrearSolicitudBody) =>
        request<{ id: string }>('POST', '/solicitudes', body),

    listar: (token: string) =>
        request<SolicitudBackend[]>('GET', '/solicitudes', undefined, token),

    actualizar: (id: string, body: ActualizarSolicitudBody, token: string) =>
        request<SolicitudBackend>('PUT', `/solicitudes/${id}`, body, token),

    eliminar: (id: string, token: string) =>
        request<{ message: string }>('DELETE', `/solicitudes/${id}`, undefined, token),
};

// ─── API Mecánicos (admin) ────────────────────────────────────────────────────

export interface Mecanico {
    id: string;
    nombres: string;
    apellidos: string;
    edad: number;
    correo: string;
    correoEmpresarial: string;
    especialidad: string;
    anosExperiencia: number;
    estadoLaboral: string;
    cuentaActiva: boolean;
    createdAt: string;
}

export interface CrearMecanicoBody {
    nombres: string;
    apellidos: string;
    edad: number;
    correo: string;
    correoEmpresarial: string;
    contrasena: string;
    especialidad: string;
    anosExperiencia: number;
}

export const mecanicosApi = {
    listar: (token: string) =>
        request<Mecanico[]>('GET', '/mecanicos', undefined, token),

    crear: (body: CrearMecanicoBody, token: string) =>
        request<Mecanico>('POST', '/mecanicos', body, token),

    actualizar: (id: string, body: Partial<CrearMecanicoBody>, token: string) =>
        request<Mecanico>('PUT', `/mecanicos/${id}`, body, token),

    eliminar: (id: string, token: string) =>
        request<{ message: string }>('DELETE', `/mecanicos/${id}`, undefined, token),

    cambiarEstado: (id: string, estadoLaboral: string, token: string) =>
        request<Mecanico>('PATCH', `/mecanicos/${id}/estado`, { estadoLaboral }, token),
};

// ─── API Mantenimientos ───────────────────────────────────────────────────────

export interface CrearMantenimientoBody {
    solicitudId: string;
    marca: string;
    modelo: string;
    placa: string;
    mecanicoAsignado: string;
    diagnostico: string;
    trabajoRealizado: string;
    otroTrabajo: string;
    repuestosUtilizados: string;
    diagnosticoRealizado: string;
    observaciones: string;
    costoManoObra: string;
    costoRepuestos: string;
    fechaServicio: string;
    fechaInicio: string;
    fechaFinalizacion: string;
    fotoVehiculo?: string | null;  // Foto en base64
}

export const mantenimientosApi = {
    crear: (body: CrearMantenimientoBody, token: string) =>
        request<{ id: string }>('POST', '/mantenimientos', body, token),

    actualizar: (id: string, body: Partial<CrearMantenimientoBody>, token: string) =>
        request<{ id: string }>('PUT', `/mantenimientos/${id}`, body, token),

    obtenerHistorial: (token: string) =>
        request<{ message: string; historial: any[] }>('GET', '/mantenimientos/historial/mecanico', undefined, token),
};

// ─── API Reportes ──────────────────────────────────────────────────────────────

export const reportesApi = {
    // Envía el reporte al correo del cliente y marca la solicitud como Completado
    enviar: (solicitudId: string, token: string) =>
        request<{ message: string }>('POST', `/reportes/enviar/${solicitudId}`, undefined, token),
};

// ─── API Reportes de Soporte ───────────────────────────────────────────────────

export interface CrearReporteSoporteBody {
    nombre: string;
    segundoNombre?: string;
    apellido: string;
    segundoApellido?: string;
    correo: string;
    tipoAsunto: string;
    descripcion: string;
}

export const reporteSoporteApi = {
    crear: (body: CrearReporteSoporteBody) =>
        request<{ message: string; id: string }>('POST', '/reportes-soporte', body),

    listar: (token: string) =>
        request<any[]>('GET', '/reportes-soporte', undefined, token),
};

// ─── API Productos (Inventario) ────────────────────────────────────────────────

export interface CompatibilidadProducto {
    id: string;
    marca: string;
    modelo: string;
    anoDesde: number;
    anoHasta: number;
}

export interface Producto {
    id: string;
    nombreProducto: string;
    codigoSKU: string;
    marcaComponente: string;
    categoria: string;
    numeroParteOEM: string;
    descripcion: string;
    stockActual: number;
    stockMinimo: number;
    stockCritico: number;
    precioCompra: number;
    precioVenta: number;
    ubicacion: string;
    unidadMedida: string;
    compatibilidades: CompatibilidadProducto[];
    createdAt: string;
    updatedAt: string;
}

export interface CrearProductoBody {
    nombreProducto: string;
    codigoSKU: string;
    marcaComponente: string;
    categoria: string;
    numeroParteOEM?: string;
    descripcion: string;
    stockActual: number;
    stockMinimo: number;
    stockCritico: number;
    precioCompra: number;
    precioVenta: number;
    ubicacion: string;
    unidadMedida: string;
    compatibilidades: Array<{
        marca: string;
        modelo: string;
        anoDesde: number;
        anoHasta: number;
    }>;
}

export const productosApi = {
    crear: (body: CrearProductoBody, token: string) =>
        request<{ message: string; producto: Producto }>('POST', '/productos', body, token),

    listar: () =>
        request<{ message: string; cantidad: number; productos: Producto[] }>('GET', '/productos'),

    obtenerPorId: (id: string) =>
        request<{ message: string; producto: Producto }>('GET', `/productos/${id}`),

    actualizar: (id: string, body: Partial<CrearProductoBody>, token: string) =>
        request<{ message: string; producto: Producto }>('PUT', `/productos/${id}`, body, token),

    eliminar: (id: string, token: string) =>
        request<{ message: string; productoEliminado: { id: string; nombreProducto: string } }>('DELETE', `/productos/${id}`, undefined, token),
};

// ─── API Finanzas ─────────────────────────────────────────────────────────────

export interface Finanzas {
    id: string;
    numeroFactura: string;
    mantenimientoId: string;
    clienteNombre: string;
    clienteTelefono: string;
    clienteCorreo: string;
    vehiculo: string;
    marca: string;
    modelo: string;
    placa: string;
    anio: string;
    kilometraje: string;
    servicio: string;
    mecanico: string;
    costoManoObra: number;
    costoRepuestos: number;
    total: number;
    estado: 'Pendiente' | 'Pagado' | 'Cancelado';
    metodoPago?: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'OTRO';
    fechaPago?: string;
    observacion?: string;
    comprobanteUri?: string;
    fechaFactura: string;
    createdAt: string;
    updatedAt: string;
}

export interface CrearFinanzasBody {
    mantenimientoId: string;
    clienteNombre: string;
    clienteTelefono: string;
    clienteCorreo: string;
    vehiculo: string;
    marca: string;
    modelo: string;
    placa: string;
    anio: string;
    kilometraje: string;
    servicio: string;
    mecanico: string;
    costoManoObra: number;
    costoRepuestos: number;
}

export interface ActualizarFinanzasBody {
    estado?: 'Pendiente' | 'Pagado' | 'Cancelado';
    metodoPago?: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'OTRO';
    fechaPago?: string;
    observacion?: string;
    comprobanteUri?: string;
}

export interface EstadisticasFinanzas {
    ingresosMes: number;
    costoRepuestosMes: number;
    utilidadNeta: number;
    serviciosCompletados: number;
    serviciosPendientes: number;
}

export const finanzasApi = {
    listar: (estado?: string, clienteNombre?: string, fechaDesde?: string, fechaHasta?: string, token?: string) => {
        let path = '/finanzas';
        const params = new URLSearchParams();
        
        if (estado) params.append('estado', estado);
        if (clienteNombre) params.append('clienteNombre', clienteNombre);
        if (fechaDesde) params.append('fechaDesde', fechaDesde);
        if (fechaHasta) params.append('fechaHasta', fechaHasta);
        
        if (params.toString()) path += `?${params.toString()}`;
        
        return request<{ message: string; cantidad: number; pagos: Finanzas[] }>('GET', path, undefined, token);
    },

    obtenerPorId: (id: string) =>
        request<{ message: string; pago: Finanzas }>('GET', `/finanzas/${id}`),

    crear: (body: CrearFinanzasBody, token: string) =>
        request<{ message: string; pago: Finanzas }>('POST', '/finanzas', body, token),

    actualizar: (id: string, body: ActualizarFinanzasBody, token: string) =>
        request<{ message: string; pago: Finanzas }>('PUT', `/finanzas/${id}`, body, token),

    eliminar: (id: string, token: string) =>
        request<{ message: string; pago: Finanzas }>('DELETE', `/finanzas/${id}`, undefined, token),

    obtenerEstadisticas: () =>
        request<{ message: string; estadisticas: EstadisticasFinanzas }>('GET', '/finanzas/estadisticas/resumen'),

    obtenerEstadisticasPagados: () =>
        request<{ message: string; pagosRealizados: { numeroPagos: number; totalCancelado: number } }>('GET', '/finanzas/estadisticas/pagados'),
};
