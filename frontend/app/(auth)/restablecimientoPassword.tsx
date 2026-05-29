import { useEffect, useRef, useState } from 'react';
import {
  Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import restablecerStyles from '@/Styles/restablecimientoPaswword';
import { validarCorreoGmail } from '@/utils/validaciones';
import { authApi } from '@/utils/api';

export default function RestablecimientoPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errEmail, setErrEmail] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSend = async () => {
    const eFormato = validarCorreoGmail(email);
    if (eFormato) {
      setErrEmail(eFormato);
      return;
    }

    setLoading(true);
    try {
      await authApi.solicitarRecuperacion(email.trim().toLowerCase());
      // Pasa el correo a la siguiente pantalla como parámetro
      router.push(`/(auth)/codigoVerificacion?correo=${encodeURIComponent(email.trim().toLowerCase())}` as any);
    } catch (err: any) {
      setErrEmail(err?.message ?? 'No se pudo enviar el código. Intenta de nuevo.');
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
              Ingresa tu correo personal (@gmail.com) con el que te registraste para restablecer tu contraseña.
            </Text>

            <TextInput
              style={[restablecerStyles.input, errEmail ? restablecerStyles.inputError : null]}
              placeholder="Ingrese su correo personal"
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
