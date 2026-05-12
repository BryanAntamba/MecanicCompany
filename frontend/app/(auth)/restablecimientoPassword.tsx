import { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import restablecerStyles from '@/Styles/restablecimientoPaswword';
import { validarCorreoMecanic } from '@/utils/validaciones';

export default function RestablecimientoPasswordScreen() {
  const router = useRouter();

  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [errEmail, setErrEmail] = useState('');

  const slideAnim   = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim,   { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const DEV_RECOVERY_EMAIL = 'bryan@mecanic.com';

  const handleSend = async () => {
    const eEmail = validarCorreoMecanic(email);
    setErrEmail(eEmail ?? '');
    if (eEmail) return; // Muestra el error debajo del campo y detiene el envío

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (email.trim().toLowerCase() !== DEV_RECOVERY_EMAIL) {
        throw new Error('El correo ingresado no está registrado en el sistema.');
      }
      router.push('/(auth)/cambiarPassword' as any);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondoRestablecer.png')}
      style={restablecerStyles.background}
      resizeMode="cover"
    >
      <View style={restablecerStyles.overlay} />
      <KeyboardAvoidingView style={restablecerStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={restablecerStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[restablecerStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={restablecerStyles.logo} />
            <Text style={restablecerStyles.title}>¿OLVIDASTE TU CONTRASEÑA?</Text>
            <Text style={restablecerStyles.subtitle}>
              Ingresa el correo con el que te registraste para restablecer tu contraseña.
            </Text>

            {/* Campo: correo @mecanic.com */}
            <TextInput
              style={[restablecerStyles.input, errEmail ? restablecerStyles.inputError : null]}
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrEmail(''); }}
            />
            {errEmail ? <Text style={restablecerStyles.errorText}>{errEmail}</Text> : null}

            <Pressable
              style={({ pressed }) => [restablecerStyles.button, pressed && restablecerStyles.buttonPressed]}
              onPress={handleSend}
              disabled={loading}
            >
              {({ pressed }) => (
                <Text style={[restablecerStyles.buttonText, pressed && restablecerStyles.buttonTextPressed]}>
                  {loading ? 'Cargando...' : 'Restablecer contraseña'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.back()} style={restablecerStyles.backRow}>
              <Text style={restablecerStyles.backText}>← Volver al inicio de sesión</Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
