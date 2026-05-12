import { Stack } from 'expo-router';

// Layout del grupo (auth): oculta el header en todas las pantallas de autenticación
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
