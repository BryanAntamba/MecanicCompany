// validaciones.ts
// Funciones de validación reutilizables para todos los formularios de la app.


// ─── validarDosPalabras ───────────────────────────────────────────────────────
// Solo letras y espacios. Mínimo 2 palabras, máximo 4. Campo configurable.
export const validarDosPalabras = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} no puede contener números ni caracteres especiales.`;
  const palabras = valor.trim().split(/\s+/);
  if (palabras.length < 2) return `${campo} debe contener al menos dos palabras.`;
  if (palabras.length > 4) return `${campo} no puede tener más de 4 palabras.`;
  return null;
};


// ─── validarCuatroPalabras ────────────────────────────────────────────────────
// Solo letras y espacios. Exactamente 4 palabras (nombre + apellidos completos).
export const validarCuatroPalabras = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} no puede contener números ni caracteres especiales.`;
  const palabras = valor.trim().split(/\s+/);
  if (palabras.length < 4) return `${campo} debe contener 4 palabras (nombre completo y dos apellidos).`;
  if (palabras.length > 4) return `${campo} no puede tener más de 4 palabras.`;
  return null;
};


// ─── validarNombreCompleto ────────────────────────────────────────────────────
// Solo letras y espacios. Mínimo 2 palabras (nombre + apellido), máximo 4.
export const validarNombreCompleto = (valor: string): string | null => {
  if (!valor.trim()) return 'El nombre completo es obligatorio.';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return 'El nombre no puede contener números ni caracteres especiales.';
  const palabras = valor.trim().split(/\s+/);
  if (palabras.length < 2) return 'Ingresa al menos nombre y apellido.';
  if (palabras.length > 4) return 'El nombre no puede tener más de 4 palabras.';
  return null;
};


// ─── validarSoloTexto ────────────────────────────────────────────────────────
// Solo letras (con acentos y ñ) y espacios. Sin números ni símbolos.
export const validarSoloTexto = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras y espacios.`;
  return null;
};


// ─── validarTextoYNumeros ────────────────────────────────────────────────────
// Letras, números y espacios. Sin símbolos.
export const validarTextoYNumeros = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras, números y espacios.`;
  return null;
};


// ─── validarModelo ────────────────────────────────────────────────────────────
// Letras, números y guión. Sin espacios ni otros símbolos.
export const validarModelo = (valor: string): string | null => {
  if (!valor.trim()) return 'El modelo es obligatorio.';
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ-]+$/.test(valor.trim()))
    return 'El modelo solo puede contener letras, números y guiones.';
  return null;
};


// ─── validarOtroServicio ──────────────────────────────────────────────────────
// Obligatorio, solo letras y espacios. Sin números ni símbolos.
export const validarOtroServicio = (valor: string): string | null => {
  if (!valor.trim()) return 'La descripción del servicio es obligatoria.';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return 'La descripción solo puede contener letras y espacios.';
  return null;
};


// ─── validarSoloNumeros ──────────────────────────────────────────────────────
// Solo dígitos numéricos (0-9).
export const validarSoloNumeros = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^\d+$/.test(valor.trim()))
    return `${campo} solo puede contener números.`;
  return null;
};


// ─── validarTelefono ─────────────────────────────────────────────────────────
// Exactamente 10 dígitos, sin espacios ni símbolos.
export const validarTelefono = (valor: string): string | null => {
  if (!valor.trim()) return 'El teléfono es obligatorio.';
  if (!/^\d+$/.test(valor.trim())) return 'El teléfono solo puede contener números, sin espacios.';
  if (valor.trim().length !== 10) return 'El teléfono debe tener exactamente 10 dígitos.';
  return null;
};


// ─── validarCorreoGmail ──────────────────────────────────────────────────────
// Formato exacto: usuario@gmail.com
export const validarCorreoGmail = (valor: string): string | null => {
  if (!valor.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(valor.trim().toLowerCase()))
    return 'Correo personal mal registrado, escriba nuevamente.';
  return null;
};


// ─── validarCorreo ───────────────────────────────────────────────────────────
// Valida un correo electrónico genérico con formato usuario@dominio.ext
export const validarCorreo = (valor: string): string | null => {
  if (!valor.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()))
    return 'Ingresa un correo electrónico válido.';
  return null;
};


