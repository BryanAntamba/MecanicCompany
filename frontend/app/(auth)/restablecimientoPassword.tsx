// restablecimientoPassword.tsx
// Pantalla de solicitud de restablecimiento de contraseña.
// El usuario ingresa su correo empresarial y, si está registrado,
// se le redirige a la pantalla para crear una nueva contraseña.


// Importa hooks de React:
// useEffect → ejecuta código al montar el componente (animación de entrada)
// useRef    → crea referencias mutables que no provocan re-render (valores animados)
// useState  → gestiona el estado local del formulario
import { useEffect, useRef, useState } from 'react';

// Importa componentes de React Native:
// Alert              → diálogo nativo para mostrar errores al usuario
// Animated           → API para animaciones declarativas (opacidad, posición)
// ImageBackground    → imagen de fondo que llena el contenedor padre
// KeyboardAvoidingView → evita que el teclado tape los campos de entrada
// Platform           → detecta el SO para aplicar comportamientos específicos
// Pressable          → área táctil con soporte para feedback visual de presión
// ScrollView         → permite desplazamiento si el contenido supera la pantalla
// Text               → componente para mostrar texto
// TextInput          → campo de entrada de texto editable
// View               → contenedor de layout genérico
import {
  Alert, Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';

// useRouter: hook de expo-router para navegar entre pantallas programáticamente.
import { useRouter } from 'expo-router';

// Image de expo-image: componente de imagen optimizado con caché automático.
import { Image } from 'expo-image';

// Estilos de esta pantalla, definidos en Styles/restablecimientoPaswword.ts.
import restablecerStyles from '@/Styles/restablecimientoPaswword';

// validarCorreoMecanic: valida que el correo tenga el formato usuario@mecanic.com.
// Retorna un string con el mensaje de error, o null si el correo es válido.
import { validarCorreoMecanic } from '@/utils/validaciones';

// Componente principal de la pantalla de restablecimiento de contraseña.
// Se exporta como default para que expo-router lo registre como ruta.
export default function RestablecimientoPasswordScreen() {
  // router: instancia de navegación para redirigir o volver atrás.
  const router = useRouter();

  // email: valor actual del campo de correo electrónico ingresado por el usuario.
  const [email, setEmail]     = useState('');

  // loading: true mientras se procesa la solicitud (simula llamada al servidor).
  // Deshabilita el botón y muestra "Cargando..." para evitar envíos duplicados.
  const [loading, setLoading] = useState(false);

  // errEmail: mensaje de error del campo correo. Cadena vacía = sin error visible.
  const [errEmail, setErrEmail] = useState('');

  // slideAnim: valor animado para el desplazamiento vertical (translateY) de la tarjeta.
  // Inicia en 60 px hacia abajo y anima hasta 0 (posición final).
  const slideAnim   = useRef(new Animated.Value(60)).current;

  // opacityAnim: valor animado para la opacidad de la tarjeta.
  // Inicia en 0 (invisible) y anima hasta 1 (completamente visible).
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // useEffect sin dependencias: se ejecuta una única vez al montar el componente.
  // Lanza ambas animaciones en paralelo para crear el efecto de entrada suave.
  useEffect(() => {
    Animated.parallel([
      // Desliza la tarjeta hacia arriba: translateY de 60 → 0 en 500 ms.
      Animated.timing(slideAnim,   { toValue: 0, duration: 500, useNativeDriver: true }),
      // Hace aparecer la tarjeta gradualmente: opacity de 0 → 1 en 500 ms.
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(); // Inicia ambas animaciones al mismo tiempo.
  }, []);

  // Correo de recuperación de prueba (hardcodeado para desarrollo)
  // En producción, la verificación se haría contra la base de datos del backend.
  const DEV_RECOVERY_EMAIL = 'bryan@mecanic.com';

  // handleSend: función asíncrona que se ejecuta al presionar "Restablecer contraseña".
  const handleSend = async () => {
    // Ejecuta la validación del correo y obtiene el mensaje de error (o null).
    const eEmail = validarCorreoMecanic(email);

    // Actualiza el estado de error: '' si es válido, mensaje si hay error.
    setErrEmail(eEmail ?? '');

    // Si hay error de validación, detiene la ejecución y muestra el error en pantalla.
    if (eEmail) return;

    // Activa el indicador de carga para dar feedback visual al usuario.
    setLoading(true);
    try {
      // Simula una petición al servidor con un retardo de 1000 ms.
      // En producción se reemplazaría por una llamada real a la API de recuperación.
      await new Promise((r) => setTimeout(r, 1000));

      // Verifica si el correo ingresado coincide con el correo de prueba registrado.
      // trim() elimina espacios al inicio/fin; toLowerCase() normaliza mayúsculas.
      if (email.trim().toLowerCase() !== DEV_RECOVERY_EMAIL) {
        // Si el correo no está registrado, lanza un error con mensaje descriptivo.
        throw new Error('El correo ingresado no está registrado en el sistema.');
      }

      // Si el correo es válido y está registrado, navega a la pantalla de cambio de contraseña.
      // push() agrega la nueva pantalla al historial, permitiendo volver atrás.
      router.push('/(auth)/cambiarPassword' as any);
    } catch (e: any) {
      // Muestra el error en un diálogo nativo.
      // e.message contiene el texto del Error lanzado; el fallback es un mensaje genérico.
      Alert.alert('Error', e.message ?? 'No se pudo procesar la solicitud.');
    } finally {
      // Siempre desactiva el estado de carga, independientemente del resultado.
      setLoading(false);
    }
  };

  // Renderizado del componente
  return (
    // ImageBackground: muestra fondoRestablecer.png como fondo de pantalla completa.
    // resizeMode="cover" escala la imagen para cubrir todo el espacio sin dejar bordes.
    <ImageBackground
      source={require('../../assets/images/fondoRestablecer.png')}
      style={restablecerStyles.background}
      resizeMode="cover"
    >
      {/* Capa semitransparente superpuesta al fondo para mejorar la legibilidad */}
      <View style={restablecerStyles.overlay} />

      {/* KeyboardAvoidingView: en iOS aplica padding automático cuando aparece el teclado.
          En Android se omite (undefined) porque el SO lo gestiona por defecto. */}
      <KeyboardAvoidingView style={restablecerStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ScrollView: habilita el desplazamiento si el contenido supera la altura de pantalla.
            keyboardShouldPersistTaps="handled" permite tocar botones sin cerrar el teclado primero.
            showsVerticalScrollIndicator={false} oculta la barra de desplazamiento. */}
        <ScrollView contentContainerStyle={restablecerStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Animated.View: tarjeta principal con animación de entrada.
              Combina opacidad y desplazamiento vertical mediante los valores animados. */}
          <Animated.View style={[restablecerStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Logo de la empresa; contentFit="contain" preserva la proporción sin recortar */}
            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={restablecerStyles.logo} />

            {/* Título principal de la pantalla */}
            <Text style={restablecerStyles.title}>¿OLVIDASTE TU CONTRASEÑA?</Text>

            {/* Instrucción para guiar al usuario sobre qué debe ingresar */}
            <Text style={restablecerStyles.subtitle}>
              Ingresa el correo con el que te registraste para restablecer tu contraseña.
            </Text>

            {/* Campo de correo electrónico*/}
            {/* inputError aplica un borde rojo cuando errEmail tiene contenido */}
            <TextInput
              style={[restablecerStyles.input, errEmail ? restablecerStyles.inputError : null]}
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"   // Gris claro para el texto de placeholder
              keyboardType="email-address"      // Teclado con @ visible por defecto
              autoCapitalize="none"             // Desactiva la capitalización automática
              value={email}                     // Valor controlado por el estado email
              // Al escribir: actualiza el estado y borra el error previo del campo
              onChangeText={(t) => { setEmail(t); setErrEmail(''); }}
            />
            {/* Muestra el texto de error debajo del campo solo cuando existe */}
            {errEmail ? <Text style={restablecerStyles.errorText}>{errEmail}</Text> : null}

            {/* Botón de envío*/}
            {/* La función de estilo recibe { pressed } para aplicar estilo visual al presionar */}
            <Pressable
              style={({ pressed }) => [restablecerStyles.button, pressed && restablecerStyles.buttonPressed]}
              onPress={handleSend}
              disabled={loading} // Deshabilita el botón durante la carga para evitar doble envío
            >
              {/* Render prop: recibe { pressed } para cambiar también el estilo del texto */}
              {({ pressed }) => (
                <Text style={[restablecerStyles.buttonText, pressed && restablecerStyles.buttonTextPressed]}>
                  {/* Texto dinámico: "Cargando..." durante la petición, texto normal en reposo */}
                  {loading ? 'Cargando...' : 'Restablecer contraseña'}
                </Text>
              )}
            </Pressable>

            {/* Enlace para volver al login*/}
            {/* router.back() navega a la pantalla anterior en el historial de navegación */}
            <Pressable onPress={() => router.back()} style={restablecerStyles.backRow}>
              <Text style={restablecerStyles.backText}>← Volver al inicio de sesión</Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
