import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import os from 'os';
import app from './app';

const PORT = process.env.PORT ?? 3000;

function getLocalIP(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of (nets[name] ?? [])) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.listen(Number(PORT), '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Dispositivos en red: http://${localIP}:${PORT}`);
});
