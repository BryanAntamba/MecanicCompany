import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import loginStyles from '@/Styles/auth/login';
import { validarContrasena, validarCredencial } from '@/utils/validaciones';
import { useAuth } from '@/context/AuthContext';
import { verificarUsuario } from '@/utils/datosSimulados';
import { useCliente } from '@/context/ClienteContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { iniciarSesionCliente } = useCliente();
  // Detectar si viene de un cierre de sesión o de cambio de contraseña exitoso
  const params = useLocalSearchParams<{ fromLogout?: string; fromPasswordReset?: string }>();
  
  // Almacenar en ref para que el BackHandler pueda acceder incluso después de limpiar parámetros
  const fromLogoutRef = useRef(params.fromLogout === 'true');
  const fromPasswordResetRef = useRef(params.fromPasswordReset === 'true');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  // Error general de credenciales — se muestra debajo del botón sin modal
  const [errGeneral, setErrGeneral] = useState('');

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // BackHandler para retroceder
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Usar los ref para mantener el valor original incluso después de limpiar parámetros
      const esDesdeLogout = fromLogoutRef.current;
      const esDesdePasswordReset = fromPasswordResetRef.current;
      
      if (esDesdeLogout || esDesdePasswordReset) {
        // Ir directo al index
        router.replace('/PantallaCliente' as any);
        return true; // Consumir el evento
      } else {
        // Navegación normal
        router.back();
        return true; // Consumir el evento
      }
    });

    return () => backHandler.remove();
  }, [router]);

  const validar = (): boolean => {
    const eEmail = validarCredencial(email);
    const ePassword = validarContrasena(password, 'La contraseña');
    setErrEmail(eEmail ?? '');
    setErrPassword(ePassword ?? '');
    return !eEmail && !ePassword;
  };

  const handleLogin = async () => {
    setErrGeneral('');
    if (!validar()) return;

    setLoading(true);
    try {
      const correoLower = email.trim().toLowerCase();
      
      // Si es un correo @gmail.com, verificar en datosSimulados (usuarios clientes)
      if (correoLower.endsWith('@gmail.com')) {
        const usuario = verificarUsuario(correoLower, password);
        
        if (usuario) {
          // Guardar sesión del cliente
          const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
          await iniciarSesionCliente(correoLower, nombreCompleto);
          
          // Usuario cliente encontrado, redirigir a pantalla de cliente
          router.replace('/PantallaCliente' as any);
        } else {
          setErrGeneral('Correo o contraseña incorrectos.');
        }
      } else {
        // Si es @mecanic.com, usar la API real (mecánicos y admin)
        const user = await login(correoLower, password);

        // Redirige según el rol
        if (user.esAdmin) {
          router.replace('/Admin/GestionUsuarios' as any);
        } else {
          router.replace('/SeccionMecanico/ReportesClientes' as any);
        }
      }
    } catch (err: any) {
      setErrGeneral(err?.message ?? 'Correo o contraseña incorrectos.');
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
      
      <KeyboardAvoidingView
        style={loginStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={loginStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botón regresar */}
          <Pressable
            onPress={() => router.push('/PantallaCliente' as any)}
            style={loginStyles.backButton}
            hitSlop={8}
          >
            <FontAwesome name="arrow-left" size={24} color="#F8FAFC" />
          </Pressable>

          <Animated.View style={[loginStyles.card, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>

            <Image source={require('../../assets/images/iconoTransparente.png')} contentFit="contain" style={loginStyles.logo} />
            <Text style={loginStyles.title}>INICIAR SESIÓN</Text>
            <Text style={loginStyles.subtitle}>Ingresa tus credenciales para acceder al sistema.</Text>

            {/* Campo: credencial (correo) */}
            <Text style={loginStyles.fieldLabel}>Credencial</Text>
            <TextInput
              style={[loginStyles.input, errEmail ? loginStyles.inputError : null]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrEmail(''); setErrGeneral(''); }}
            />
            {errEmail ? <Text style={loginStyles.errorText}>{errEmail}</Text> : null}

            {/* Campo: contraseña */}
            <Text style={loginStyles.fieldLabel}>Contraseña</Text>
            <View style={[loginStyles.passwordRow, errPassword ? loginStyles.inputError : null]}>
              <TextInput
                style={loginStyles.passwordInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrPassword(''); setErrGeneral(''); }}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={loginStyles.eyeBtn} hitSlop={8}>
                <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#64748B" />
              </Pressable>
            </View>
            {errPassword ? <Text style={loginStyles.errorText}>{errPassword}</Text> : null}

            {/* Enlace registro */}
            <Pressable onPress={() => router.replace('/(auth)/registroUsuario' as any)} style={loginStyles.forgotRow}>
              <Text style={loginStyles.forgotText}>Registrarse</Text>
            </Pressable>

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

            {/* Error general de credenciales — centrado debajo del botón */}
            {errGeneral ? <Text style={loginStyles.errorTextCentered}>{errGeneral}</Text> : null}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
