// validaciones.ts
// Funciones de validación reutilizables para todos los formularios de la app.
// Cada función recibe el valor del campo (y opcionalmente el nombre del campo)
// y retorna un string con el mensaje de error, o null si el valor es válido.
// Al centralizar las validaciones aquí se evita duplicar lógica en cada pantalla.


// validarSoloTexto
// Valida que un campo contenga únicamente letras (incluyendo acentos y ñ) y espacios.
// No permite números ni símbolos especiales.
// Uso típico: nombres, apellidos, marcas de vehículo, etc.
// Retorna: string con el mensaje de error, o null si el valor es válido.
export const validarSoloTexto = (valor: string, campo: string): string | null => {
  // Si el valor está vacío o solo tiene espacios, retorna error de campo obligatorio.
  // trim() elimina espacios al inicio y al final antes de verificar si está vacío.
  if (!valor.trim()) return `${campo} es obligatorio.`;

  // Expresión regular que permite:
  //   a-z A-Z       → letras minúsculas y mayúsculas sin acento
  //   áéíóú ÁÉÍÓÚ   → vocales con tilde (minúsculas y mayúsculas)
  //   ñ Ñ           → letra eñe (minúscula y mayúscula)
  //   ü Ü           → u con diéresis (para palabras como "güero")
  //   \s            → espacios en blanco (incluye espacio, tab, etc.)
  // El ^ al inicio y $ al final aseguran que TODA la cadena cumpla el patrón.
  // El + exige al menos un carácter válido.
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras y espacios.`;

  // Si pasó ambas validaciones, el valor es válido → retorna null (sin error).
  return null;
};


// validarTextoYNumeros
// Valida que un campo contenga letras, números y espacios, pero no símbolos.
// Uso típico: modelos de vehículo, descripciones cortas, nombres con números, etc.
// Retorna: string con el mensaje de error, o null si el valor es válido.
export const validarTextoYNumeros = (valor: string, campo: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return `${campo} es obligatorio.`;

  // Expresión regular que permite letras (con acentos y ñ), dígitos 0-9 y espacios.
  // No permite símbolos como @, #, !, -, etc.
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor.trim()))
    return `${campo} solo puede contener letras, números y espacios.`;

  return null;
};


// validarSoloNumeros
// Valida que un campo contenga únicamente dígitos numéricos (0-9).
// No permite letras, espacios ni símbolos.
// Uso típico: IDs, códigos numéricos, cantidades enteras, etc.
// Retorna: string con el mensaje de error, o null si el valor es válido.
export const validarSoloNumeros = (valor: string, campo: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return `${campo} es obligatorio.`;

  // \d+ verifica que todos los caracteres sean dígitos del 0 al 9.
  // Equivalente a [0-9]+. No permite punto decimal ni signo negativo.
  if (!/^\d+$/.test(valor.trim()))
    return `${campo} solo puede contener números.`;

  return null;
};


// validarTelefono
// Valida un número de teléfono: solo dígitos, entre 7 y 10 caracteres.
// No recibe el nombre del campo porque siempre es "El teléfono".
// Uso típico: campo de teléfono de contacto del cliente o mecánico.
// Retorna: string con el mensaje de error, o null si el valor es válido.
export const validarTelefono = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'El teléfono es obligatorio.';

  // Verifica que solo contenga dígitos (sin guiones, paréntesis ni espacios).
  if (!/^\d+$/.test(valor.trim())) return 'El teléfono solo puede contener números.';

  // Verifica que no supere los 10 dígitos (límite para números locales/celulares).
  if (valor.trim().length > 10) return 'El teléfono no puede tener más de 10 dígitos.';

  // Verifica que tenga al menos 7 dígitos (mínimo para un número válido).
  if (valor.trim().length < 7) return 'El teléfono debe tener al menos 7 dígitos.';

  // Si pasó todas las validaciones, el teléfono es válido.
  return null;
};


// validarCorreoGmail
// Valida que el correo tenga el formato exacto: usuario@gmail.com
// Solo acepta cuentas de Gmail; rechaza otros dominios como hotmail, yahoo, etc.
// Uso típico: correo personal del cliente al registrarse.
// Retorna: string con el mensaje de error, o null si el correo es válido.
export const validarCorreoGmail = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'El correo electrónico es obligatorio.';

  // Expresión regular que valida el formato usuario@gmail.com:
  //   ^[a-zA-Z0-9._%+-]+  → parte local: letras, números y caracteres permitidos en correos
  //   @gmail\.com$        → dominio fijo: debe terminar exactamente en @gmail.com
  //                         El \. escapa el punto para que no sea "cualquier carácter"
  // toLowerCase() normaliza el valor antes de comparar para ignorar mayúsculas.
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(valor.trim().toLowerCase()))
    return 'El correo debe tener el formato usuario@gmail.com.';

  return null;
};


// ─── validarCorreoMecanic ────────────────────────────────────────────────────
// Valida que el correo tenga el formato exacto: usuario@mecanic.com
// Solo acepta correos del dominio empresarial de la aplicación.
// Uso típico: login, restablecimiento de contraseña y registro de mecánicos/admins.
//
// Parámetros:
//   valor → correo electrónico ingresado por el usuario
//
// Retorna: string con el mensaje de error, o null si el correo es válido.
export const validarCorreoMecanic = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'El correo empresarial es obligatorio.';

  // Expresión regular que valida el formato usuario@mecanic.com:
  //   ^[a-zA-Z0-9._%+-]+  → parte local del correo (antes del @)
  //   @mecanic\.com$      → dominio fijo empresarial; \. escapa el punto literal
  // toLowerCase() asegura que "Bryan@Mecanic.COM" también sea aceptado.
  if (!/^[a-zA-Z0-9._%+-]+@mecanic\.com$/.test(valor.trim().toLowerCase()))
    return 'Solo se permiten correos con el formato corporativo.';

  return null;
};


//  validarAño
// Valida que el año sea un número de exactamente 4 dígitos y esté dentro
// del rango permitido: entre 1900 y el año actual + 1.
// Uso típico: año de fabricación de un vehículo.
// Retorna: string con el mensaje de error, o null si el año es válido.
export const validarAño = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'El año es obligatorio.';

  // \d{4} verifica que el valor tenga exactamente 4 dígitos numéricos.
  // Rechaza valores como "99", "12345" o "20ab".
  if (!/^\d{4}$/.test(valor.trim())) return 'El año debe tener exactamente 4 dígitos.';

  // Convierte el string a número entero en base 10 para comparar rangos.
  const num = parseInt(valor.trim(), 10);

  // Obtiene el año actual del sistema para calcular el límite superior dinámico.
  const actual = new Date().getFullYear();

  // Verifica que el año esté dentro del rango válido:
  //   Mínimo: 1900 (vehículos históricos)
  //   Máximo: año actual + 1 (permite registrar vehículos del año siguiente)
  if (num < 1900 || num > actual + 1)
    return `El año debe estar entre 1900 y ${actual + 1}.`;

  return null;
};


// validarPlaca
// Valida que la placa del vehículo contenga solo letras, números y guiones.
// No impone un formato fijo porque los formatos de placa varían por país/región.
// Uso típico: campo de placa al registrar o editar un vehículo.
// Retorna: string con el mensaje de error, o null si la placa es válida.
export const validarPlaca = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'La placa es obligatoria.';

  // Expresión regular que permite:
  //   a-z A-Z → letras del alfabeto inglés (sin acentos, las placas no los usan)
  //   0-9     → dígitos numéricos
  //   -       → guión (separador común en formatos de placa como "ABC-123")
  // No permite espacios ni otros símbolos.
  if (!/^[a-zA-Z0-9-]+$/.test(valor.trim()))
    return 'La placa solo puede contener letras, números y guiones.';

  return null;
};


// validarFecha
// Valida que la fecha tenga el formato DD/MM/AAAA y que los valores de día,
// mes y año sean coherentes (no valida días exactos por mes, solo rangos básicos).
// Uso típico: fecha de cita, fecha de mantenimiento, etc.
// Retorna: string con el mensaje de error, o null si la fecha es válida.
export const validarFecha = (valor: string): string | null => {
  // Verifica que el campo no esté vacío.
  if (!valor.trim()) return 'La fecha es obligatoria.';

  // Verifica el formato exacto DD/MM/AAAA:
  //   \d{2} → exactamente 2 dígitos para día
  //   \/    → barra diagonal literal (escapada con \)
  //   \d{2} → exactamente 2 dígitos para mes
  //   \/    → barra diagonal literal
  //   \d{4} → exactamente 4 dígitos para año
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor.trim()))
    return 'La fecha debe tener el formato DD/MM/AAAA.';

  // Divide la fecha en partes usando "/" como separador y convierte cada parte a número.
  // Destructuring: d = día, m = mes, y = año.
  const [d, m, y] = valor.trim().split('/').map(Number);

  // Verifica que el mes esté entre 1 (enero) y 12 (diciembre).
  if (m < 1 || m > 12) return 'El mes debe estar entre 01 y 12.';

  // Verifica que el día esté entre 1 y 31 (validación básica de rango).
  // No valida días exactos por mes (ej: febrero con 28/29 días).
  if (d < 1 || d > 31) return 'El día debe estar entre 01 y 31.';

  // Verifica que el año esté dentro del rango permitido para citas/mantenimientos.
  if (y < 2000 || y > 2100) return 'El año no es válido.';

  return null;
};


// validarCosto
// Valida que el costo sea un número decimal positivo con hasta 2 decimales.
// Este campo es OPCIONAL: si está vacío, retorna null directamente (sin error).
// Uso típico: costo de repuestos o mano de obra en un registro de mantenimiento.
// Retorna: string con el mensaje de error, o null si el valor es válido o está vacío.
export const validarCosto = (valor: string, campo: string): string | null => {
  // Si el campo está vacío, es válido (el costo es opcional).
  // A diferencia de otras funciones, aquí no se exige que sea obligatorio.
  if (!valor.trim()) return null;

  // Expresión regular que valida números decimales positivos:
  //   ^\d+        → uno o más dígitos enteros al inicio (ej: "25", "100")
  //   (\.\d{1,2})?→ parte decimal opcional: punto seguido de 1 o 2 dígitos (ej: ".5", ".99")
  //   $           → fin de la cadena
  // Acepta: "25", "25.5", "25.99" | Rechaza: "25.", ".99", "25.999", "abc"
  if (!/^\d+(\.\d{1,2})?$/.test(valor.trim()))
    return `${campo} debe ser un número válido (ej: 25.00).`;

  return null;
};


// validarContrasena
// Valida que la contraseña no esté vacía y tenga al menos 6 caracteres.
// No impone restricciones de caracteres especiales para mayor flexibilidad.
// Uso típico: campo de contraseña en login y cambio de contraseña.
// Retorna: string con el mensaje de error, o null si la contraseña es válida.
export const validarContrasena = (valor: string, campo = 'La contraseña'): string | null => {
  // Verifica que el campo no esté vacío.
  // trim() elimina espacios para evitar que una contraseña de solo espacios sea válida.
  if (!valor.trim()) return `${campo} es obligatoria.`;

  // Verifica la longitud mínima de 6 caracteres.
  // Se usa valor.length (sin trim) para contar todos los caracteres incluyendo espacios internos.
  if (valor.length < 6) return `${campo} debe tener al menos 6 caracteres.`;

  return null;
};


// validarObligatorio
// Validación genérica para cualquier campo que sea simplemente obligatorio.
// Acepta string, null o undefined para cubrir valores de dropdowns y selectores
// que pueden retornar null cuando no se ha seleccionado ninguna opción.
// Uso típico: dropdowns de tipo de servicio, estado del vehículo, fecha de cita, etc.
// Retorna: string con el mensaje de error, o null si el valor tiene contenido.
export const validarObligatorio = (valor: string | null | undefined, campo: string): string | null => {
  // Verifica si el valor es falsy (null, undefined, '') O si al convertirlo a string
  // y aplicar trim() resulta en una cadena vacía.
  // String(valor) convierte null/undefined a "null"/"undefined" antes del trim,
  // pero la condición !valor lo captura antes de llegar a String().
  if (!valor || !String(valor).trim()) return `${campo} es obligatorio.`;

  return null;
};
