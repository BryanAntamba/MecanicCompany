// metro.config.js
// Configuración personalizada de Metro Bundler para React Native Web
const { getDefaultConfig } = require('expo/metro-config');

// Importa el supresor de warnings al inicio
require('./suppress-warnings');

const config = getDefaultConfig(__dirname);

module.exports = config;
