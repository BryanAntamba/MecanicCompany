import { useEffect, useRef, useState } from 'react';
import {
  Animated, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import cambiarStyles from '@/Styles/cambiarPassword';
import { validarContrasena } from '@/utils/validaciones';
import { authApi } from '@/utils/api';

export default function CambiarPasswordScreen() {
  const router = useRouter();
  // resetToken recibido de codigoVerificacion (JWT de 10 min)
  const { resetToken = '' } = useLocalSearchParams<{ resetToken: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errNew, setErrNew] = useState('');
  const [errConfirm, setErrConfirm] = useState('');
  // Mensaje de éxito — se muestra inline en lugar de un Alert modal
  const [successMsg, setSuccessMsg] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

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
    setSuccessMsg('');
    if (!validar()) return;

    setLoading(true);
    try {
      await authApi.cambiarPassword(resetToken, newPassword);
      setSuccessMsg('\u2705 Contraseña actualizada correctamente.');
    } catch (err: any) {
      setErrNew(err?.message ?? 'No se pudo cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fondoCodigoVerificacion.png')}
      style={cambiarStyles.background}
      resizeMode="cover"
    >
      <View style={cambiarStyles.overlay} />
      <KeyboardAvoidingView style={cambiarStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={cambiarStyles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[cambiarStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={cambiarStyles.logo} />
            <Text style={cambiarStyles.title}>NUEVA CONTRASEÑA</Text>
            <Text style={cambiarStyles.subtitle}>Ingresa y confirma tu nueva contraseña para recuperar el acceso.</Text>

            {/* Campo: nueva contraseña */}
            <Text style={cambiarStyles.label}>Nueva contraseña</Text>
            <View style={[cambiarStyles.passwordRow, errNew ? cambiarStyles.inputError : null]}>
              <TextInput
                style={cambiarStyles.passwordInput}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={(t) => { setNewPassword(t); setErrNew(''); }}
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
                <Text style={[cambiarStyles.buttonText, pressed && cambiarStyles.buttonTextPressed]}>
                  {loading ? 'Guardando...' : 'Guardar contraseña'}
                </Text>
              )}
            </Pressable>

            {/* Mensaje de éxito con botón para ir al login */}
            {successMsg ? (
              <View style={{ alignItems: 'center', marginTop: 4 }}>
                <Text style={cambiarStyles.successText}>{successMsg}</Text>
                <Pressable
                  style={({ pressed }) => [cambiarStyles.button, pressed && cambiarStyles.buttonPressed]}
                  onPress={() => router.replace('/(auth)/login')}
                >
                  {({ pressed }) => (
                    <Text style={[cambiarStyles.buttonText, pressed && cambiarStyles.buttonTextPressed]}>Ir al login</Text>
                  )}
                </Pressable>
              </View>
            ) : null}

            <Pressable onPress={() => router.back()} style={cambiarStyles.backRow}>
              <Text style={cambiarStyles.backText}>← Volver atrás</Text>
            </Pressable>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
