// api.ts
// Utilidades para comunicarse con el backend de MecanicCompany.
//
// ⚠️  URL base:
//   - iOS simulator  → localhost funciona directamente
//   - Android emulator → cambia por http://10.0.2.2:3000/api
//   - Dispositivo real → usa la IP local del PC, p. ej. http://192.168.1.X:3000/api

import Constants from 'expo-constants';

function getBaseUrl(): string {
  // En Expo Go, hostUri tiene la forma "192.168.X.X:8081"
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api`;
  }
  return 'http://localhost:3000/api';
}

export const BASE_URL = getBaseUrl();

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
    mecanico: {
        id: string;
        nombres: string;
        apellidos: string;
        correoEmpresarial: string;
        especialidad: string;
        estadoLaboral: string;
        esAdmin: boolean;
    };
}

export const authApi = {
    login: (correoEmpresarial: string, contrasena: string) =>
        request<LoginResponse>('POST', '/auth/login', { correoEmpresarial, contrasena }),

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
    descripcionProblema: string;
    fechaCita: string; // ISO string
    horaCita?: string;
}

export interface MantenimientoBackend {
    id: string;
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
    costoManoObra: string | number;
    costoRepuestos: string | number;
    observaciones: string;
    fechaServicio: string;
    fechaInicio: string;
    fechaFinalizacion: string;
}

export interface SolicitudBackend {
    id: string;
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
    estado: 'Pendiente' | 'En_proceso' | 'Completado';
    mantenimiento: MantenimientoBackend | null;
}

export interface ActualizarSolicitudBody {
    nombreCliente?: string;
    telefono?: string;
    correoCliente?: string;
    marca?: string;
    modelo?: string;
    anio?: string;
    placa?: string;
    kilometraje?: string;
    tipoServicio?: string;
    otroServicio?: string;
    descripcionProblema?: string;
    fechaCita?: string;
    horaCita?: string;
    estado?: string;
}

export const solicitudesApi = {
    crear: (body: CrearSolicitudBody) =>
        request<{ id: string }>('POST', '/solicitudes', body),

    listar: (token: string) =>
        request<SolicitudBackend[]>('GET', '/solicitudes', undefined, token),

    actualizar: (id: string, body: ActualizarSolicitudBody, token: string) =>
        request<SolicitudBackend>('PUT', `/solicitudes/${id}`, body, token),
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
    otroTrabajo?: string;
    repuestosUtilizados: string;
    diagnosticoRealizado: string;
    observaciones: string;
    costoManoObra: string;
    costoRepuestos: string;
    fechaServicio: string;
    fechaInicio: string;
    fechaFinalizacion: string;
}

export const mantenimientosApi = {
    crear: (body: CrearMantenimientoBody, token: string) =>
        request<MantenimientoBackend>('POST', '/mantenimientos', body, token),

    actualizar: (id: string, body: Partial<CrearMantenimientoBody> & { estadoSolicitud?: string }, token: string) =>
        request<MantenimientoBackend>('PUT', `/mantenimientos/${id}`, body, token),
};