// ─── validarCorreoMecanic ────────────────────────────────────────────────────
// Formato exacto: usuario@mecanic.com
export const validarCorreoMecanic = (valor: string): string | null => {
  if (!valor.trim()) return 'El correo empresarial es obligatorio.';
  if (!/^[a-zA-Z0-9._%+-]+@mecanic\.com$/.test(valor.trim().toLowerCase()))
    return 'Correo corporativo mal registrado, escriba nuevamente.';
  return null;
};


// ─── validarAño ──────────────────────────────────────────────────────────────
// Exactamente 4 dígitos, entre 1900 y año actual + 1.
export const validarAño = (valor: string): string | null => {
  if (!valor.trim()) return 'El año es obligatorio.';
  if (!/^\d{4}$/.test(valor.trim())) return 'El año debe tener exactamente 4 dígitos.';
  const num = parseInt(valor.trim(), 10);
  const actual = new Date().getFullYear();
  if (num < 1900 || num > actual + 1)
    return `El año debe estar entre 1900 y ${actual + 1}.`;
  return null;
};


// ─── validarPlaca ─────────────────────────────────────────────────────────────
// Letras, números y guiones.
export const validarPlaca = (valor: string): string | null => {
  if (!valor.trim()) return 'La placa es obligatoria.';
  if (!/^[a-zA-Z0-9-]+$/.test(valor.trim()))
    return 'La placa solo puede contener letras, números y guiones.';
  return null;
};


// ─── validarFecha ─────────────────────────────────────────────────────────────
// Formato DD/MM/AAAA con valores coherentes.
export const validarFecha = (valor: string): string | null => {
  if (!valor.trim()) return 'La fecha es obligatoria.';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor.trim()))
    return 'La fecha debe tener el formato DD/MM/AAAA.';
  const [d, m, y] = valor.trim().split('/').map(Number);
  if (m < 1 || m > 12) return 'El mes debe estar entre 01 y 12.';
  if (d < 1 || d > 31) return 'El día debe estar entre 01 y 31.';
  if (y < 2000 || y > 2100) return 'El año no es válido.';
  return null;
};


// ─── validarCosto ─────────────────────────────────────────────────────────────
// Número decimal positivo con hasta 2 decimales. Campo opcional.
export const validarCosto = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(valor.trim()))
    return `${campo} debe ser un número válido (ej: 25.00).`;
  return null;
};

// ─── validarContrasena ────────────────────────────────────────────────────────
// No vacía.
export const validarContrasena = (valor: string, campo = 'La contraseña'): string | null => {
  if (!valor.trim()) return `${campo} es obligatoria.`;
  return null;
};


// ─── validarObligatorio ───────────────────────────────────────────────────────
// Campo obligatorio genérico (dropdowns, selectores, etc.).
export const validarObligatorio = (valor: string | null | undefined, campo: string): string | null => {
  if (!valor || !String(valor).trim()) return `${campo} es obligatorio.`;
  return null;
};


// ─── validarCredencialesLogin ─────────────────────────────────────────────────
// Verifica si el par correo + contraseña corresponde a un usuario registrado.
export const validarCredencialesLogin = (email: string, password: string): string | null => {
  const lower = email.trim().toLowerCase();
  if (
    (lower === 'admin@mecanic.com' && password === 'admin123') ||
    (lower === 'bryan@mecanic.com' && password === 'bryan123')
  ) return null;
  return 'Correo o contraseña incorrectos.';
};


// ─── validarCorreoRegistrado ──────────────────────────────────────────────────
// Verifica si el correo personal (@gmail.com) está registrado en el sistema.
export const validarCorreoRegistrado = (email: string): string | null => {
  if (email.trim().toLowerCase() !== 'bryan@gmail.com')
    return 'El correo ingresado no está registrado en el sistema.';
  return null;
};


// ─── validarCodigoVerificacion ────────────────────────────────────────────────
// Valida formato (6 dígitos) y valor del código de verificación.
export const validarCodigoVerificacion = (codigo: string): string | null => {
  if (!codigo.trim()) return 'El código de verificación es obligatorio.';
  if (!/^\d{6}$/.test(codigo.trim())) return 'El código debe tener exactamente 6 dígitos.';
  if (codigo.trim() !== '123456')
    return 'El código ingresado es incorrecto. Verifica tu correo e intenta de nuevo.';
  return null;
};
