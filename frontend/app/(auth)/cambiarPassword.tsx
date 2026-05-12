// cambiarPassword.tsx
// Pantalla para establecer una nueva contraseña.
// El usuario llega aquí después de verificar su correo en restablecimientoPassword.
// Debe ingresar y confirmar la nueva contraseña para recuperar el acceso.

// Importa hooks de React:
// useEffect → ejecuta la animación de entrada al montar el componente
// useRef    → almacena los valores animados sin provocar re-renders
// useState  → gestiona el estado local de los campos y errores del formulario
import { useEffect, useRef, useState } from 'react';

// Importa componentes de React Native:
// Alert              → diálogo nativo para confirmar éxito o mostrar errores
// Animated           → API de animaciones declarativas (opacidad y posición)
// ImageBackground    → imagen de fondo que cubre todo el contenedor
// KeyboardAvoidingView → desplaza el contenido para que el teclado no lo tape
// Platform           → detecta el SO para comportamientos específicos por plataforma
// Pressable          → área táctil con soporte para feedback visual de presión
// ScrollView         → permite desplazamiento vertical si el contenido es largo
// Text               → componente para renderizar texto
// TextInput          → campo de entrada de texto editable
// View               → contenedor de layout genérico
import {
  Alert, Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';

// useRouter: hook de expo-router para navegar entre pantallas programáticamente.
import { useRouter } from 'expo-router';

// Image de expo-image: versión optimizada con caché y mejor rendimiento que la nativa.
import { Image } from 'expo-image';

// FontAwesome: librería de íconos vectoriales (se usa para el ícono de ojo en contraseñas).
import { FontAwesome } from '@expo/vector-icons';

// Estilos específicos de esta pantalla, definidos en Styles/cambiarPassword.ts.
import cambiarStyles from '@/Styles/cambiarPassword';

// validarContrasena: valida que la contraseña no esté vacía y tenga al menos 6 caracteres.
// Retorna un string con el mensaje de error, o null si la contraseña es válida.
import { validarContrasena } from '@/utils/validaciones';

// Componente principal de la pantalla de cambio de contraseña.
// Se exporta como default para que expo-router lo registre como ruta.
export default function CambiarPasswordScreen() {
  // router: instancia de navegación para redirigir al login tras el cambio exitoso.
  const router = useRouter();

  // newPassword: valor actual del campo "Nueva contraseña".
  const [newPassword, setNewPassword]         = useState('');

  // confirmPassword: valor actual del campo "Confirmar contraseña".
  const [confirmPassword, setConfirmPassword] = useState('');

  // showNew: controla si la nueva contraseña se muestra en texto plano (true)
  // o enmascarada (false). Inicia oculta por seguridad.
  const [showNew, setShowNew]                 = useState(false);

  // showConfirm: controla la visibilidad del campo de confirmación de contraseña.
  const [showConfirm, setShowConfirm]         = useState(false);

  // loading: true mientras se procesa el cambio de contraseña.
  // Deshabilita el botón y muestra "Guardando..." para evitar envíos duplicados.
  const [loading, setLoading]                 = useState(false);

  // errNew: mensaje de error del campo "Nueva contraseña". Vacío = sin error.
  const [errNew, setErrNew]         = useState('');

  // errConfirm: mensaje de error del campo "Confirmar contraseña". Vacío = sin error.
  const [errConfirm, setErrConfirm] = useState('');

  // slideAnim: valor animado para el desplazamiento vertical (translateY) de la tarjeta.
  // Inicia en 60 px hacia abajo y anima hasta 0 (posición final en pantalla).
  const slideAnim   = useRef(new Animated.Value(60)).current;

  // opacityAnim: valor animado para la opacidad de la tarjeta.
  // Inicia en 0 (invisible) y anima hasta 1 (completamente visible).
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // useEffect sin dependencias: se ejecuta una única vez al montar el componente.
  // Lanza ambas animaciones en paralelo para el efecto de entrada de la tarjeta.
  useEffect(() => {
    Animated.parallel([
      // Desliza la tarjeta hacia arriba: translateY de 60 → 0 en 500 ms.
      Animated.timing(slideAnim,   { toValue: 0, duration: 500, useNativeDriver: true }),
      // Hace aparecer la tarjeta gradualmente: opacity de 0 → 1 en 500 ms.
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(); // Inicia ambas animaciones simultáneamente.
  }, []);

  // validar: ejecuta todas las validaciones del formulario de cambio de contraseña.
  // Actualiza los estados de error y retorna true si todo es válido, false si no.
  const validar = (): boolean => {
    // ok: bandera que acumula el resultado de todas las validaciones.
    // Inicia en true y se pone en false si alguna validación falla.
    let ok = true;

    // Valida la nueva contraseña con la función reutilizable.
    // El segundo argumento personaliza el nombre del campo en el mensaje de error.
    const eNew = validarContrasena(newPassword, 'La nueva contraseña');

    // Actualiza el estado de error de la nueva contraseña.
    setErrNew(eNew ?? '');

    // Si hay error en la nueva contraseña, marca el formulario como inválido.
    if (eNew) ok = false;

    // Validación del campo de confirmación
    if (!confirmPassword.trim()) {
      // El campo de confirmación está vacío: es obligatorio.
      setErrConfirm('Confirmar contraseña es obligatorio.');
      ok = false;
    } else if (newPassword === confirmPassword && !eNew) {
      // Las contraseñas coinciden y la nueva contraseña es válida: sin error.
      // (La condición !eNew evita limpiar el error si la nueva contraseña es inválida)
      setErrConfirm('');
    } else if (newPassword !== confirmPassword) {
      // Las contraseñas no coinciden: muestra error de coincidencia.
      setErrConfirm('Las contraseñas no coinciden.');
      ok = false;
    } else {
      // Cualquier otro caso válido: limpia el error de confirmación.
      setErrConfirm('');
    }

    // Retorna true solo si todas las validaciones pasaron sin errores.
    return ok;
  };

  // handleReset: función asíncrona que se ejecuta al presionar "Guardar contraseña".
  const handleReset = async () => {
    // Si la validación falla, muestra los errores en pantalla y no continúa.
    if (!validar()) return;

    // Activa el estado de carga para dar feedback visual al usuario.
    setLoading(true);
    try {
      // Simula una petición al servidor con un retardo de 1000 ms.
      // En producción se reemplazaría por una llamada real a la API de actualización.
      await new Promise((r) => setTimeout(r, 1000));

      // Muestra un diálogo de éxito con un botón que redirige al login.
      Alert.alert(
        'Contraseña actualizada',                                          // Título del diálogo
        'Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.', // Mensaje
        [
          {
            text: 'Ir al login',
            // Al presionar el botón, reemplaza la pantalla actual por el login.
            // replace() limpia el historial para que el usuario no pueda volver atrás.
            onPress: () => router.replace('/(auth)/login'),
          },
        ],
      );
    } catch {
      // Si ocurre cualquier error inesperado, muestra un diálogo de error genérico.
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Intenta de nuevo.');
    } finally {
      // Siempre desactiva el estado de carga, independientemente del resultado.
      setLoading(false);
    }
  };

  // Renderizado del componente
  return (
    // ImageBackground: muestra fondoCodigoVerificacion.png como fondo de pantalla.
    // resizeMode="cover" escala la imagen para cubrir todo el espacio disponible.
    <ImageBackground
      source={require('../../assets/images/fondoCodigoVerificacion.png')}
      style={cambiarStyles.background}
      resizeMode="cover"
    >
      {/* Capa semitransparente sobre el fondo para mejorar la legibilidad del contenido */}
      <View style={cambiarStyles.overlay} />

      {/* KeyboardAvoidingView: en iOS aplica padding para que el teclado no tape los inputs.
          En Android se omite (undefined) porque el SO lo gestiona automáticamente. */}
      <KeyboardAvoidingView style={cambiarStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ScrollView: permite desplazamiento si el contenido supera la altura de pantalla.
            keyboardShouldPersistTaps="handled" permite tocar botones sin cerrar el teclado.
            showsVerticalScrollIndicator={false} oculta la barra de desplazamiento. */}
        <ScrollView contentContainerStyle={cambiarStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Animated.View: tarjeta principal con animación de entrada.
              Aplica opacidad y desplazamiento vertical mediante los valores animados. */}
          <Animated.View style={[cambiarStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Logo de la empresa; contentFit="contain" preserva la proporción sin recortar */}
            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={cambiarStyles.logo} />

            {/* Título principal de la pantalla */}
            <Text style={cambiarStyles.title}>NUEVA CONTRASEÑA</Text>

            {/* Instrucción para guiar al usuario sobre qué debe hacer */}
            <Text style={cambiarStyles.subtitle}>Ingresa y confirma tu nueva contraseña para recuperar el acceso.</Text>

            {/* Campo: nueva contraseña*/}
            {/* Etiqueta visible encima del campo */}
            <Text style={cambiarStyles.label}>Nueva contraseña</Text>

            {/* passwordRow: contenedor flex-row que agrupa el input y el ícono del ojo.
                inputError aplica borde rojo cuando errNew tiene contenido. */}
            <View style={[cambiarStyles.passwordRow, errNew ? cambiarStyles.inputError : null]}>
              <TextInput
                style={cambiarStyles.passwordInput}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94A3B8"   // Gris claro para el placeholder
                // secureTextEntry oculta el texto cuando showNew es false
                secureTextEntry={!showNew}
                value={newPassword}              // Valor controlado por el estado
                // Al escribir: actualiza el estado y borra el error previo del campo
                onChangeText={(t) => { setNewPassword(t); setErrNew(''); }}
              />
              {/* Botón para alternar la visibilidad de la nueva contraseña.
                  hitSlop={8} amplía el área táctil 8px en cada dirección para mejor UX. */}
              <Pressable onPress={() => setShowNew((v) => !v)} style={cambiarStyles.eyeBtn} hitSlop={8}>
                {/* Cambia entre ícono de ojo abierto y ojo tachado según el estado */}
                <FontAwesome name={showNew ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {/* Muestra el mensaje de error de la nueva contraseña solo si existe */}
            {errNew ? <Text style={cambiarStyles.errorText}>{errNew}</Text> : null}

            {/* Campo: confirmar contraseña*/}
            {/* Etiqueta visible encima del campo de confirmación */}
            <Text style={cambiarStyles.label}>Confirmar contraseña</Text>

            {/* inputError aplica borde rojo cuando errConfirm tiene contenido */}
            <View style={[cambiarStyles.passwordRow, errConfirm ? cambiarStyles.inputError : null]}>
              <TextInput
                style={cambiarStyles.passwordInput}
                placeholder="Repite la contraseña"
                placeholderTextColor="#94A3B8"
                // secureTextEntry oculta el texto cuando showConfirm es false
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                // Al escribir: actualiza el estado y borra el error previo del campo
                onChangeText={(t) => { setConfirmPassword(t); setErrConfirm(''); }}
              />
              {/* Botón para alternar la visibilidad del campo de confirmación */}
              <Pressable onPress={() => setShowConfirm((v) => !v)} style={cambiarStyles.eyeBtn} hitSlop={8}>
                <FontAwesome name={showConfirm ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {/* Muestra el mensaje de error de confirmación solo si existe */}
            {errConfirm ? <Text style={cambiarStyles.errorText}>{errConfirm}</Text> : null}

            {/* Botón principal de guardar contraseña*/}
            {/* La función de estilo recibe { pressed } para aplicar estilo visual al presionar */}
            <Pressable
              style={({ pressed }) => [cambiarStyles.button, pressed && cambiarStyles.buttonPressed]}
              onPress={handleReset}
              disabled={loading} // Deshabilita el botón durante la carga para evitar doble envío
            >
              {/* Render prop: recibe { pressed } para cambiar también el estilo del texto */}
              {({ pressed }) => (
                <Text style={[cambiarStyles.buttonText, pressed && cambiarStyles.buttonTextPressed]}>
                  {/* Texto dinámico: "Guardando..." durante la petición, texto normal en reposo */}
                  {loading ? 'Guardando...' : 'Guardar contraseña'}
                </Text>
              )}
            </Pressable>

            {/* Enlace para volver a la pantalla anterior*/}
            {/* router.back() navega a la pantalla anterior en el historial (restablecimientoPassword) */}
            <Pressable onPress={() => router.back()} style={cambiarStyles.backRow}>
              <Text style={cambiarStyles.backText}>← Volver atrás</Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
