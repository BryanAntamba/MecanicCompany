// datosSimulados.ts
// Almacén temporal de usuarios registrados para simular backend
// En producción, esto se manejará con API real

export interface UsuarioRegistrado {
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido?: string;
  fechaNacimiento: Date;
  telefono: string;
  correo: string;
  contrasena: string;
}

// Lista de usuarios registrados (simulación de base de datos)
const usuariosRegistrados: UsuarioRegistrado[] = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    fechaNacimiento: new Date(1995, 5, 15),
    telefono: '0987654321',
    correo: 'juan.perez@gmail.com',
    contrasena: 'password123',
  },
  {
    nombre: 'María',
    segundoNombre: 'Elena',
    apellido: 'González',
    segundoApellido: 'Martínez',
    fechaNacimiento: new Date(1990, 8, 20),
    telefono: '0998765432',
    correo: 'maria.gonzalez@gmail.com',
    contrasena: 'maria2024',
  },
  {
    nombre: 'Carlos',
    apellido: 'Ramírez',
    fechaNacimiento: new Date(1988, 3, 10),
    telefono: '0976543210',
    correo: 'carlos.ramirez@gmail.com',
    contrasena: 'carlos123',
  },
  {
    nombre: 'Ana',
    segundoNombre: 'Sofía',
    apellido: 'López',
    fechaNacimiento: new Date(1992, 11, 5),
    telefono: '0965432109',
    correo: 'ana.lopez@gmail.com',
    contrasena: 'ana2024pass',
  },
  {
    nombre: 'Luis',
    apellido: 'Torres',
    segundoApellido: 'Mora',
    fechaNacimiento: new Date(1985, 6, 25),
    telefono: '0954321098',
    correo: 'luis.torres@gmail.com',
    contrasena: 'luis12345',
  },
];

// Función para agregar un nuevo usuario
export const agregarUsuario = (usuario: UsuarioRegistrado): void => {
  usuariosRegistrados.push(usuario);
};

// Función para verificar si un usuario existe por correo y contraseña
export const verificarUsuario = (correo: string, contrasena: string): UsuarioRegistrado | null => {
  const usuario = usuariosRegistrados.find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.contrasena === contrasena
  );
  return usuario || null;
};

// Función para verificar si un correo ya está registrado
export const correoYaRegistrado = (correo: string): boolean => {
  return usuariosRegistrados.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
};

// Función para obtener todos los usuarios (solo para debug)
export const obtenerUsuarios = (): UsuarioRegistrado[] => {
  return usuariosRegistrados;
};

// Función para buscar usuario por correo (para restablecimiento de contraseña)
export const buscarUsuarioPorCorreo = (correo: string): UsuarioRegistrado | null => {
  return usuariosRegistrados.find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
};

// Función para actualizar contraseña de un usuario
export const actualizarContrasena = (correo: string, nuevaContrasena: string): boolean => {
  const usuario = usuariosRegistrados.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
  if (usuario) {
    usuario.contrasena = nuevaContrasena;
    return true;
  }
  return false;
};

// ─── SISTEMA DE LÍMITE DE REENVÍOS ───────────────────────────────────────────
// Almacena el estado de reenvíos por correo (simulación de backend)
interface EstadoReenvio {
  correo: string;
  intentosRestantes: number;
  bloqueado: boolean;
  tiempoBloqueoInicio?: number; // timestamp en ms
}

const estadosReenvio: Map<string, EstadoReenvio> = new Map();

// Función para obtener el estado de reenvío de un correo
export const obtenerEstadoReenvio = (correo: string): EstadoReenvio => {
  const correoLower = correo.toLowerCase();
  let estado = estadosReenvio.get(correoLower);
  
  if (!estado) {
    // Crear nuevo estado para este correo
    estado = {
      correo: correoLower,
      intentosRestantes: 5,
      bloqueado: false,
    };
    estadosReenvio.set(correoLower, estado);
  } else if (estado.bloqueado && estado.tiempoBloqueoInicio) {
    // Verificar si ya pasaron los 15 minutos (900000 ms)
    const tiempoTranscurrido = Date.now() - estado.tiempoBloqueoInicio;
    if (tiempoTranscurrido >= 900000) {
      // Desbloquear y resetear intentos
      estado.bloqueado = false;
      estado.intentosRestantes = 5;
      estado.tiempoBloqueoInicio = undefined;
    }
  }
  
  return estado;
};

