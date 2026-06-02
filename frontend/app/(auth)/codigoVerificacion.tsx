import { useEffect, useRef, useState } from 'react';
import {
  Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import codigoStyles from '@/Styles/codigoVerificacion';
import { validarCodigoVerificacion } from '@/utils/validaciones';
import { authApi } from '@/utils/api';

export default function CodigoVerificacionScreen() {
  const router = useRouter();
  // Correo personal recibido de la pantalla anterior
  const { correo = '' } = useLocalSearchParams<{ correo: string }>();

  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errCodigo, setErrCodigo] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleVerificar = async () => {
    // Valida formato (6 dígitos) antes de llamar al backend
    const err = validarCodigoVerificacion(codigo);
    if (err) {
      setErrCodigo(err);
      return;
    }

    setLoading(true);
    try {
      const { resetToken } = await authApi.verificarCodigo(correo, codigo.trim());
      // Pasa el resetToken (no el correo) a cambiarPassword
      router.push(`/(auth)/cambiarPassword?resetToken=${encodeURIComponent(resetToken)}` as any);
    } catch (err: any) {
      setErrCodigo(err?.message ?? 'Código inválido o expirado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondoCodigoVerificacion.png')}
      style={codigoStyles.background}
      resizeMode="cover"
    >
      <View style={codigoStyles.overlay} />
      <KeyboardAvoidingView
        style={codigoStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={codigoStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[codigoStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={codigoStyles.logo} />
            <Text style={codigoStyles.title}>CÓDIGO DE VERIFICACIÓN</Text>
            <Text style={codigoStyles.subtitle}>
              Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
            </Text>

            <TextInput
              style={[codigoStyles.input, errCodigo ? codigoStyles.inputError : null]}
              placeholder="000000"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={codigo}
              onChangeText={(t) => { setCodigo(t); setErrCodigo(''); }}
            />
            {errCodigo ? <Text style={codigoStyles.errorText}>{errCodigo}</Text> : null}

            <Pressable
              style={({ pressed }) => [codigoStyles.button, pressed && codigoStyles.buttonPressed]}
              onPress={handleVerificar}
              disabled={loading}
            >
              {({ pressed }) => (
                <Text style={[codigoStyles.buttonText, pressed && codigoStyles.buttonTextPressed]}>
                  {loading ? 'Verificando...' : 'Verificar código'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.back()} style={codigoStyles.backRow}>
              <Text style={codigoStyles.backText}>← Volver atrás</Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
