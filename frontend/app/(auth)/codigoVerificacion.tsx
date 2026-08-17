import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

// Importar estilos desde la carpeta auth
import codigoStyles from '@/Styles/auth/codigoVerificacion';

import { validarCodigoVerificacion } from '@/utils/validaciones';
import { obtenerEstadoReenvio, obtenerTiempoRestanteBloqueo, reenviarCodigoVerificacion } from '@/utils/datosSimulados';

export default function CodigoVerificacionScreen() {
  const router = useRouter();
  // Correo personal recibido de la pantalla anterior
  const { correo = '' } = useLocalSearchParams<{ correo: string }>();

  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errCodigo, setErrCodigo] = useState('');
  
  // Estados para control de reenvío
  const [intentosRestantes, setIntentosRestantes] = useState(5);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0); // en segundos
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(''); // Mensaje de éxito separado

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // BackHandler: va de regreso a restablecimiento
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });

    // Verificar estado inicial de reenvíos
    verificarEstadoInicial();

    return () => {
      backHandler.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Verificar estado inicial al cargar la pantalla
  const verificarEstadoInicial = () => {
    const estado = obtenerEstadoReenvio(correo);
    setIntentosRestantes(estado.intentosRestantes);
    setBloqueado(estado.bloqueado);
    
    if (estado.bloqueado) {
      const tiempoRestante = obtenerTiempoRestanteBloqueo(correo);
      if (tiempoRestante > 0) {
        setTiempoRestante(tiempoRestante);
        iniciarTemporizador(tiempoRestante);
      } else {
        // Ya pasaron los 15 minutos, desbloquear
        setBloqueado(false);
        setIntentosRestantes(5);
      }
    }
  };

  // Iniciar temporizador de cuenta regresiva
  const iniciarTemporizador = (segundos: number) => {
    setTiempoRestante(segundos);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setBloqueado(false);
          setIntentosRestantes(5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Formatear tiempo en MM:SS
  const formatearTiempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleReenviarCodigo = async () => {
    if (bloqueado || enviandoCodigo) return;

    setEnviandoCodigo(true);
    setErrCodigo('');
    setMensajeExito('');

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const resultado = reenviarCodigoVerificacion(correo);
      
      if (resultado.bloqueado) {
        setBloqueado(true);
        setIntentosRestantes(0);
        iniciarTemporizador(resultado.tiempoRestante);
        setErrCodigo('Has alcanzado el límite de reenvíos. Espera 15 minutos.');
      } else {
        setIntentosRestantes(resultado.intentosRestantes);
        // Mostrar mensaje de éxito temporal
        setMensajeExito('Código reenviado exitosamente');
        setTimeout(() => setMensajeExito(''), 3000);
      }
    } catch (err: any) {
      setErrCodigo('Error al reenviar el código');
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

    setLoading(true);
    try {
      // Simular verificación del código (acepta cualquier código de 6 dígitos)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Pasa el correo a cambiarPassword para actualizar la contraseña
      router.push(`/(auth)/cambiarPassword?correo=${encodeURIComponent(correo)}` as any);
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
            onPress={() => router.back()}
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
  );
}
