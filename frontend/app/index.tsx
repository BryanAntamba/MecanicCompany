/**
 * index.tsx - Ruta raíz de la aplicación
 * 
 * Este archivo maneja la ruta raíz (/) y redirige automáticamente
 * a la pantalla principal del cliente.
 * 
 * En web: cuando el usuario accede a http://localhost:8081/
 * En móvil: cuando la app se abre por primera vez
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // Redirigir automáticamente a la pantalla del cliente
  return <Redirect href="/PantallaCliente" />;
}
