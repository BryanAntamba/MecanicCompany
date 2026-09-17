import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

// Importar estilos desde la carpeta auth
import cambiarStyles from '@/Styles/auth/cambiarPassword';

// Modal de confirmación
import ConfirmacionPasswordNuevo from './modalAuth/confirmacionPasswordNuevo';

import { validarContrasena } from '@/utils/validaciones';
import { actualizarContrasena } from '@/utils/datosSimulados';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export default function CambiarPasswordScreen() {
  const router = useRouter();
  // Correo recibido de codigoVerificacion
  const { correo = '' } = useLocalSearchParams<{ correo: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errNew, setErrNew] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  
  // Modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Manejar botón atrás - Ir a restablecimientoPassword
    const handleBack = () => {
      if (Platform.OS === 'web') {
        // En web, usar window.location para limpiar historial
        window.location.href = '/(auth)/restablecimientoPassword';
      } else {
        router.replace('/(auth)/restablecimientoPassword' as any);
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
  }, [router, correo]);

  const validar = (): boolean => {
    let ok = true;

    const eNew = validarContrasena(newPassword, 'La nueva contraseña');
    setErrNew(eNew ?? '');
    if (eNew) ok = false;

    if (!confirmPassword.trim()) {
      setErrConfirm('Confirmar contraseña es obligatorio.');
      ok = false;
    } else if (newPassword !== confirmPassword) {
      setErrConfirm('Las contraseñas no coinciden.');
      ok = false;
    } else {
      setErrConfirm('');
    }

    return ok;
  };

  const handleReset = async () => {
    if (!validar()) return;

    setLoading(true);
    try {
      // Simular cambio de contraseña con datos simulados
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar la contraseña en los datos simulados
      const actualizado = actualizarContrasena(correo, newPassword);
      
      if (!actualizado) {
        setErrNew('No se pudo actualizar la contraseña. Intenta de nuevo.');
        setLoading(false);
        return;
      }
      
      // Muestra el modal de confirmación
      setModalVisible(true);
      
      // Después de 3 segundos, cierra el modal y usa replace para ir al login
      // con parámetro fromPasswordReset para limpiar el historial al retroceder
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/(auth)/login?fromPasswordReset=true' as any);
      }, 3000);
    } catch (err: any) {
      setErrNew(err?.message ?? 'No se pudo cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <ImageBackground
        source={require('../../assets/images/fondoCodigoVerificacion.png')}
        style={cambiarStyles.background}
        resizeMode="cover"
      >
        <View style={cambiarStyles.overlay} />
        <KeyboardAvoidingView
          style={cambiarStyles.keyboardView}
          behavior='height'
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={cambiarStyles.scrollContent}
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
              style={cambiarStyles.backButton}
              hitSlop={8}
            >
              <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
            </Pressable>

            <Animated.View style={[cambiarStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

              <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={cambiarStyles.logo} />
              <Text style={cambiarStyles.title}>NUEVA CONTRASEÑA</Text>
              <Text style={cambiarStyles.subtitle}>Ingresa y confirma tu nueva contraseña para recuperar el acceso.</Text>

              {/* Campo: nueva contraseña */}
              <Text style={cambiarStyles.label}>Nueva contraseña</Text>
              <View style={[cambiarStyles.passwordRow, errNew ? cambiarStyles.inputError : null]}>
                <TextInput
                  style={cambiarStyles.passwordInput}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={(t) => { setNewPassword(t); setErrNew(''); }}
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
                />
                <Pressable onPress={() => setShowNew((v) => !v)} style={cambiarStyles.eyeBtn} hitSlop={8}>
                  <FontAwesome name={showNew ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
                </Pressable>
              </View>
              {errNew ? <Text style={cambiarStyles.errorText}>{errNew}</Text> : null}

              {/* Campo: confirmar contraseña */}
              <Text style={cambiarStyles.label}>Confirmar contraseña</Text>
              <View style={[cambiarStyles.passwordRow, errConfirm ? cambiarStyles.inputError : null]}>
                <TextInput
                  style={cambiarStyles.passwordInput}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setErrConfirm(''); }}
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
                />
                <Pressable onPress={() => setShowConfirm((v) => !v)} style={cambiarStyles.eyeBtn} hitSlop={8}>
                  <FontAwesome name={showConfirm ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
                </Pressable>
              </View>
              {errConfirm ? <Text style={cambiarStyles.errorText}>{errConfirm}</Text> : null}

              <Pressable
                style={({ pressed }) => [cambiarStyles.button, pressed && cambiarStyles.buttonPressed]}
                onPress={handleReset}
                disabled={loading}
              >
                {({ pressed }) => (
                  <View style={cambiarStyles.buttonContent}>
                    <FontAwesome 
                      name="save" 
                      size={20} 
                      color={pressed ? '#FFFFFF' : '#000000'} 
                      style={cambiarStyles.buttonIcon}
                    />
                    <Text style={[cambiarStyles.buttonText, pressed && cambiarStyles.buttonTextPressed]}>
                      {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </Text>
                  </View>
                )}
              </Pressable>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal de confirmación */}
        <ConfirmacionPasswordNuevo
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            if (Platform.OS === 'web') {
              // Marcar en sessionStorage que completamos el cambio de contraseña
              sessionStorage.setItem('passwordResetCompleted', 'true');
              // Navegar al login
              window.location.href = '/(auth)/login';
            } else {
              router.replace('/(auth)/login?fromPasswordReset=true' as any);
            }
          }}
        />
      </ImageBackground>
    </ResponsiveContainer>
  );
}