// Función para calcular tiempo restante de bloqueo en segundos
export const obtenerTiempoRestanteBloqueo = (correo: string): number => {
  const estado = obtenerEstadoReenvio(correo);
  
  if (!estado.bloqueado || !estado.tiempoBloqueoInicio) {
    return 0;
  }
  
  const tiempoTranscurrido = Date.now() - estado.tiempoBloqueoInicio;
  const tiempoRestanteMs = 900000 - tiempoTranscurrido; // 15 minutos = 900000 ms
  
  return Math.max(0, Math.ceil(tiempoRestanteMs / 1000)); // Convertir a segundos
};

// Función para reenviar código (simula consumir un intento)
export const reenviarCodigoVerificacion = (correo: string): { 
  exito: boolean; 
  intentosRestantes: number; 
  bloqueado: boolean; 
  tiempoRestante: number;
} => {
  const estado = obtenerEstadoReenvio(correo);
  
  // Si está bloqueado, no permitir reenvío
  if (estado.bloqueado) {
    return {
      exito: false,
      intentosRestantes: 0,
      bloqueado: true,
      tiempoRestante: obtenerTiempoRestanteBloqueo(correo),
    };
  }
  
  // Restar un intento
  estado.intentosRestantes--;
  
  // Si se agotaron los intentos, bloquear por 15 minutos
  if (estado.intentosRestantes <= 0) {
    estado.bloqueado = true;
    estado.tiempoBloqueoInicio = Date.now();
    estado.intentosRestantes = 0;
  }
  
  return {
    exito: true,
    intentosRestantes: estado.intentosRestantes,
    bloqueado: estado.bloqueado,
    tiempoRestante: estado.bloqueado ? 900 : 0, // 15 minutos en segundos
  };
};

