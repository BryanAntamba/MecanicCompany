import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Pressable, ScrollView, Text, TextInput, View, Platform, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

// Importar estilos desde la carpeta auth
import codigoStyles from '@/Styles/auth/codigoVerificacion';

import { validarCodigoVerificacion } from '@/utils/validaciones';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

const BASE_URL = 'http://192.168.1.12:3000/api';

export default function CodigoVerificacionScreen() {
  const router = useRouter();
  // Correo y tipo recibidos de la pantalla anterior
  const { correo = '', tipo = 'registro' } = useLocalSearchParams<{ correo: string; tipo: string }>();

  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errCodigo, setErrCodigo] = useState('');
  
  // Estados para control de reenvío
  const [intentosRestantes, setIntentosRestantes] = useState(5);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Manejar botón atrás - Ir atrás según el flujo
    const handleBack = () => {
      const backRoute = tipo === 'registro' 
        ? '/(auth)/registroUsuario' 
        : '/(auth)/restablecimientoPassword';
      
      if (Platform.OS === 'web') {
        window.location.href = backRoute;
      } else {
        router.replace(backRoute as any);
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
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleBack();
        return true;
      });
      
      return () => {
        backHandler.remove();
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [router, tipo]);

  const handleReenviarCodigo = async () => {
    if (bloqueado || enviandoCodigo) return;

    setEnviandoCodigo(true);
    setErrCodigo('');
    setMensajeExito('');

    try {
      // Llamada real al API para reenviar código
      const response = await fetch(`${BASE_URL}/auth/cliente/reenviar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo.trim().toLowerCase() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al reenviar código');
      }

      setMensajeExito('Código reenviado exitosamente');
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (err: any) {
      console.error('[REENVIAR_CODIGO] ❌ Error:', err);
      setErrCodigo(err?.message || 'Error al reenviar el código');
    } finally {
      setEnviandoCodigo(false);
    }
  };

  const handleVerificar = async () => {
    // Valida formato (6 dígitos) antes de continuar
    const err = validarCodigoVerificacion(codigo);
    if (err) {
      setErrCodigo(err);
      return;
    }

    setIsLoading(true);
    try {
      const correoNorm = correo.trim().toLowerCase();
      
      // Llamada real al API para verificar código
      const response = await fetch(`${BASE_URL}/auth/cliente/verificar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: correoNorm,
          codigo: codigo.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Código inválido o expirado');
      }

      const data = await response.json();
      console.log('[VERIFICAR_CODIGO] ✅ Éxito:', data);

      // Si es registro, ir a login
      // Si es recuperación, ir a cambiarPassword
      if (tipo === 'registro') {
        router.replace('/(auth)/login' as any);
      } else {
        router.push(`/(auth)/cambiarPassword?correo=${encodeURIComponent(correoNorm)}` as any);
      }
    } catch (err: any) {
      console.error('[VERIFICAR_CODIGO] ❌ Error:', err);
      setErrCodigo(err?.message ?? 'Código inválido o expirado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <ImageBackground
        source={require('../../assets/images/fondoCodigoVerificacion.png')}
        style={codigoStyles.background}
        resizeMode="cover"
      >
        <View style={codigoStyles.overlay} />
        <KeyboardAvoidingView
          style={codigoStyles.keyboardView}
          behavior='height'
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={codigoStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Botón regresar */}
            <Pressable
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.location.href = '/(auth)/restablecimientoPassword';
                } else {
                  router.replace('/(auth)/restablecimientoPassword' as any);
                }
              }}
              style={codigoStyles.backButton}
              hitSlop={8}
            >
              <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
            </Pressable>

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
                style={({ pressed }) => [
                  codigoStyles.button,
                  (pressed || isLoading) && codigoStyles.buttonPressed,
                  isLoading && { opacity: 0.6 }
                ]}
                onPress={handleVerificar}
                disabled={isLoading}
              >
                {({ pressed }) => (
                  <View style={codigoStyles.buttonContent}>
                    {!isLoading && (
                      <FontAwesome 
                        name="check-circle" 
                        size={20} 
                        color={pressed ? '#FFFFFF' : '#000000'} 
                        style={codigoStyles.buttonIcon}
                      />
                    )}
                    <Text style={[codigoStyles.buttonText, pressed && codigoStyles.buttonTextPressed]}>
                      {isLoading ? 'Verificando...' : 'Verificar código'}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Texto informativo y enlace de reenvío - DEBAJO DEL BOTÓN */}
              {!bloqueado && (
                <View style={codigoStyles.resendContainer}>
                  <Text style={codigoStyles.resendInfo}>
                    ¿No recibiste el código de 6 dígitos?
                  </Text>
                  <Pressable 
                    onPress={handleReenviarCodigo} 
                    style={codigoStyles.resendRow}
                    disabled={enviandoCodigo}
                  >
                    <Text style={codigoStyles.resendText}>
                      {enviandoCodigo ? 'Reenviando...' : 'Reenviar código'}
                    </Text>
                  </Pressable>
                  <Text style={codigoStyles.resendInfo}>
                    Intentos restantes: {intentosRestantes}
                  </Text>
                  {/* Mensaje de éxito debajo del enlace */}
                  {mensajeExito ? (
                    <Text style={codigoStyles.successText}>{mensajeExito}</Text>
                  ) : null}
                </View>
              )}

              {/* Temporizador cuando está bloqueado */}
              {bloqueado && tiempoRestante > 0 && (
                <View style={codigoStyles.blockedContainer}>
                  <Text style={codigoStyles.blockedText}>
                    Has excedido el límite de reenvíos.
                  </Text>
                  <Text style={codigoStyles.blockedText}>
                    Podrás intentar nuevamente en:
                  </Text>
                  <Text style={codigoStyles.timerText}>
                    {formatearTiempo(tiempoRestante)}
                  </Text>
                </View>
              )}

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ResponsiveContainer>
  );
}
