import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import restablecerStyles from '@/Styles/auth/restablecimientoPassword';
import { validarCorreoGmail } from '@/utils/validaciones';
import { buscarUsuarioPorCorreo } from '@/utils/datosSimulados';

export default function RestablecimientoPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errEmail, setErrEmail] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // BackHandler: va de regreso al login
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSend = async () => {
    const eFormato = validarCorreoGmail(email);
    if (eFormato) {
      setErrEmail(eFormato);
      return;
    }

    setLoading(true);
    try {
      // Verificar que el correo exista en los datos simulados
      const usuario = buscarUsuarioPorCorreo(email.trim().toLowerCase());
      
      if (!usuario) {
        setErrEmail('El correo ingresado no está registrado en el sistema.');
        setLoading(false);
        return;
      }

      // Simular envío de código (en producción llamaría al API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      <KeyboardAvoidingView 
        style={restablecerStyles.keyboardView} 
        behavior='height'
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          ref={scrollRef}
          contentContainerStyle={restablecerStyles.scrollContent} 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false}
        >
          {/* Botón regresar */}
          <Pressable
            onPress={() => router.back()}
            style={restablecerStyles.backButton}
            hitSlop={8}
          >
            <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
          </Pressable>

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
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
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

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