// Interfaz para las ubicaciones de las mecánicas
export interface UbicacionMecanica {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

// Lista de 10 ubicaciones de mecánicas en Quito, Pichincha
export const ubicacionesMecanicas: UbicacionMecanica[] = [
  {
    id: '1',
    nombre: 'Mecanic Company - Centro Histórico',
    direccion: 'Calle García Moreno N5-49 y Sucre, Centro Histórico, Quito',
    latitud: -0.2201641,
    longitud: -78.5123274,
  },
  {
    id: '2',
    nombre: 'Mecanic Company - La Carolina',
    direccion: 'Av. Amazonas N37-29 y Juan Pablo Sanz, La Carolina, Quito',
    latitud: -0.1806532,
    longitud: -78.4863119,
  },
  {
    id: '3',
    nombre: 'Mecanic Company - Cumbayá',
    direccion: 'Av. Interoceánica Km 12.5, Cumbayá, Quito',
    latitud: -0.2005285,
    longitud: -78.4345625,
  },
  {
    id: '4',
    nombre: 'Mecanic Company - El Inca',
    direccion: 'Av. De los Shyris N34-154 y El Inca, Quito',
    latitud: -0.1638889,
    longitud: -78.4747222,
  },
  {
    id: '5',
    nombre: 'Mecanic Company - Quitumbe',
    direccion: 'Av. Maldonado S38-155 y Quitumbe, Quito',
    latitud: -0.2888889,
    longitud: -78.5513889,
  },
  {
    id: '6',
    nombre: 'Mecanic Company - Calderón',
    direccion: 'Panamericana Norte Km 14, Calderón, Quito',
    latitud: -0.1019444,
    longitud: -78.4344444,
  },
  {
    id: '7',
    nombre: 'Mecanic Company - Tumbaco',
    direccion: 'Ruta Viva Km 8, Tumbaco, Quito',
    latitud: -0.2125000,
    longitud: -78.3991667,
  },
  {
    id: '8',
    nombre: 'Mecanic Company - La Mariscal',
    direccion: 'Av. 6 de Diciembre N24-253 y Wilson, La Mariscal, Quito',
    latitud: -0.2005285,
    longitud: -78.4863119,
  },
  {
    id: '9',
    nombre: 'Mecanic Company - San Rafael',
    direccion: 'Av. 6 de Diciembre N33-42 y Bosmediano, San Rafael, Quito',
    latitud: -0.1716667,
    longitud: -78.4813889,
  },
  {
    id: '10',
    nombre: 'Mecanic Company - Guamaní',
    direccion: 'Av. Mariscal Sucre S50-234, Guamaní, Quito',
    latitud: -0.3238889,
    longitud: -78.5572222,
  },
];

// Interfaz para solicitudes de mantenimiento
export interface SolicitudMantenimiento {
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
  descripcionProblema: string;
  fechaCita: string;
  horaCita: string;
  estado: 'Pendiente' | 'En_proceso' | 'Completado';
  createdAt: string;
  // Nuevos campos: Provincia y Ubicación de Mecánica
  provincia?: string;
  ubicacionMecanicaId?: string;
  ubicacionMecanicaNombre?: string;
  ubicacionMecanicaDireccion?: string;
  // Campos del reporte de mantenimiento completo
  fechaServicio?: string;
  mecanicoAsignado?: string;
  diagnostico?: string;
  trabajoRealizado?: string;
  otroTrabajo?: string;
  repuestosUtilizados?: string;
  diagnosticoRealizado?: string;
  costoManoObra?: string;
  costoRepuestos?: string;
  observaciones?: string;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  costoTotal?: string;
}

// Lista de solicitudes simuladas (todas en estado Pendiente)
export const solicitudesSimuladas: SolicitudMantenimiento[] = [
  {
    id: '1',
    nombreCliente: 'Carlos Alberto Méndez',
    telefono: '0987654321',
    correoCliente: 'carlos.mendez@gmail.com',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: '2018',
    placa: 'PBX-1234',
    kilometraje: '85000',
    tipoServicio: 'Mantenimiento preventivo',
    descripcionProblema: 'Revisión general y cambio de aceite',
    fechaCita: '15/01/2027',
    horaCita: '09:00',
    estado: 'Pendiente',
    createdAt: '2027-01-10T08:30:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-1',
    ubicacionMecanicaNombre: 'Mecanic Company Quito Norte',
    ubicacionMecanicaDireccion: 'Av. Río Coca E10-100 y Isla Pinzón, Quito',
  },
  {
    id: '2',
    nombreCliente: 'María Fernanda López García',
    telefono: '0998765432',
    correoCliente: 'maria.lopez@gmail.com',
    marca: 'Chevrolet',
    modelo: 'Sail',
    anio: '2019',
    placa: 'PCX-5678',
    kilometraje: '62000',
    tipoServicio: 'Reparación',
    descripcionProblema: 'Ruido extraño en el motor al acelerar',
    fechaCita: '16/01/2027',
    horaCita: '10:30',
    estado: 'Pendiente',
    createdAt: '2027-01-11T09:15:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-2',
    ubicacionMecanicaNombre: 'Taller La Carolina',
    ubicacionMecanicaDireccion: 'Av. Amazonas N24-155 y Av. Colón, Quito',
  },
  {
    id: '3',
    nombreCliente: 'Juan Pablo Rodríguez',
    telefono: '0976543210',
    correoCliente: 'juan.rodriguez@gmail.com',
    marca: 'Hyundai',
    modelo: 'Accent',
    anio: '2020',
    placa: 'PDX-9012',
    kilometraje: '45000',
    tipoServicio: 'Diagnóstico',
    descripcionProblema: 'Luz del check engine encendida',
    fechaCita: '17/01/2027',
    horaCita: '14:00',
    estado: 'Pendiente',
    createdAt: '2027-01-12T10:45:00Z',
    provincia: 'Guayas',
    ubicacionMecanicaId: 'guayas-1',
    ubicacionMecanicaNombre: 'Mecánica Guayaquil Norte',
    ubicacionMecanicaDireccion: 'Av. Francisco de Orellana Mz 111, Guayaquil',
  },
  {
    id: '4',
    nombreCliente: 'Ana Cristina Vega Morales',
    telefono: '0965432109',
    correoCliente: 'ana.vega@gmail.com',
    marca: 'Kia',
    modelo: 'Rio',
    anio: '2017',
    placa: 'PEX-3456',
    kilometraje: '98000',
    tipoServicio: 'Mantenimiento correctivo',
    descripcionProblema: 'Frenos hacen ruido al frenar',
    fechaCita: '18/01/2027',
    horaCita: '11:00',
    estado: 'Pendiente',
    createdAt: '2027-01-13T11:20:00Z',
    provincia: 'Azuay',
    ubicacionMecanicaId: 'azuay-1',
    ubicacionMecanicaNombre: 'Mecánica Automotriz Cuenca Centro',
    ubicacionMecanicaDireccion: 'Av. Huayna Cápac y Av. Loja, Cuenca',
  },
  {
    id: '5',
    nombreCliente: 'Luis Enrique Torres',
    telefono: '0954321098',
    correoCliente: 'luis.torres@gmail.com',
    marca: 'Nissan',
    modelo: 'Versa',
    anio: '2021',
    placa: 'PFX-7890',
    kilometraje: '28000',
    tipoServicio: 'Revisión',
    descripcionProblema: 'Vibración al conducir a alta velocidad',
    fechaCita: '19/01/2027',
    horaCita: '15:30',
    estado: 'Pendiente',
    createdAt: '2027-01-14T12:00:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-3',
    ubicacionMecanicaNombre: 'AutoService Cumbayá',
    ubicacionMecanicaDireccion: 'Av. Interoceánica Km 12.5, Cumbayá',
  },
  {
    id: '6',
    nombreCliente: 'Patricia Isabel Romero',
    telefono: '0943210987',
    correoCliente: 'patricia.romero@gmail.com',
    marca: 'Mazda',
    modelo: '3',
    anio: '2019',
    placa: 'PGX-2345',
    kilometraje: '71000',
    tipoServicio: 'Mantenimiento preventivo',
    descripcionProblema: 'Cambio de filtros y revisión de suspensión',
    fechaCita: '20/01/2027',
    horaCita: '08:30',
    estado: 'Pendiente',
    createdAt: '2027-01-15T13:30:00Z',
    provincia: 'Tungurahua',
    ubicacionMecanicaId: 'tungurahua-1',
    ubicacionMecanicaNombre: 'Mecánica Ambato Centro',
    ubicacionMecanicaDireccion: 'Av. Cevallos 10-45, Ambato',
  },
  {
    id: '7',
    nombreCliente: 'Diego Alejandro Castillo Pérez',
    telefono: '0932109876',
    correoCliente: 'diego.castillo@gmail.com',
    marca: 'Ford',
    modelo: 'Fiesta',
    anio: '2016',
    placa: 'PHX-6789',
    kilometraje: '125000',
    tipoServicio: 'Reparación',
    descripcionProblema: 'No enciende el aire acondicionado',
    fechaCita: '21/01/2027',
    horaCita: '13:00',
    estado: 'Pendiente',
    createdAt: '2027-01-16T14:15:00Z',
    provincia: 'Manabí',
    ubicacionMecanicaId: 'manabi-1',
    ubicacionMecanicaNombre: 'Mecánica Portoviejo Centro',
    ubicacionMecanicaDireccion: 'Av. Universitaria y Av. Manabí, Portoviejo',
  },
  {
    id: '8',
    nombreCliente: 'Sofía Valentina Mora',
    telefono: '0921098765',
    correoCliente: 'sofia.mora@gmail.com',
    marca: 'Volkswagen',
    modelo: 'Gol',
    anio: '2018',
    placa: 'PIX-0123',
    kilometraje: '89000',
    tipoServicio: 'Diagnóstico',
    descripcionProblema: 'Batería se descarga rápidamente',
    fechaCita: '22/01/2027',
    horaCita: '09:30',
    estado: 'Pendiente',
    createdAt: '2027-01-17T15:00:00Z',
    provincia: 'El Oro',
    ubicacionMecanicaId: 'eloro-1',
    ubicacionMecanicaNombre: 'Mecánica Machala Centro',
    ubicacionMecanicaDireccion: 'Av. 25 de Junio y Av. Buenavista, Machala',
  },
  // SOLICITUDES COMPLETADAS PARA HISTORIAL
  {
    id: '9',
    nombreCliente: 'Roberto Carlos Mendoza Silva',
    telefono: '0987123456',
    correoCliente: 'roberto.mendoza@gmail.com',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: '2019',
    placa: 'PJX-4567',
    kilometraje: '75000',
    tipoServicio: 'Mantenimiento correctivo',
    descripcionProblema: 'Sistema de frenos desgastado',
    fechaCita: '10/01/2027',
    horaCita: '10:00',
    estado: 'Completado',
    createdAt: '2027-01-05T08:00:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-1',
    ubicacionMecanicaNombre: 'Mecanic Company Quito Norte',
    ubicacionMecanicaDireccion: 'Av. Río Coca E10-100 y Isla Pinzón, Quito',
    fechaServicio: '10/01/2027',
    mecanicoAsignado: 'Ing. Fernando Ramírez',
    diagnostico: 'Desgaste severo de pastillas y discos de freno delanteros y traseros',
    trabajoRealizado: 'Revisión de frenos',
    repuestosUtilizados: 'Pastillas de freno delanteras ($180.00), Pastillas de freno traseras ($120.00), Discos de freno delanteros ($85.00)',
    diagnosticoRealizado: 'Se realizó el cambio completo del sistema de frenos delanteros y traseros. Se verificó el sistema hidráulico y se purgó el líquido de frenos. Sistema funcionando correctamente.',
    costoManoObra: '120.00',
    costoRepuestos: '385.00',
    observaciones: 'Se recomienda revisar el sistema de frenos cada 10,000 km. Evitar frenadas bruscas durante los primeros 200 km.',
    fechaInicio: '10/01/2027',
    fechaFinalizacion: '10/01/2027',
    costoTotal: '505.00',
  },
  {
    id: '10',
    nombreCliente: 'Andrea Paola Jiménez Ortiz',
    telefono: '0998234567',
    correoCliente: 'andrea.jimenez@gmail.com',
    marca: 'Chevrolet',
    modelo: 'Spark',
    anio: '2020',
    placa: 'PKX-8901',
    kilometraje: '42000',
    tipoServicio: 'Mantenimiento preventivo',
    descripcionProblema: 'Mantenimiento de los 40,000 km',
    fechaCita: '12/01/2027',
    horaCita: '14:00',
    estado: 'Completado',
    createdAt: '2027-01-08T09:30:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-2',
    ubicacionMecanicaNombre: 'Taller La Carolina',
    ubicacionMecanicaDireccion: 'Av. Amazonas N24-155 y Av. Colón, Quito',
    fechaServicio: '12/01/2027',
    mecanicoAsignado: 'Téc. Mario González',
    diagnostico: 'Mantenimiento programado según manual del fabricante',
    trabajoRealizado: 'Cambio de aceite',
    repuestosUtilizados: 'Aceite sintético 5W-30 4L ($45.00), Filtro de aceite ($12.00), Filtro de aire ($15.00), Filtro de cabina ($13.00)',
    diagnosticoRealizado: 'Se realizó cambio de aceite y filtros según especificaciones del fabricante. Se revisó sistema de suspensión, dirección y frenos. Todo en perfecto estado.',
    costoManoObra: '45.00',
    costoRepuestos: '85.00',
    observaciones: 'Próximo mantenimiento a los 50,000 km o en 6 meses. El vehículo se encuentra en excelente estado.',
    fechaInicio: '12/01/2027',
    fechaFinalizacion: '12/01/2027',
    costoTotal: '130.00',
  },
  {
    id: '11',
    nombreCliente: 'Miguel Ángel Vargas Ruiz',
    telefono: '0976345678',
    correoCliente: 'miguel.vargas@gmail.com',
    marca: 'Nissan',
    modelo: 'Sentra',
    anio: '2018',
    placa: 'PLX-2345',
    kilometraje: '92000',
    tipoServicio: 'Reparación',
    descripcionProblema: 'Motor sobrecalentado',
    fechaCita: '14/01/2027',
    horaCita: '08:30',
    estado: 'Completado',
    createdAt: '2027-01-09T10:15:00Z',
    provincia: 'Guayas',
    ubicacionMecanicaId: 'guayas-1',
    ubicacionMecanicaNombre: 'Mecánica Guayaquil Norte',
    ubicacionMecanicaDireccion: 'Av. Francisco de Orellana Mz 111, Guayaquil',
    fechaServicio: '14/01/2027',
    mecanicoAsignado: 'Ing. Carlos Montoya',
    diagnostico: 'Fuga en sistema de refrigeración. Termostato defectuoso.',
    trabajoRealizado: 'Revisión de motor',
    repuestosUtilizados: 'Termostato ($35.00), Manguera de radiador superior ($45.00), Manguera de radiador inferior ($40.00), Refrigerante 2 galones ($25.00)',
    diagnosticoRealizado: 'Se identificó fuga en mangueras del radiador y termostato dañado. Se realizó el cambio completo del sistema de refrigeración. Se verificó bomba de agua y radiador en buen estado. Sistema funcionando correctamente a temperatura óptima.',
    costoManoObra: '95.00',
    costoRepuestos: '145.00',
    observaciones: 'Se recomienda verificar nivel de refrigerante semanalmente durante el primer mes. No presentar fugas. Evitar conducir con temperatura alta.',
    fechaInicio: '14/01/2027',
    fechaFinalizacion: '14/01/2027',
    costoTotal: '240.00',
  },
  {
    id: '12',
    nombreCliente: 'Laura Melissa Cordero Vega',
    telefono: '0965456789',
    correoCliente: 'laura.cordero@gmail.com',
    marca: 'Mazda',
    modelo: 'CX-5',
    anio: '2021',
    placa: 'PMX-6789',
    kilometraje: '35000',
    tipoServicio: 'Diagnóstico',
    descripcionProblema: 'Luz del ABS encendida',
    fechaCita: '16/01/2027',
    horaCita: '11:30',
    estado: 'Completado',
    createdAt: '2027-01-11T11:45:00Z',
    provincia: 'Azuay',
    ubicacionMecanicaId: 'azuay-1',
    ubicacionMecanicaNombre: 'Mecánica Automotriz Cuenca Centro',
    ubicacionMecanicaDireccion: 'Av. Huayna Cápac y Av. Loja, Cuenca',
    fechaServicio: '16/01/2027',
    mecanicoAsignado: 'Ing. Pedro Maldonado',
    diagnostico: 'Sensor de velocidad de rueda trasera izquierda con falla',
    trabajoRealizado: 'Diagnóstico computarizado',
    repuestosUtilizados: 'Sensor ABS trasero izquierdo ($125.00)',
    diagnosticoRealizado: 'Se realizó escaneo completo del sistema ABS. Se identificó sensor de velocidad defectuoso en rueda trasera izquierda. Se procedió al cambio del sensor. Se borró códigos de error y se verificó correcto funcionamiento del sistema.',
    costoManoObra: '60.00',
    costoRepuestos: '125.00',
    observaciones: 'Sistema ABS funcionando correctamente. Se recomienda evitar conducir a alta velocidad en carreteras destapadas.',
    fechaInicio: '16/01/2027',
    fechaFinalizacion: '16/01/2027',
    costoTotal: '185.00',
  },
  {
    id: '13',
    nombreCliente: 'Fernando José Paredes Castro',
    telefono: '0954567890',
    correoCliente: 'fernando.paredes@gmail.com',
    marca: 'Hyundai',
    modelo: 'Tucson',
    anio: '2019',
    placa: 'PNX-0123',
    kilometraje: '68000',
    tipoServicio: 'Alineación y balanceo',
    descripcionProblema: 'Vehículo se desvía hacia la derecha',
    fechaCita: '18/01/2027',
    horaCita: '15:00',
    estado: 'Completado',
    createdAt: '2027-01-13T12:30:00Z',
    provincia: 'Pichincha',
    ubicacionMecanicaId: 'pichincha-3',
    ubicacionMecanicaNombre: 'AutoService Cumbayá',
    ubicacionMecanicaDireccion: 'Av. Interoceánica Km 12.5, Cumbayá',
    fechaServicio: '18/01/2027',
    mecanicoAsignado: 'Téc. Luis Herrera',
    diagnostico: 'Desalineación de las ruedas delanteras y desgaste irregular de neumáticos',
    trabajoRealizado: 'Alineación y balanceo',
    repuestosUtilizados: 'Ninguno (solo servicio)',
    diagnosticoRealizado: 'Se realizó alineación computarizada de las cuatro ruedas. Se balanceó los neumáticos y se verificó presión correcta. Se inspeccionó sistema de suspensión y dirección en buen estado.',
    costoManoObra: '40.00',
    costoRepuestos: '0.00',
    observaciones: 'Se recomienda realizar alineación y balanceo cada 10,000 km o cuando se note desviación del vehículo. Revisar presión de neumáticos mensualmente.',
    fechaInicio: '18/01/2027',
    fechaFinalizacion: '18/01/2027',
    costoTotal: '40.00',
  },
];

// Función para obtener solicitudes simuladas
export const obtenerSolicitudesSimuladas = (): SolicitudMantenimiento[] => {
  return solicitudesSimuladas;
};

// Función para actualizar una solicitud
export const actualizarSolicitud = (id: string, datos: Partial<SolicitudMantenimiento>): void => {
  const index = solicitudesSimuladas.findIndex((s) => s.id === id);
  if (index !== -1) {
    solicitudesSimuladas[index] = { ...solicitudesSimuladas[index], ...datos };
  }
};

// Función para eliminar una solicitud
export const eliminarSolicitud = (id: string): void => {
  const index = solicitudesSimuladas.findIndex((s) => s.id === id);
  if (index !== -1) {
    solicitudesSimuladas.splice(index, 1);
  }
};
