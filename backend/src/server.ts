import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT ?? 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Dispositivos en red: http://10.20.23.191:${PORT}`);
});
