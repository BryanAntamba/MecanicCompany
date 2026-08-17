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
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim())) {
    // Mensajes personalizados según el campo
    if (campo.toLowerCase().includes('marca')) {
      return 'Ingrese la marca de manera correcta.';
    }
    return `${campo} solo puede contener letras y espacios.`;
  }
  return null;
};


// ─── validarTextoYNumeros ────────────────────────────────────────────────────
// Letras, números y espacios. Sin símbolos.
export const validarTextoYNumeros = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim())) {
    // Mensajes personalizados según el campo
    if (campo.toLowerCase().includes('modelo')) {
      return 'Ingrese el modelo del vehiculo de manera correcta.';
    }
    return `${campo} solo puede contener letras, números y espacios.`;
  }
  return null;
};


// ─── validarModelo ────────────────────────────────────────────────────────────
// Letras, números, espacios y guión. Ejemplos válidos: "A3 sedan", "Corolla-2019".
export const validarModelo = (valor: string): string | null => {
  if (!valor.trim()) return 'El modelo es obligatorio.';
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(valor.trim()))
    return 'El modelo solo puede contener letras, números, espacios y guiones.';
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
  if (!/^\d+$/.test(valor.trim())) {
    // Mensajes personalizados según el campo
    if (campo.toLowerCase().includes('kilometraje')) {
      return 'Ingrese el kilometraje de manera correcta.';
    }
    return `${campo} solo puede contener números.`;
  }
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
    return 'Ingrese una direccion de correo valido.';
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

// ─── validarCredencial ───────────────────────────────────────────────────────
// Valida correo que puede ser @gmail.com o @mecanic.com
export const validarCredencial = (valor: string): string | null => {
  if (!valor.trim()) return 'La credencial es obligatoria.';
  
  const correoLower = valor.trim().toLowerCase();
  const esGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(correoLower);
  const esMecanic = /^[a-zA-Z0-9._%+-]+@mecanic\.com$/.test(correoLower);
  
  if (!esGmail && !esMecanic) {
    return 'Ingresa un correo válido (@gmail.com o @mecanic.com).';
  }
  
  return null;
};


// ─── validarAño ──────────────────────────────────────────────────────────────
// Exactamente 4 dígitos, entre 1900 y año actual + 1.
export const validarAño = (valor: string): string | null => {
  if (!valor.trim()) return 'El año es obligatorio.';
  if (!/^\d{4}$/.test(valor.trim())) return 'Ingrese el año del vehiculo de manera correcta.';
  const num = parseInt(valor.trim(), 10);
  const actual = new Date().getFullYear();
  if (num < 1900 || num > actual + 1)
    return `El año debe estar entre 1900 y ${actual + 1}.`;
  return null;
};


// ─── validarPlaca ─────────────────────────────────────────────────────────────
// Formato Ecuador: 3 letras + 4 números (EPC4613) - sin guion, acepta minúsculas
export const validarPlaca = (valor: string): string | null => {
  if (!valor.trim()) return 'La placa es obligatoria.';
  const placa = valor.trim();
  // Acepta letras mayúsculas o minúsculas: ABC1234 o abc1234
  if (!/^[a-zA-Z]{3}\d{4}$/.test(placa))
    return 'Ingrese un numero de placa valido.';
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


// ─── validarCostoObligatorio ──────────────────────────────────────────────────
// Costo obligatorio con números decimales sin limitación
export const validarCostoObligatorio = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  // No permitir que inicie con punto o coma
  if (/^[.,]/.test(valor.trim())) {
    return 'Ingrese una cantidad valida.';
  }
  if (!/^\d+(\.\d+)?$/.test(valor.trim())) {
    return 'Ingrese una cantidad valida.';
  }
  return null;
};

// ─── validarTextoNumerosCaracteresEspeciales ──────────────────────────────────
// Permite texto, números y caracteres especiales
export const validarTextoNumerosCaracteresEspeciales = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  return null;
};

