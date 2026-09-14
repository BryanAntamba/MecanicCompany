// suppress-warnings.js
// Suprime warnings y errores conocidos de React Native Web que no afectan funcionalidad

// Lista de patrones a suprimir
const SUPPRESSED_PATTERNS = [
  'props.pointerEvents is deprecated',
  'useNativeDriver',
  'Unsupported style property',
  '@media',
  'min-width',
  'max-width',
  'minWidth',
  'maxWidth',
];

// Función para verificar si un mensaje debe suprimirse
function shouldSuppress(message) {
  const msg = String(message);
  return SUPPRESSED_PATTERNS.some(pattern => msg.includes(pattern));
}

// Guarda las funciones originales
const originalWarn = console.warn;
const originalError = console.error;

// Sobrescribe console.warn
console.warn = function(...args) {
  if (shouldSuppress(args[0])) {
    return; // Suprime el warning
  }
  originalWarn.apply(console, args);
};

// Sobrescribe console.error
console.error = function(...args) {
  if (shouldSuppress(args[0])) {
    return; // Suprime el error
  }
  originalError.apply(console, args);
};

// Exporta para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { shouldSuppress };
}
