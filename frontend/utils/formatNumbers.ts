/**
 * Formatea un número con separador de miles (punto estilo español)
 * Ejemplo: 2000 -> "2.000", 3000000 -> "3.000.000"
 */
export const formatearNumeroConPuntos = (valor: string | number): string => {
  // Convertir a string y quitar todo lo que no sea dígito
  const numeroLimpio = String(valor).replace(/\D/g, '');
  
  if (!numeroLimpio) return '';
  
  // Convertir a número y formatear con separador de miles (punto estilo español)
  const numero = parseInt(numeroLimpio, 10);
  return numero.toLocaleString('es-ES');
};

/**
 * Desformatea un número quitando los puntos de separación de miles
 * Ejemplo: "2.000" -> "2000", "3.000.000" -> "3000000"
 */
export const desformatearNumero = (valor: string): string => {
  return valor.replace(/\./g, '');
};

/**
 * Maneja el cambio en un input de precio con formato estadounidense automático
 * Permite comas y puntos, formatea mientras escribe
 * LIMITA A 2 DECIMALES MÁXIMO
 * Ejemplo: "1000" -> display "1,000", "1000.5" -> display "1,000.5"
 */
export const manejarCambioPrecioEstadounidense = (texto: string): { display: string; raw: string } => {
  // Si el texto comienza con punto o coma, no permitirlo
  if (texto.startsWith('.') || texto.startsWith(',')) {
    return { display: '', raw: '' };
  }
  
  // Solo permitir números, coma y UN punto decimal
  let limpio = texto.replace(/[^0-9.,]/g, '');
  
  // Remover comas (son solo visuales)
  let sinComas = limpio.replace(/,/g, '');
  
  // Validar que solo haya un punto
  const puntos = (sinComas.match(/\./g) || []).length;
  if (puntos > 1) {
    // Mantener solo el primer punto
    const partes = sinComas.split('.');
    sinComas = partes[0] + '.' + partes.slice(1).join('');
  }
  
  // LIMITAR A 2 DECIMALES
  if (sinComas.includes('.')) {
    const [entero, decimal] = sinComas.split('.');
    // Si hay más de 2 decimales, limitar a 2
    if (decimal && decimal.length > 2) {
      sinComas = entero + '.' + decimal.substring(0, 2);
    }
  }
  
  // El raw es el valor sin formato
  const raw = sinComas;
  
  // Formatear para display
  if (!raw) return { display: '', raw: '' };
  
  // Separar parte entera y decimal
  const partes = raw.split('.');
  const parteEntera = partes[0];
  const parteDecimal = partes[1];
  
  // Formatear parte entera con comas
  let display = '';
  if (parteEntera) {
    const numeroEntero = parseInt(parteEntera, 10);
    if (!isNaN(numeroEntero)) {
      display = numeroEntero.toLocaleString('en-US');
    }
  }
  
  // Si hay punto decimal, agregar la parte decimal
  if (parteDecimal !== undefined) {
    display += '.' + parteDecimal;
  } else if (raw.endsWith('.')) {
    // Si el usuario acaba de escribir el punto, mostrarlo
    display += '.';
  }
  
  return { display, raw };
};

/**
 * Maneja el cambio en un input de número formateado (solo enteros)
 * NO permite punto ni coma, solo números
 * Formatea automáticamente con puntos como separadores de miles
 * Sin límite de longitud
 * Retorna el valor formateado para display y el valor raw para el estado
 */
export const manejarCambioNumeroFormateado = (texto: string): { display: string; raw: string } => {
  // Solo extraer dígitos, eliminar todo lo demás (puntos, comas, letras, etc.)
  const raw = texto.replace(/\D/g, '');
  
  // Si está vacío, retornar vacío
  if (!raw) return { display: '', raw: '' };
  
  // Formatear con puntos como separadores de miles
  const display = formatearNumeroConPuntos(raw);
  
  return { display, raw };
};

/**
 * Filtra caracteres especiales de un texto
 * Solo permite letras, números, espacios y algunos caracteres seguros como guión y paréntesis
 */
export const filtrarCaracteresEspeciales = (texto: string): string => {
  // Permitir: letras (incluye acentos), números, espacios, guión, paréntesis, coma
  return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-(),]/g, '');
};

/**
 * Filtra caracteres para ubicación de inventario
 * Solo permite letras, números, espacios y guión (-)
 * Ejemplo válido: "Piso 3-L4"
 */
export const filtrarUbicacionInventario = (texto: string): string => {
  // Permitir: letras (incluye acentos), números, espacios y guión
  return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-]/g, '');
};

/**
 * Formatea un precio en formato estadounidense: separador de miles con coma, decimales con punto
 * Ejemplo: 1678.34 -> "1,678.34", 12567.89 -> "12,567.89", 1000 -> "1,000.00"
 * Siempre muestra 2 decimales
 */
export const formatearPrecioEspanol = (valor: number): string => {
  // Asegurar 2 decimales y formatear con comas para miles
  return valor.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
