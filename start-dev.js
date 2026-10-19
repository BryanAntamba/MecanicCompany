#!/usr/bin/env node

const os = require('os');
const { spawn } = require('child_process');
const path = require('path');

// Detectar IP automáticamente
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.address.startsWith('127.')) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

console.log(`
╔════════════════════════════════════════╗
║  🚀 INICIANDO MECANICCOMPANY DEV       ║
╚════════════════════════════════════════╝

📱 Tu IP de red: ${localIP}
✅ Usa esta IP en el teléfono con Expo Go

`);

// Iniciar backend
console.log('📦 Iniciando Backend...\n');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

setTimeout(() => {
  // Iniciar frontend con la IP detectada
  console.log('\n📱 Iniciando Frontend (Expo)...\n');
  const frontend = spawn('npx', ['expo', 'start', '--lan'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, EXPO_LOCALHOST: localIP }
  });

  process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 3000);