// ─── validarFechaFormato ──────────────────────────────────────────────────────
// Valida formato de fecha DD/MM/AAAA
export const validarFechaFormato = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatoria.`;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor.trim()))
    return `${campo} debe tener el formato DD/MM/AAAA.`;
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
// Mínimo 8 caracteres, al menos una letra y un número.
export const validarContrasena = (valor: string, campo = 'La contraseña'): string | null => {
  if (!valor.trim()) return `${campo} es obligatoria.`;
  if (valor.length < 8) return `${campo} debe tener al menos 8 caracteres.`;
  if (!/[a-zA-Z]/.test(valor)) return `${campo} debe incluir al menos una letra.`;
  if (!/[0-9]/.test(valor)) return `${campo} debe incluir al menos un número.`;
  return null;
};


// ─── validarObligatorio ───────────────────────────────────────────────────────
// Campo obligatorio genérico (dropdowns, selectores, etc.).
export const validarObligatorio = (valor: string | null | undefined, campo: string): string | null => {
  if (!valor || !String(valor).trim()) return `${campo} es obligatorio.`;
  return null;
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
  return null;
};


// ─── validarUnNombre ──────────────────────────────────────────────────────────
// Solo letras, máximo una palabra (un nombre o un apellido).
export const validarUnNombre = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return `${campo} es obligatorio.`;
  
  // Verificar que no contenga números
  if (/\d/.test(valor.trim())) {
    if (campo.toLowerCase().includes('nombre')) {
      return 'Ingrese un Nombre válido.';
    } else {
      return 'Ingrese un Apellido válido.';
    }
  }
  
  // Verificar que solo contenga letras (sin espacios)
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(valor.trim())) {
    if (campo.toLowerCase().includes('nombre')) {
      return 'Ingrese un Nombre válido.';
    } else {
      return 'Ingrese un Apellido válido.';
    }
  }
  
  return null;
};

// ─── validarSegundoNombre ─────────────────────────────────────────────────────
// Opcional, solo letras, máximo una palabra.
export const validarSegundoNombre = (valor: string, campo: string): string | null => {
  if (!valor.trim()) return null; // Campo opcional
  
  // Verificar que no contenga números
  if (/\d/.test(valor.trim())) {
    if (campo.toLowerCase().includes('nombre')) {
      return 'Ingrese un Nombre válido.';
    } else {
      return 'Ingrese un Apellido válido.';
    }
  }
  
  // Verificar que solo contenga letras (sin espacios)
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(valor.trim())) {
    if (campo.toLowerCase().includes('nombre')) {
      return 'Ingrese un Nombre válido.';
    } else {
      return 'Ingrese un Apellido válido.';
    }
  }
  
  return null;
};

// ─── validarFechaNacimiento ───────────────────────────────────────────────────
// Valida que sea una fecha válida y que la persona sea mayor de 18 años
export const validarFechaNacimiento = (fecha: Date | null): string | null => {
  if (!fecha) return 'La fecha de nacimiento es obligatoria.';
  
  const hoy = new Date();
  const edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  
  if (edad < 18 || (edad === 18 && mes < 0)) {
    return 'Debes ser mayor de 18 años para registrarte.';
  }
  
  if (edad > 120) {
    return 'La fecha de nacimiento no es válida.';
  }
  
  return null;
};

// ─── validarConfirmarContrasena ───────────────────────────────────────────────
// Valida que ambas contraseñas coincidan
export const validarConfirmarContrasena = (contrasena: string, confirmar: string): string | null => {
  if (!confirmar.trim()) return 'Debes confirmar tu contraseña.';
  if (contrasena !== confirmar) return 'Las contraseñas no coinciden.';
  return null;
};


// ─── validarSegundoNombreOpcional ─────────────────────────────────────────────
// Segundo nombre es opcional, pero si se proporciona debe ser solo letras
export const validarSegundoNombreOpcional = (valor: string, campo: string): string | null => {
  const v = valor.trim();
  if (!v) return null; // Opcional - si está vacío es válido
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) {
    return `${campo} solo puede contener letras y espacios.`;
  }
  if (v.length < 2) return `${campo} debe tener al menos 2 caracteres.`;
  return null;
};

// ─── validarEspecialidadOServicio ─────────────────────────────────────────────
// Validación para especialidad personalizada o servicio personalizado
// Solo acepta letras (con acentos y ñ) y espacios. Sin números ni caracteres especiales.
export const validarEspecialidadOServicio = (valor: string, tipo: 'especialidad' | 'servicio'): string | null => {
  if (!valor.trim()) {
    return tipo === 'especialidad' 
      ? 'La especialidad es obligatoria.' 
      : 'La descripción del servicio es obligatoria.';
  }
  
  // Verificar que solo contenga letras (con acentos y ñ) y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim())) {
    return tipo === 'especialidad' 
      ? 'Escriba la especialidad de manera correcta.' 
      : 'Escriba el servicio de manera correcta.';
  }
  
  return null;
};
