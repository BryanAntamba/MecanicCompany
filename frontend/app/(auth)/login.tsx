import { useEffect, useRef, useState } from 'react';
import {
  Animated, BackHandler, ImageBackground, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginStyles from '@/Styles/auth/login';
import { validarContrasena, validarCredencial } from '@/utils/validaciones';
import { useAuth } from '@/context/AuthContext';
import { verificarUsuario } from '@/utils/datosSimulados';
import { useCliente } from '@/context/ClienteContext';
import ResponsiveContainer from '@/components/ResponsiveContainer';

export default function LoginScreen() {
  const router = useRouter();
  const { login, setSession } = useAuth();
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

  // Detectar si completamos el password reset desde sessionStorage
  const passwordResetCompletedRef = useRef(
    Platform.OS === 'web' && sessionStorage.getItem('passwordResetCompleted') === 'true'
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // Si completamos password reset, bloquear COMPLETAMENTE el retroceso
  useEffect(() => {
    if (Platform.OS === 'web' && passwordResetCompletedRef.current) {
      // Limpiar la bandera
      sessionStorage.removeItem('passwordResetCompleted');
      
      // Bloquear el retroceso permanentemente en esta sesión
      const blockBack = (e: PopStateEvent) => {
        e.preventDefault();
        // Mantener en la página actual
        window.history.pushState(null, '', window.location.href);
        // Opcionalmente, redirigir al index
        window.location.href = '/PantallaCliente';
      };
      
      // Agregar múltiples entradas para "absorber" intentos de retroceso
      window.history.pushState(null, '', window.location.href);
      window.history.pushState(null, '', window.location.href);
      window.history.pushState(null, '', window.location.href);
      
      window.addEventListener('popstate', blockBack);
      
      return () => {
        window.removeEventListener('popstate', blockBack);
      };
    }
  }, []);

  // BackHandler para retroceder - Bloquear completamente
  useEffect(() => {
    const esDesdePasswordReset = passwordResetCompletedRef.current;
    
    const handleBack = () => {
      if (Platform.OS === 'web') {
        // No hacer nada, bloquear el retroceso
        // Mantener en la página actual agregando entrada al historial
        window.history.pushState(null, '', window.location.href);
      } else {
        // En móvil, bloquear también (no permitir salir del login)
        return true; // Esto consume el evento sin hacer nada
      }
    };

    if (Platform.OS === 'web') {
      // Si NO venimos de password reset, agregar el listener normal
      if (!esDesdePasswordReset) {
        const handlePopState = (e: PopStateEvent) => {
          e.preventDefault();
          handleBack();
        };

        // Agregar entrada inicial para prevenir retroceso
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }
    } else {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // En móvil, ir a PantallaCliente
        router.replace('/PantallaCliente' as any);
        return true;
      });
      return () => backHandler.remove();
    }
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
          // IMPORTANTE: Usar router.replace para mantener sesión en memoria
          router.replace('/PantallaCliente' as any);
        } else {
          setErrGeneral('Ingrese una credencial válida.');
        }
      } else if (correoLower.endsWith('@inventariomecanic.com')) {
        // Usuario de inventario - verificar en datos simulados
        const usuario = verificarUsuario(correoLower, password);
        
        if (usuario) {
          // Crear datos de usuario para AuthContext
          const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
          const tokenSimulado = `simulado-inventario-${Date.now()}`;
          const usuarioSimulado = {
            id: `sim-inv-${Date.now()}`,
            nombres: usuario.nombre,
            apellidos: usuario.apellido,
            correoEmpresarial: correoLower,
            especialidad: 'Inventario',
            estadoLaboral: 'Disponible',
            esAdmin: false,
            tipoPersonal: 'Inventario',
          };
          
          // Guardar en AuthContext (que usa sessionStorage en web)
          await setSession(tokenSimulado, usuarioSimulado);
          
          // También guardar en AsyncStorage para compatibilidad con código existente
          await AsyncStorage.setItem('inventario_user', JSON.stringify({
            correo: correoLower,
            nombreCompleto,
            tipoPersonal: 'Inventario',
            esAdmin: false
          }));
          
          // Redirigir a sistema de inventario
          router.replace('/pantallaInventario/sistemaInventario' as any);
        } else {
          setErrGeneral('Ingrese una credencial válida.');
        }
      } else if (correoLower.endsWith('@finanzasmecanic.com')) {
        // Usuario financiero - verificar en datos simulados
        const usuario = verificarUsuario(correoLower, password);
        
        if (usuario) {
          // Crear datos de usuario para AuthContext
          const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
          const tokenSimulado = `simulado-financiero-${Date.now()}`;
          const usuarioSimulado = {
            id: `sim-fin-${Date.now()}`,
            nombres: usuario.nombre,
            apellidos: usuario.apellido,
            correoEmpresarial: correoLower,
            especialidad: 'Financiero',
            estadoLaboral: 'Disponible',
            esAdmin: false,
            tipoPersonal: 'Financiero',
          };
          
          // Guardar en AuthContext (que usa sessionStorage en web)
          await setSession(tokenSimulado, usuarioSimulado);
          
          // También guardar en AsyncStorage para compatibilidad con código existente
          await AsyncStorage.setItem('financiero_user', JSON.stringify({
            correo: correoLower,
            nombreCompleto,
            tipoPersonal: 'Financiero',
            esAdmin: false
          }));
          
          // Redirigir a sistema financiero
          router.replace('/SeccionFinanciero/financiero' as any);
        } else {
          setErrGeneral('Ingrese una credencial válida.');
        }
      } else if (correoLower.endsWith('@mecanic.com')) {
        // Primero intentar con datos simulados
        const usuario = verificarUsuario(correoLower, password);
        
        if (usuario) {
          // Usuario mecánico encontrado en datos simulados
          const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
          
          // Crear un token simulado y usuario simulado para el AuthContext
          const tokenSimulado = `simulado-mecanico-${Date.now()}`;
          const usuarioSimulado = {
            id: `sim-${Date.now()}`,
            nombres: usuario.nombre,
            apellidos: usuario.apellido,
            correoEmpresarial: correoLower,
            especialidad: 'General',
            estadoLaboral: 'Disponible',
            esAdmin: false,
            tipoPersonal: 'Mecánico',
          };
          
          console.log('🔐 LOGIN - Usuario simulado creado:', usuarioSimulado);
          
          // Usar setSession para actualizar el contexto Y AsyncStorage
          await setSession(tokenSimulado, usuarioSimulado);
          
          console.log('💾 LOGIN - Sesión establecida en contexto');
          
          // Ir al index que hará la redirección correcta según el tipoPersonal
          console.log('➡️ LOGIN - Redirigiendo a /');
          router.replace('/' as any);
          return;
        } else {
          // Si no está en simulados, intentar con API real (admin y otros mecánicos)
          try {
            const user = await login(correoLower, password);
            console.log('🔐 LOGIN - Usuario desde API:', user);

            // Ir al index que hará la redirección correcta
            router.replace('/' as any);
            return;
          } catch (apiError) {
            setErrGeneral('Ingrese una credencial válida.');
          }
        }
      } else {
        setErrGeneral('Ingrese una credencial válida.');
      }
    } catch (err: any) {
      setErrGeneral('Ingrese una credencial válida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
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
              onPress={() => {
                // Usar router.replace para no perder sesión de clientes en memoria
                router.replace('/PantallaCliente' as any);
              }}
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
              <Pressable onPress={() => router.push('/(auth)/registroUsuario' as any)} style={loginStyles.forgotRow}>
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
                  <View style={loginStyles.buttonContent}>
                    <FontAwesome 
                      name="sign-in" 
                      size={20} 
                      color={pressed ? '#FFFFFF' : '#000000'}
                      style={loginStyles.buttonIcon}
                    />
                    <Text style={[loginStyles.buttonText, pressed && loginStyles.buttonTextPressed]}>
                      {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Error general de credenciales — centrado debajo del botón */}
              {errGeneral ? <Text style={loginStyles.errorTextCentered}>{errGeneral}</Text> : null}

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ResponsiveContainer>
  );
}
