import { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import loginStyles from '@/Styles/login';
import { validarCorreoMecanic, validarContrasena } from '@/utils/validaciones';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  // Estados de error por campo
  const [errEmail, setErrEmail]       = useState('');
  const [errPassword, setErrPassword] = useState('');

  const slideAnim   = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim,   { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const ADMIN_EMAIL     = 'admin@mecanic.com';
  const ADMIN_PASSWORD  = 'admin123';
  const MECANICO_EMAIL    = 'bryan@mecanic.com';
  const MECANICO_PASSWORD = 'bryan123';

  // Valida todos los campos y retorna true si son válidos
  const validar = (): boolean => {
    const eEmail    = validarCorreoMecanic(email);
    const ePassword = validarContrasena(password, 'La contraseña');
    setErrEmail(eEmail ?? '');
    setErrPassword(ePassword ?? '');
    return !eEmail && !ePassword;
  };

  const handleLogin = async () => {
    if (!validar()) return; // Muestra errores debajo de cada campo y detiene el envío

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const lower = email.trim().toLowerCase();

      if (lower === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        router.replace('/Admin/GestionMecanicos' as any);
        return;
      }
      if (lower === MECANICO_EMAIL && password === MECANICO_PASSWORD) {
        router.replace('/SeccionMecanico/ReportesClientes' as any);
        return;
      }
      throw new Error('Correo o contraseña incorrectos.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondoLogin.png')}
      style={loginStyles.background}
      resizeMode="cover"
    >
      <View style={loginStyles.overlay} />
      <KeyboardAvoidingView style={loginStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={loginStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[loginStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={loginStyles.logo} />
            <Text style={loginStyles.title}>INICIA SESION</Text>
            <Text style={loginStyles.subtitle}>Ingresa tus credenciales para acceder al sistema.</Text>

            {/* Campo: correo empresarial */}
            <TextInput
              style={[loginStyles.input, errEmail ? loginStyles.inputError : null]}
              placeholder="Correo empresarial"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrEmail(''); }}
            />
            {errEmail ? <Text style={loginStyles.errorText}>{errEmail}</Text> : null}

            {/* Campo: contraseña */}
            <View style={[loginStyles.passwordRow, errPassword ? loginStyles.inputError : null]}>
              <TextInput
                style={loginStyles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrPassword(''); }}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={loginStyles.eyeBtn} hitSlop={8}>
                <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {errPassword ? <Text style={loginStyles.errorText}>{errPassword}</Text> : null}

            {/* Enlace recuperación */}
            <Pressable onPress={() => router.push('/(auth)/restablecimientoPassword' as any)} style={loginStyles.forgotRow}>
              <Text style={loginStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {/* Botón iniciar sesión */}
            <Pressable
              style={({ pressed }) => [loginStyles.button, pressed && loginStyles.buttonPressed]}
              onPress={handleLogin}
              disabled={loading}
            >
              {({ pressed }) => (
                <Text style={[loginStyles.buttonText, pressed && loginStyles.buttonTextPressed]}>
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
