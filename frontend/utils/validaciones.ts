// ─────────────────────────────────────────────────────────────────────────────
// validaciones.ts
// Funciones de validación reutilizables para todos los formularios de la app.
// Cada función retorna un string con el mensaje de error, o null si es válido.
// ─────────────────────────────────────────────────────────────────────────────

// Solo letras (incluyendo acentos y ñ) y espacios — sin números ni símbolos
export const validarSoloTexto = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras y espacios.`;
  return null;
};

// Solo letras, números y espacios — sin símbolos
export const validarTextoYNumeros = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras, números y espacios.`;
  return null;
};

// Solo números — sin texto ni símbolos
export const validarSoloNumeros = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^\d+$/.test(valor.trim()))
    return `${campo} solo puede contener números.`;
  return null;
};

// Teléfono: solo números, máximo 10 dígitos
export const validarTelefono = (valor: string): string | null => {
  if (!valor.trim()) return 'El teléfono es obligatorio.';
  if (!/^\d+$/.test(valor.trim())) return 'El teléfono solo puede contener números.';
  if (valor.trim().length > 10) return 'El teléfono no puede tener más de 10 dígitos.';
  if (valor.trim().length < 7) return 'El teléfono debe tener al menos 7 dígitos.';
  return null;
};

// Correo personal: debe terminar en @gmail.com
export const validarCorreoGmail = (valor: string): string | null => {
  if (!valor.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(valor.trim().toLowerCase()))
    return 'El correo debe tener el formato usuario@gmail.com.';
  return null;
};

// Correo empresarial: debe terminar en @mecanic.com
export const validarCorreoMecanic = (valor: string): string | null => {
  if (!valor.trim()) return 'El correo empresarial es obligatorio.';
  if (!/^[a-zA-Z0-9._%+-]+@mecanic\.com$/.test(valor.trim().toLowerCase()))
    return 'Solo se permiten correos con el formato usuario@mecanic.com.';
  return null;
};

// Año: 4 dígitos numéricos entre 1900 y el año actual + 1
export const validarAño = (valor: string): string | null => {
  if (!valor.trim()) return 'El año es obligatorio.';
  if (!/^\d{4}$/.test(valor.trim())) return 'El año debe tener exactamente 4 dígitos.';
  const num = parseInt(valor.trim(), 10);
  const actual = new Date().getFullYear();
  if (num < 1900 || num > actual + 1)
    return `El año debe estar entre 1900 y ${actual + 1}.`;
  return null;
};

// Placa: letras y números, sin símbolos extraños (permite guión)
export const validarPlaca = (valor: string): string | null => {
  if (!valor.trim()) return 'La placa es obligatoria.';
  if (!/^[a-zA-Z0-9-]+$/.test(valor.trim()))
    return 'La placa solo puede contener letras, números y guiones.';
  return null;
};

// Fecha en formato DD/MM/AAAA
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

// Costo: número decimal positivo
export const validarCosto = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return null; // Los costos son opcionales en mantenimiento
  if (!/^\d+(\.\d{1,2})?$/.test(valor.trim()))
    return `${campo} debe ser un número válido (ej: 25.00).`;
  return null;
};

// Contraseña: cualquier carácter, mínimo 6
export const validarContrasena = (valor: string, campo = 'La contraseña'): string | null => {
  if (!valor.trim()) return `${campo} es obligatoria.`;
  if (valor.length < 6) return `${campo} debe tener al menos 6 caracteres.`;
  return null;
};

// Campo obligatorio genérico (para dropdowns, fechas de cita, etc.)
export const validarObligatorio = (valor: string | null | undefined, campo: string): string | null => {
  if (!valor || !String(valor).trim()) return `${campo} es obligatorio.`;
  return null;
};
