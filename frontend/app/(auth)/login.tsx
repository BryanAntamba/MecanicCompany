// login.tsx
// Pantalla de inicio de sesión de la aplicación Mecanic.
// Permite a administradores y mecánicos autenticarse con correo y contraseña.

// Importa hooks de React: useEffect para efectos secundarios, useRef para
// referencias mutables sin re-render, useState para estado local del componente.
import { useEffect, useRef, useState } from 'react';

// Importa componentes de React Native necesarios para la UI:
// Alert        → diálogos nativos de error/aviso
// Animated     → API de animaciones declarativas
// ImageBackground → imagen de fondo que ocupa todo el contenedor
// KeyboardAvoidingView → desplaza el contenido cuando aparece el teclado
// Platform     → detecta el sistema operativo (iOS / Android)
// Pressable    → botón/área táctil con feedback de presión
// ScrollView   → contenedor desplazable verticalmente
// Text         → texto estático o dinámico
// TextInput    → campo de entrada de texto
// View         → contenedor genérico de layout
import {
  Alert, Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';

// useRouter de expo-router: permite navegar entre pantallas de forma programática.
import { useRouter } from 'expo-router';

// Image de expo-image: versión optimizada de Image con caché y mejor rendimiento.
import { Image } from 'expo-image';

// FontAwesome: librería de íconos vectoriales (se usa para el ojo de contraseña).
import { FontAwesome } from '@expo/vector-icons';

// Estilos específicos de esta pantalla, definidos en Styles/login.ts.
import loginStyles from '@/Styles/login';

// Funciones de validación reutilizables:
// validarCorreoMecanic → verifica formato usuario@mecanic.com
// validarContrasena    → verifica que la contraseña tenga al menos 6 caracteres
import { validarCorreoMecanic, validarContrasena } from '@/utils/validaciones';

// Componente principal de la pantalla de login.
// Se exporta como default para que expo-router lo registre como ruta.
export default function LoginScreen() {
  // router: objeto de navegación para redirigir al usuario tras el login.
  const router = useRouter();

  // email: valor actual del campo de correo electrónico.
  const [email, setEmail]               = useState('');

  // password: valor actual del campo de contraseña.
  const [password, setPassword]         = useState('');

  // showPassword: controla si la contraseña se muestra en texto plano (true)
  // o enmascarada con puntos (false). Inicia oculta.
  const [showPassword, setShowPassword] = useState(false);

  // loading: indica si hay una petición en curso para deshabilitar el botón
  // y mostrar el texto "Ingresando..." mientras se procesa.
  const [loading, setLoading]           = useState(false);

  // errEmail: mensaje de error del campo correo. Vacío = sin error.
  const [errEmail, setErrEmail]       = useState('');

  // errPassword: mensaje de error del campo contraseña. Vacío = sin error.
  const [errPassword, setErrPassword] = useState('');

  // slideAnim: valor animado que controla el desplazamiento vertical (translateY)
  // de la tarjeta. Inicia en 60 (desplazada hacia abajo) y anima hasta 0.
  const slideAnim   = useRef(new Animated.Value(60)).current;

  // opacityAnim: valor animado que controla la opacidad de la tarjeta.
  // Inicia en 0 (invisible) y anima hasta 1 (completamente visible).
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // useEffect sin dependencias: se ejecuta una sola vez al montar el componente.
  // Lanza las dos animaciones en paralelo para el efecto de entrada de la tarjeta.
  useEffect(() => {
    Animated.parallel([
      // Anima slideAnim de 60 → 0 en 500 ms (deslizamiento hacia arriba).
      Animated.timing(slideAnim,   { toValue: 0, duration: 500, useNativeDriver: true }),
      // Anima opacityAnim de 0 → 1 en 500 ms (aparición gradual).
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(); // .start() dispara las animaciones simultáneamente.
  }, []);

  // Credenciales de prueba (hardcodeadas para desarrollo)
  // En producción estas credenciales vendrían del backend mediante JWT u OAuth.
  const ADMIN_EMAIL     = 'admin@mecanic.com';   // Correo del administrador
  const ADMIN_PASSWORD  = 'admin123';             // Contraseña del administrador
  const MECANICO_EMAIL    = 'bryan@mecanic.com';  // Correo del mecánico
  const MECANICO_PASSWORD = 'bryan123';           // Contraseña del mecánico

  // validar: ejecuta todas las validaciones de los campos del formulario.
  // Actualiza los estados de error y retorna true si todo es válido, false si no.
  const validar = (): boolean => {
    // Valida el correo: retorna string con error o null si es válido.
    const eEmail    = validarCorreoMecanic(email);
    // Valida la contraseña: retorna string con error o null si es válida.
    const ePassword = validarContrasena(password, 'La contraseña');

    // Actualiza el estado de error del correo ('' si null, mensaje si hay error).
    setErrEmail(eEmail ?? '');
    // Actualiza el estado de error de la contraseña.
    setErrPassword(ePassword ?? '');

    // Retorna true solo si ambos campos son válidos (sin errores).
    return !eEmail && !ePassword;
  };

  // handleLogin: función asíncrona que se ejecuta al presionar "Iniciar sesión".
  const handleLogin = async () => {
    // Si la validación falla, muestra los errores en pantalla y no continúa.
    if (!validar()) return;

    // Activa el estado de carga para deshabilitar el botón y mostrar feedback.
    setLoading(true);
    try {
      // Simula una llamada al servidor con un retardo de 800 ms.
      // En producción se reemplazaría por fetch/axios al endpoint de autenticación.
      await new Promise((r) => setTimeout(r, 800));

      // Normaliza el correo a minúsculas para comparación insensible a mayúsculas.
      const lower = email.trim().toLowerCase();

      // Verifica si las credenciales corresponden al administrador.
      if (lower === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Redirige al panel de gestión de mecánicos (ruta del administrador).
        // replace() evita que el usuario pueda volver al login con el botón atrás.
        router.replace('/Admin/GestionMecanicos' as any);
        return; // Termina la función para no seguir evaluando condiciones.
      }

      // Verifica si las credenciales corresponden al mecánico.
      if (lower === MECANICO_EMAIL && password === MECANICO_PASSWORD) {
        // Redirige a la sección de reportes de clientes (ruta del mecánico).
        router.replace('/SeccionMecanico/ReportesClientes' as any);
        return; // Termina la función.
      }

      // Si ninguna credencial coincide, lanza un error con mensaje descriptivo.
      throw new Error('Correo o contraseña incorrectos.');
    } catch (e: any) {
      // Muestra un diálogo nativo con el mensaje de error capturado.
      // e.message contiene el texto del Error lanzado; el fallback es un mensaje genérico.
      Alert.alert('Error', e.message ?? 'Correo o contraseña incorrectos.');
    } finally {
      // Siempre desactiva el estado de carga, haya éxito o error.
      setLoading(false);
    }
  };

  // Renderizado del componente
  return (
    // ImageBackground: muestra fondoLogin.png como fondo de pantalla completa.
    // resizeMode="cover" escala la imagen para cubrir todo el espacio disponible.
    <ImageBackground
      source={require('../../assets/images/fondoLogin.png')}
      style={loginStyles.background}
      resizeMode="cover"
    >
      {/* Capa semitransparente sobre el fondo para mejorar la legibilidad del texto */}
      <View style={loginStyles.overlay} />

      {/* KeyboardAvoidingView: en iOS aplica padding para que el teclado no tape los inputs.
          En Android se omite (undefined) porque el sistema lo maneja automáticamente. */}
      <KeyboardAvoidingView style={loginStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ScrollView: permite desplazamiento si el contenido supera la pantalla.
            keyboardShouldPersistTaps="handled" cierra el teclado al tocar fuera de inputs.
            showsVerticalScrollIndicator={false} oculta la barra de scroll. */}
        <ScrollView contentContainerStyle={loginStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Animated.View: contenedor animado de la tarjeta de login.
              Aplica opacidad y desplazamiento vertical mediante los valores animados. */}
          <Animated.View style={[loginStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Logo de la empresa con ajuste "contain" para no recortar la imagen */}
            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={loginStyles.logo} />

            {/* Título principal de la pantalla */}
            <Text style={loginStyles.title}>INICIA SESION</Text>

            {/* Subtítulo con instrucción para el usuario */}
            <Text style={loginStyles.subtitle}>Ingresa tus credenciales para acceder al sistema.</Text>

            {/* Campo de correo electrónico*/}
            {/* inputError aplica borde rojo cuando hay un error de validación */}
            <TextInput
              style={[loginStyles.input, errEmail ? loginStyles.inputError : null]}
              placeholder="Correo empresarial"
              placeholderTextColor="#94A3B8"   // Color gris claro para el placeholder
              keyboardType="email-address"      // Teclado optimizado para correos
              autoCapitalize="none"             // Evita que la primera letra sea mayúscula
              value={email}                     // Valor controlado por el estado
              // Al cambiar el texto: actualiza el estado y limpia el error previo
              onChangeText={(t) => { setEmail(t); setErrEmail(''); }}
            />
            {/* Muestra el mensaje de error del correo solo si existe */}
            {errEmail ? <Text style={loginStyles.errorText}>{errEmail}</Text> : null}

            {/* Campo de contraseña*/}
            {/* passwordRow: contenedor flex-row que agrupa el input y el ícono del ojo */}
            <View style={[loginStyles.passwordRow, errPassword ? loginStyles.inputError : null]}>
              <TextInput
                style={loginStyles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#94A3B8"
                // secureTextEntry oculta el texto cuando showPassword es false
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrPassword(''); }}
              />
              {/* Botón para alternar visibilidad de la contraseña.
                  hitSlop={8} amplía el área táctil 8px en cada dirección. */}
              <Pressable onPress={() => setShowPassword((v) => !v)} style={loginStyles.eyeBtn} hitSlop={8}>
                {/* Cambia el ícono según si la contraseña está visible o no */}
                <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {/* Muestra el mensaje de error de la contraseña solo si existe */}
            {errPassword ? <Text style={loginStyles.errorText}>{errPassword}</Text> : null}

            {/* Enlace de recuperación de contraseña*/}
            {/* Navega a la pantalla de restablecimiento al ser presionado */}
            <Pressable onPress={() => router.push('/(auth)/restablecimientoPassword' as any)} style={loginStyles.forgotRow}>
              <Text style={loginStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {/* Botón principal de inicio de sesión*/}
            {/* La función de estilo recibe { pressed } para aplicar estilo de presión */}
            <Pressable
              style={({ pressed }) => [loginStyles.button, pressed && loginStyles.buttonPressed]}
              onPress={handleLogin}
              disabled={loading} // Deshabilita el botón mientras carga para evitar doble envío
            >
              {/* Render prop: recibe { pressed } para cambiar el estilo del texto también */}
              {({ pressed }) => (
                <Text style={[loginStyles.buttonText, pressed && loginStyles.buttonTextPressed]}>
                  {/* Muestra "Ingresando..." durante la carga, o el texto normal */}
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </Text>
              )}
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
