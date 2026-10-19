import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import restablecerStyles from '@/Styles/auth/restablecimientoPassword';
import { validarCorreoGmail } from '@/utils/validaciones';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

const BASE_URL = 'http://192.168.1.12:3000/api';

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

  // Manejar botón atrás - Ir a login (limpiando historial en web)
  useEffect(() => {
    const handleBack = () => {
      if (Platform.OS === 'web') {
        // En web, usar window.location para limpiar historial
        window.location.href = '/(auth)/login';
      } else {
        router.replace('/(auth)/login' as any);
      }
    };

    if (Platform.OS === 'web') {
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        handleBack();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [router]);

  const handleSend = async () => {
    const correoLower = email.trim().toLowerCase();
    
    console.log('🔍 [RESTABLECER] Intentando recuperar contraseña para:', correoLower);
    
    // Solo permitir correos @gmail.com para recuperación de contraseña
    const eFormato = validarCorreoGmail(email);
    
    if (eFormato) {
      console.error('❌ [RESTABLECER] Error de validación:', eFormato);
      setErrEmail(eFormato);
      return;
    }

    setLoading(true);
    try {
      const url = `${BASE_URL}/auth/cliente/recuperar-contrasena`;
      console.log('📤 [RESTABLECER] POST a:', url);
      
      // Llamada real al API para enviar código de recuperación
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoLower }),
      });

      console.log('📥 [RESTABLECER] Response status:', response.status);
      console.log('📥 [RESTABLECER] Content-Type:', response.headers.get('content-type'));

      // Obtener el texto de respuesta primero
      const responseText = await response.text();
      console.log('📥 [RESTABLECER] Response body (primeros 500 chars):', responseText.substring(0, 500));

      if (!response.ok) {
        console.error('❌ [RESTABLECER] Response no OK. Status:', response.status);
        
        // Intentar parsear como JSON
        try {
          const error = JSON.parse(responseText);
          throw new Error(error.message || 'Error en servidor');
        } catch {
          // Si no es JSON, es probablemente HTML de error
          throw new Error(`Error del servidor (${response.status}): ${responseText.substring(0, 100)}`);
        }
      }

      const data = JSON.parse(responseText);
      console.log('✅ [RESTABLECER] Success:', data);

      // Pasa el correo a la siguiente pantalla como parámetro con tipo=recuperacion
      router.push(`/(auth)/codigoVerificacion?correo=${encodeURIComponent(correoLower)}&tipo=recuperacion` as any);
    } catch (err: any) {
      console.error('❌ [RESTABLECER] Exception:', err);
      setErrEmail(err?.message ?? 'No se pudo enviar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
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
            onPress={() => {
              if (Platform.OS === 'web') {
                window.location.href = '/(auth)/login';
              } else {
                router.replace('/(auth)/login' as any);
              }
            }}
            style={restablecerStyles.backButton}
            hitSlop={8}
          >
            <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
          </Pressable>

          <Animated.View style={[restablecerStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={restablecerStyles.logo} />
            <Text style={restablecerStyles.title}>¿OLVIDASTE TU CONTRASEÑA?</Text>
            <Text style={restablecerStyles.subtitle}>
              Ingresa tu correo con el que te registraste para restablecer tu contraseña.
            </Text>

            <TextInput
              style={[restablecerStyles.input, errEmail ? restablecerStyles.inputError : null]}
              placeholder="ejemplo@gmail.com"
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
                <View style={restablecerStyles.buttonContent}>
                  <FontAwesome 
                    name="key" 
                    size={20} 
                    color={pressed ? '#FFFFFF' : '#000000'} 
                    style={restablecerStyles.buttonIcon}
                  />
                  <Text style={[restablecerStyles.buttonText, pressed && restablecerStyles.buttonTextPressed]}>
                    {loading ? 'Cargando...' : 'Restablecer contraseña'}
                  </Text>
                </View>
              )}
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
    </ResponsiveContainer>
  );
}
